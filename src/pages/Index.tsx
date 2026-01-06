import { useState } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import WeatherCard from "../components/WeatherCard";
import TimeCard from "../components/TimeCard";
import ForecastCard from "../components/ForecastCard";
import HourlyForecast from "../components/HourlyForecast";
import LocationDetails from "../components/LocationDetails";
import SavedLocations from "../components/SaveLocations";
import SearchBar from "../components/SearchBar";
import GPSButton from "../components/GPSButton";
import SettingsModal from "../components/SettingModal";
import LoadingSpinner from "../components/LoadingSpinner";
import DynamicBackground from "../components/DynamicBackground";

const Index = () => {
  const { 
    data, 
    isLoading, 
    error, 
    fetchWeather,
    fetchWeatherByCoords,
    savedLocations, 
    addSavedLocation, 
    removeSavedLocation 
  } = useWeather();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [useFahrenheit, setUseFahrenheit] = useState(false);
  const [theme, setTheme] = useState("purple");

  const handleSaveCurrentLocation = () => {
    if (data?.location.name) {
      addSavedLocation(data.location.name);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Dynamic Weather Background */}
      <DynamicBackground 
        condition={data?.current.condition.text || "Clear"} 
        isDay={data?.current.is_day === 1}
        theme={theme}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-header fixed top-0 left-0 right-0 z-40 px-4 py-4"
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-white text-glow">
            ⛅ Weather App
          </h1>
          <motion.button
            whileHover={{ rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSettingsOpen(true)}
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <Settings size={24} />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 px-4 pt-24 pb-8 max-w-lg mx-auto space-y-5">
        {/* Search Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card card-glow rounded-3xl p-5"
        >
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <SearchBar onSearch={fetchWeather} isLoading={isLoading} />
            </div>
            <GPSButton onLocationFound={fetchWeatherByCoords} />
          </div>
        </motion.div>

        {/* Weather Data */}
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card rounded-3xl p-6 text-center"
          >
            <p className="text-red-400">{error}</p>
          </motion.div>
        ) : data ? (
          <>
            <WeatherCard data={data} useFahrenheit={useFahrenheit} />
            
            <TimeCard 
              timezone={data.location.tz_id} 
              localtime={data.location.localtime}
              cityname={data.location.name}
            />

            {data.forecast && data.forecast.length > 0 && (
              <ForecastCard forecast={data.forecast} useFahrenheit={useFahrenheit} />
            )}

            {data.hourly && data.hourly.length > 0 && (
              <HourlyForecast 
                hourly={data.hourly} 
                useFahrenheit={useFahrenheit} 
                timezone={data.location.tz_id}
              />
            )}

            <LocationDetails
              name={data.location.name}
              country={data.location.country}
              latitude={data.location.latitude}
              longitude={data.location.longitude}
              timezone={data.location.tz_id}
            />

            <SavedLocations
              locations={savedLocations}
              currentCity={data.location.name}
              onSelect={fetchWeather}
              onRemove={removeSavedLocation}
              onSaveCurrent={handleSaveCurrentLocation}
            />
          </>
        ) : null}
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        useFahrenheit={useFahrenheit}
        onToggleUnit={() => setUseFahrenheit(!useFahrenheit)}
        theme={theme}
        onThemeChange={setTheme}
      />
    </div>
  );
};

export default Index;
