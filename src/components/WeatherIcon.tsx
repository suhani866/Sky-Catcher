import { motion } from "framer-motion";
import { Cloud, CloudDrizzle, CloudLightning, CloudRain, CloudSnow, Sun, CloudSun, Wind, Cloudy } from "lucide-react";

interface WeatherIconProps {
  condition: string;
  size?: number;
}

const WeatherIcon = ({ condition, size = 80 }: WeatherIconProps) => {
  const lowerCondition = condition.toLowerCase();

  const getIcon = () => {
    if (lowerCondition.includes("thunder") || lowerCondition.includes("lightning")) {
      return <CloudLightning size={size} className="text-yellow-300" />;
    }
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain size={size} className="text-blue-300" />;
    }
    if (lowerCondition.includes("snow") || lowerCondition.includes("sleet")) {
      return <CloudSnow size={size} className="text-white" />;
    }
    if (lowerCondition.includes("clear") || lowerCondition.includes("sunny")) {
      return <Sun size={size} className="text-yellow-400" />;
    }
    if (lowerCondition.includes("partly") || lowerCondition.includes("cloud") && lowerCondition.includes("sun")) {
      return <CloudSun size={size} className="text-orange-300" />;
    }
    if (lowerCondition.includes("overcast")) {
      return <Cloudy size={size} className="text-gray-300" />;
    }
    if (lowerCondition.includes("cloud")) {
      return <Cloud size={size} className="text-gray-300" />;
    }
    if (lowerCondition.includes("mist") || lowerCondition.includes("fog")) {
      return <Wind size={size} className="text-gray-400" />;
    }
    return <Sun size={size} className="text-yellow-400" />;
  };

  return (
    <motion.div
      animate={{ 
        y: [0, -8, 0],
        rotate: lowerCondition.includes("sunny") || lowerCondition.includes("clear") ? [0, 360] : 0 
      }}
      transition={{ 
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 20, repeat: Infinity, ease: "linear" }
      }}
      className="drop-shadow-2xl"
      style={{ filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}
    >
      {getIcon()}
    </motion.div>
  );
};

export default WeatherIcon;