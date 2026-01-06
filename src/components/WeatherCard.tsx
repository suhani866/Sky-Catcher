import { motion } from "framer-motion";
import { Droplets, Wind, Cloud, MapPin } from "lucide-react";
import WeatherIcon from "./WeatherIcon";
import { WeatherData } from "../hooks/useWeather";

interface WeatherCardProps {
    data: WeatherData;
    useFahrenheit: boolean;
}

const WeatherCard = ({ data, useFahrenheit }: WeatherCardProps) => {
  const temp = useFahrenheit ? data.current.temp_f : data.current.temp_c;
  const unit = useFahrenheit ? "°F" : "°C";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card card-glow rounded-3xl p-6 md:p-8"
    >
      {/* Location */}
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={18} className="text-primary" />
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          Weather in <span className="text-glow">{data.location.name}</span>
        </h2>
      </div>

      {/* Main Temperature Display */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.p
            key={temp}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-7xl font-bold text-white text-glow"
          >
            {Math.round(temp)}{unit}
          </motion.p>
          <p className="text-lg text-white/80 mt-2 capitalize flex items-center gap-2">
            {data.current.condition.text}
            <span className="text-sm px-2 py-0.5 rounded-full bg-white/10">
              {data.current.is_day ? "☀️ Day" : "🌙 Night"}
            </span>
          </p>
        </div>
        <WeatherIcon condition={data.current.condition.text} size={100} />
      </div>

      {/* Weather Stats */}
      <div className="grid grid-cols-1 gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-full px-5 py-3 flex items-center gap-3"
        >
          <span className="text-xl">🌍</span>
          <span className="text-white/90">Country:</span>
          <span className="text-white font-medium ml-auto">{data.location.country}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-full px-5 py-3 flex items-center gap-3"
        >
          <Droplets size={20} className="text-blue-400" />
          <span className="text-white/90">Humidity:</span>
          <span className="text-white font-medium ml-auto">{data.current.humidity}%</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-full px-5 py-3 flex items-center gap-3"
        >
          <Cloud size={20} className="text-gray-300" />
          <span className="text-white/90">Cloud Cover:</span>
          <span className="text-white font-medium ml-auto">{data.current.cloud}%</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-full px-5 py-3 flex items-center gap-3"
        >
          <Wind size={20} className="text-cyan-400" />
          <span className="text-white/90">Wind Speed:</span>
          <span className="text-white font-medium ml-auto">{data.current.wind_kph} km/h</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;