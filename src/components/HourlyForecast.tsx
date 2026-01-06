import { motion } from "framer-motion";
import { HourlyForecast as HourlyData } from "../types/weather";
import WeatherIcon from "./WeatherIcon";

interface HourlyForecastProps {
  hourly: HourlyData[];
  useFahrenheit: boolean;
  timezone: string;
}

const HourlyForecast = ({ hourly, useFahrenheit, timezone }: HourlyForecastProps) => {
  const formatHour = (timeStr: string) => {
    const date = new Date(timeStr);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: true,
      timeZone: timezone,
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card card-glow rounded-3xl p-5"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-xl">⏰</span> Hourly Forecast
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {hourly.map((hour, index) => (
          <motion.div
            key={hour.time}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
            className="glass-button rounded-2xl px-4 py-3 flex flex-col items-center min-w-[80px] gap-2"
          >
            <span className="text-white/70 text-xs font-medium">
              {index === 0 ? "Now" : formatHour(hour.time)}
            </span>
            <WeatherIcon condition={hour.condition} size={28} />
            <span className="text-white font-semibold text-sm">
              {useFahrenheit ? Math.round(hour.temp_f) : Math.round(hour.temp_c)}°
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;