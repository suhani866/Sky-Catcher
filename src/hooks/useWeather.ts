import { useEffect, useState } from "react";

interface WeatherCondition {
  text: string;
  icon: string;
}

interface DayForecast {
  date: string; // YYYY-MM-DD
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  condition: WeatherCondition;
  avghumidity: number; // not available from Open-Meteo daily in our free config; kept for UI compatibility
  daily_chance_of_rain: number;
}

interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string;
    tz_id: string;
    latitude: number;
    longitude: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: WeatherCondition;
    humidity: number;
    wind_kph: number;
    cloud: number;
    is_day: number;
  };
  forecast: DayForecast[];
  hourly: HourlyForecast[];
}

type IpApiResponse = {
  city?: string;
  country_name?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
};

type OpenMeteoGeocodeResponse = {
  results?: Array<{
    name: string;
    country: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
};

export interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: string;
  is_day: number;
}

type OpenMeteoForecastResponse = {
  timezone: string;
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    cloud_cover: number;
    is_day: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max?: number[];
  };
};

const cToF = (c: number) => (c * 9) / 5 + 32;

const weatherCodeToText = (code: number): string => {
  // Open-Meteo weather codes: https://open-meteo.com/en/docs
  if (code === 0) return "Clear";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Fog";

  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 67) return "Rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Rain showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code === 95) return "Thunderstorm";
  if (code === 96 || code === 99) return "Thunderstorm (hail)";

  return "Clear";
};

const geocodeCity = async (query: string) => {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
  );

  if (!res.ok) throw new Error("Failed to geocode city");

  const data = (await res.json()) as OpenMeteoGeocodeResponse;
  const first = data.results?.[0];
  if (!first) throw new Error("City not found");

  return first;
};

const fetchOpenMeteoForecast = async (latitude: number, longitude: number, timezone: string) => {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,cloud_cover,is_day"
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,weather_code,is_day"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  url.searchParams.set("timezone", timezone);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch forecast");
  return (await res.json()) as OpenMeteoForecastResponse;
};

const reverseGeocode = async (latitude: number, longitude: number) => {
  // Use Open-Meteo's reverse geocoding via nominatim
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  );
  if (!res.ok) throw new Error("Reverse geocode failed");
  const data = await res.json();
  return {
    name: data.address?.city || data.address?.town || data.address?.village || data.name || "Unknown",
    country: data.address?.country || "",
  };
};

const getDefaultLocationFromIP = async () => {
  // ipapi gives us a real IANA timezone for the user location (perfect for timezone correctness).
  const res = await fetch("https://ipapi.co/json/");
  if (!res.ok) throw new Error("Failed IP lookup");
  const data = (await res.json()) as IpApiResponse;

  const name = data.city || "London";
  const country = data.country_name || "";
  const latitude = typeof data.latitude === "number" ? data.latitude : undefined;
  const longitude = typeof data.longitude === "number" ? data.longitude : undefined;
  const timezone = data.timezone || undefined;

  if (latitude != null && longitude != null && timezone) {
    return { name, country, latitude, longitude, timezone };
  }

  // Fallback to geocoding if IP data is incomplete.
  const geocoded = await geocodeCity(name);
  return {
    name: geocoded.name,
    country: geocoded.country,
    latitude: geocoded.latitude,
    longitude: geocoded.longitude,
    timezone: geocoded.timezone,
  };
};

// Saved locations helper
const SAVED_LOCATIONS_KEY = "weather_saved_locations";

export const getSavedLocations = (): string[] => {
  try {
    const saved = localStorage.getItem(SAVED_LOCATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const saveLocation = (city: string): string[] => {
  const locations = getSavedLocations();
  if (!locations.includes(city)) {
    const updated = [...locations, city].slice(-10); // Keep max 10
    localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated));
    return updated;
  }
  return locations;
};

export const removeLocation = (city: string): string[] => {
  const locations = getSavedLocations().filter((loc) => loc !== city);
  localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(locations));
  return locations;
};

