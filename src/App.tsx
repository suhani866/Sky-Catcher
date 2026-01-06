import React, { useState } from "react";
import TimeCard from "./components/TimeCard";
import ForecastCard from "./components/ForecastCard";
import HourlyForecast from "./components/HourlyForecast";

function App() {
  const [useFahrenheit, setUseFahrenheit] = useState(true);

  // Dummy data for testing
  const timezone = "America/New_York";
  const localtime = new Date().toISOString(); // current time
  const cityName = "New York";

  const forecast = [
    {
      date: new Date().toISOString(),
      condition: { text: "Sunny" },
      daily_chance_of_rain: 10,
      maxtemp_c: 25,
      mintemp_c: 15,
      maxtemp_f: 77,
      mintemp_f: 59,
    },
    {
      date: new Date(Date.now() + 86400000).toISOString(),
      condition: { text: "Cloudy" },
      daily_chance_of_rain: 20,
      maxtemp_c: 22,
      mintemp_c: 14,
      maxtemp_f: 72,
      mintemp_f: 57,
    },
    {
      date: new Date(Date.now() + 2 * 86400000).toISOString(),
      condition: { text: "Rainy" },
      daily_chance_of_rain: 80,
      maxtemp_c: 20,
      mintemp_c: 12,
      maxtemp_f: 68,
      mintemp_f: 54,
    },
    {
      date: new Date(Date.now() + 3 * 86400000).toISOString(),
      condition: { text: "Sunny" },
      daily_chance_of_rain: 5,
      maxtemp_c: 26,
      mintemp_c: 16,
      maxtemp_f: 79,
      mintemp_f: 61,
    },
    {
      date: new Date(Date.now() + 4 * 86400000).toISOString(),
      condition: { text: "Partly Cloudy" },
      daily_chance_of_rain: 15,
      maxtemp_c: 24,
      mintemp_c: 14,
      maxtemp_f: 75,
      mintemp_f: 57,
    },
  ];

  const hourly = Array.from({ length: 12 }, (_, i) => ({
    time: new Date(Date.now() + i * 3600000).toISOString(),
    condition: "Sunny",
    temp_c: 20 + i,
    temp_f: 68 + i,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-6 space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setUseFahrenheit(!useFahrenheit)}
          className="bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/40 transition"
        >
          Switch to {useFahrenheit ? "Celsius" : "Fahrenheit"}
        </button>
      </div>

      <TimeCard timezone={timezone} localtime={localtime} cityname={cityName} />

      <ForecastCard forecast={forecast} useFahrenheit={useFahrenheit} />

      <HourlyForecast hourly={hourly} useFahrenheit={useFahrenheit} timezone={timezone} />
    </div>
  );
}

export default App;
