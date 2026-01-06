import { motion } from "framer-motion";
import { DayForecast } from "../types/weather";
import WeatherIcon from "./WeatherIcon";

interface ForecastCardProps {
  forecast: DayForecast[];
  useFahrenheit: boolean;
}

const ForecastCard = ({ forecast, useFahrenheit }: ForecastCardProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card card-glow rounded-3xl p-5"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-xl">📅</span> 5-Day Forecast
      </h3>
      
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.02 }}
            className="glass-button rounded-2xl px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-[120px]">
              <WeatherIcon condition={day.condition.text} size={32} />
              <div>
                <p className="text-white font-medium text-sm">{formatDate(day.date)}</p>
                <p className="text-white/60 text-xs capitalize">{day.condition.text}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-blue-300">
                <span>💧</span>
                <span>{day.daily_chance_of_rain}%</span>
              </div>
              <div className="text-right">
                <span className="text-white font-semibold">
                  {useFahrenheit ? Math.round(day.maxtemp_f) : Math.round(day.maxtemp_c)}°
                </span>
                <span className="text-white/50 mx-1">/</span>
                <span className="text-white/60">
                  {useFahrenheit ? Math.round(day.mintemp_f) : Math.round(day.mintemp_c)}°
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ForecastCard;