export const useWeather = () => {
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedLocations, setSavedLocations] = useState<string[]>(getSavedLocations());

  const fetchWeather = async (city: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const place = await geocodeCity(city);
      const forecastRes = await fetchOpenMeteoForecast(place.latitude, place.longitude, place.timezone);

      const forecast: DayForecast[] = forecastRes.daily.time.slice(0, 5).map((date, idx) => {
        const maxC = forecastRes.daily.temperature_2m_max[idx];
        const minC = forecastRes.daily.temperature_2m_min[idx];
        const code = forecastRes.daily.weather_code[idx];
        const rainChance = forecastRes.daily.precipitation_probability_max?.[idx] ?? 0;

        return {
          date,
          maxtemp_c: maxC,
          maxtemp_f: cToF(maxC),
          mintemp_c: minC,
          mintemp_f: cToF(minC),
          condition: { text: weatherCodeToText(code), icon: "" },
          avghumidity: 0,
          daily_chance_of_rain: Math.round(rainChance),
        };
      });

      // Get next 24 hours of hourly data
      const currentHourIndex = forecastRes.hourly.time.findIndex(
        (t) => new Date(t) >= new Date(forecastRes.current.time)
      );
      const hourly: HourlyForecast[] = forecastRes.hourly.time
        .slice(currentHourIndex, currentHourIndex + 24)
        .map((time, idx) => {
          const actualIdx = currentHourIndex + idx;
          return {
            time,
            temp_c: forecastRes.hourly.temperature_2m[actualIdx],
            temp_f: cToF(forecastRes.hourly.temperature_2m[actualIdx]),
            condition: weatherCodeToText(forecastRes.hourly.weather_code[actualIdx]),
            is_day: forecastRes.hourly.is_day[actualIdx],
          };
        });

      setData({
        location: {
          name: place.name,
          country: place.country,
          localtime: forecastRes.current.time,
          tz_id: forecastRes.timezone,
          latitude: place.latitude,
          longitude: place.longitude,
        },
        current: {
          temp_c: forecastRes.current.temperature_2m,
          temp_f: cToF(forecastRes.current.temperature_2m),
          condition: { text: weatherCodeToText(forecastRes.current.weather_code), icon: "" },
          humidity: forecastRes.current.relative_humidity_2m,
          wind_kph: forecastRes.current.wind_speed_10m,
          cloud: forecastRes.current.cloud_cover,
          is_day: forecastRes.current.is_day,
        },
        forecast,
        hourly,
      });
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError("Could not fetch weather data for that city. Try a different name.");
    } finally {
      setIsLoading(false);
    }
  };

  const addSavedLocation = (city: string) => {
    const updated = saveLocation(city);
    setSavedLocations(updated);
  };

  const removeSavedLocation = (city: string) => {
    const updated = removeLocation(city);
    setSavedLocations(updated);
  };

  const fetchWeatherByCoords = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get timezone from Open-Meteo
      const tzRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
      );
      const tzData = await tzRes.json();
      const timezone = tzData.timezone || "UTC";

      // Get city name via reverse geocoding
      const geoInfo = await reverseGeocode(latitude, longitude);
      const forecastRes = await fetchOpenMeteoForecast(latitude, longitude, timezone);

      const forecast: DayForecast[] = forecastRes.daily.time.slice(0, 5).map((date, idx) => {
        const maxC = forecastRes.daily.temperature_2m_max[idx];
        const minC = forecastRes.daily.temperature_2m_min[idx];
        const code = forecastRes.daily.weather_code[idx];
        const rainChance = forecastRes.daily.precipitation_probability_max?.[idx] ?? 0;

        return {
          date,
          maxtemp_c: maxC,
          maxtemp_f: cToF(maxC),
          mintemp_c: minC,
          mintemp_f: cToF(minC),
          condition: { text: weatherCodeToText(code), icon: "" },
          avghumidity: 0,
          daily_chance_of_rain: Math.round(rainChance),
        };
      });

      const currentHourIndex = forecastRes.hourly.time.findIndex(
        (t) => new Date(t) >= new Date(forecastRes.current.time)
      );
      const hourly: HourlyForecast[] = forecastRes.hourly.time
        .slice(currentHourIndex, currentHourIndex + 24)
        .map((time, idx) => {
          const actualIdx = currentHourIndex + idx;
          return {
            time,
            temp_c: forecastRes.hourly.temperature_2m[actualIdx],
            temp_f: cToF(forecastRes.hourly.temperature_2m[actualIdx]),
            condition: weatherCodeToText(forecastRes.hourly.weather_code[actualIdx]),
            is_day: forecastRes.hourly.is_day[actualIdx],
          };
        });

      setData({
        location: {
          name: geoInfo.name,
          country: geoInfo.country,
          localtime: forecastRes.current.time,
          tz_id: forecastRes.timezone,
          latitude,
          longitude,
        },
        current: {
          temp_c: forecastRes.current.temperature_2m,
          temp_f: cToF(forecastRes.current.temperature_2m),
          condition: { text: weatherCodeToText(forecastRes.current.weather_code), icon: "" },
          humidity: forecastRes.current.relative_humidity_2m,
          wind_kph: forecastRes.current.wind_speed_10m,
          cloud: forecastRes.current.cloud_cover,
          is_day: forecastRes.current.is_day,
        },
        forecast,
        hourly,
      });
    } catch (err) {
      console.error("GPS weather fetch error:", err);
      setError("Could not fetch weather for your GPS location.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const loc = await getDefaultLocationFromIP();
        const forecastRes = await fetchOpenMeteoForecast(loc.latitude, loc.longitude, loc.timezone);

        const forecast: DayForecast[] = forecastRes.daily.time.slice(0, 5).map((date, idx) => {
          const maxC = forecastRes.daily.temperature_2m_max[idx];
          const minC = forecastRes.daily.temperature_2m_min[idx];
          const code = forecastRes.daily.weather_code[idx];
          const rainChance = forecastRes.daily.precipitation_probability_max?.[idx] ?? 0;

          return {
            date,
            maxtemp_c: maxC,
            maxtemp_f: cToF(maxC),
            mintemp_c: minC,
            mintemp_f: cToF(minC),
            condition: { text: weatherCodeToText(code), icon: "" },
            avghumidity: 0,
            daily_chance_of_rain: Math.round(rainChance),
          };
        });

        // Get next 24 hours of hourly data
        const currentHourIndex = forecastRes.hourly.time.findIndex(
          (t) => new Date(t) >= new Date(forecastRes.current.time)
        );
        const hourly: HourlyForecast[] = forecastRes.hourly.time
          .slice(currentHourIndex, currentHourIndex + 24)
          .map((time, idx) => {
            const actualIdx = currentHourIndex + idx;
            return {
              time,
              temp_c: forecastRes.hourly.temperature_2m[actualIdx],
              temp_f: cToF(forecastRes.hourly.temperature_2m[actualIdx]),
              condition: weatherCodeToText(forecastRes.hourly.weather_code[actualIdx]),
              is_day: forecastRes.hourly.is_day[actualIdx],
            };
          });

        setData({
          location: {
            name: loc.name,
            country: loc.country || "",
            localtime: forecastRes.current.time,
            tz_id: forecastRes.timezone,
            latitude: loc.latitude,
            longitude: loc.longitude,
          },
          current: {
            temp_c: forecastRes.current.temperature_2m,
            temp_f: cToF(forecastRes.current.temperature_2m),
            condition: { text: weatherCodeToText(forecastRes.current.weather_code), icon: "" },
            humidity: forecastRes.current.relative_humidity_2m,
            wind_kph: forecastRes.current.wind_speed_10m,
            cloud: forecastRes.current.cloud_cover,
            is_day: forecastRes.current.is_day,
          },
          forecast,
          hourly,
        });
      } catch (err) {
        console.error("Init weather error:", err);
        setError("Could not detect your location. Please search for a city.");
      } finally {
        setIsLoading(false);
      }
    };

    initWeather();
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchWeather,
    fetchWeatherByCoords,
    savedLocations,
    addSavedLocation,
    removeSavedLocation,
  };
};

export type { WeatherData, DayForecast };
