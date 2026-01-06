import { motion } from "framer-motion";

interface DynamicBackgroundProps {
  condition: string;
  isDay: boolean;
  theme: string;
}

const DynamicBackground = ({ condition, isDay, theme }: DynamicBackgroundProps) => {
  const lowerCondition = condition.toLowerCase();

  // Determine background based on weather condition
  const getWeatherGradient = () => {
    // Rain conditions
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return isDay 
        ? "from-slate-600 via-blue-800 to-slate-900"
        : "from-slate-900 via-blue-950 to-slate-950";
    }
    
    // Thunderstorm
    if (lowerCondition.includes("thunder") || lowerCondition.includes("storm")) {
      return "from-slate-900 via-purple-950 to-slate-950";
    }
    
    // Snow
    if (lowerCondition.includes("snow") || lowerCondition.includes("sleet") || lowerCondition.includes("ice")) {
      return isDay
        ? "from-blue-200 via-slate-300 to-blue-400"
        : "from-slate-700 via-blue-900 to-slate-900";
    }
    
    // Cloudy/Overcast
    if (lowerCondition.includes("overcast") || lowerCondition.includes("cloudy")) {
      return isDay
        ? "from-slate-400 via-blue-500 to-slate-600"
        : "from-slate-800 via-slate-900 to-slate-950";
    }
    
    // Partly cloudy
    if (lowerCondition.includes("partly")) {
      return isDay
        ? "from-blue-400 via-sky-500 to-blue-600"
        : "from-indigo-900 via-slate-800 to-indigo-950";
    }
    
    // Mist/Fog
    if (lowerCondition.includes("mist") || lowerCondition.includes("fog") || lowerCondition.includes("haze")) {
      return isDay
        ? "from-gray-400 via-slate-500 to-gray-600"
        : "from-gray-800 via-slate-900 to-gray-950";
    }
    
    // Clear/Sunny - default theme colors
    if (isDay) {
      switch (theme) {
        case "blue": return "from-sky-400 via-blue-500 to-indigo-600";
        case "green": return "from-emerald-400 via-teal-500 to-cyan-600";
        case "orange": return "from-orange-400 via-amber-500 to-yellow-500";
        default: return "from-violet-500 via-purple-600 to-fuchsia-700";
      }
    } else {
      switch (theme) {
        case "blue": return "from-blue-950 via-indigo-900 to-slate-950";
        case "green": return "from-emerald-950 via-teal-900 to-slate-950";
        case "orange": return "from-orange-950 via-red-900 to-slate-950";
        default: return "from-purple-950 via-fuchsia-900 to-indigo-950";
      }
    }
  };

  // Weather particles
  const renderParticles = () => {
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-4 bg-blue-300/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
              animate={{
                y: ["0vh", "110vh"],
                opacity: [0.7, 0],
              }}
              transition={{
                duration: 0.8 + Math.random() * 0.4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>
      );
    }

    if (lowerCondition.includes("snow")) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: -20,
              }}
              animate={{
                y: ["0vh", "110vh"],
                x: [0, Math.random() * 50 - 25],
                rotate: [0, 360],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "linear",
              }}
            />
          ))}
        </div>
      );
    }

    if (lowerCondition.includes("thunder")) {
      return (
        <motion.div
          className="absolute inset-0 bg-white/10 pointer-events-none"
          animate={{
            opacity: [0, 0, 0, 1, 0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        />
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 -z-10">
      {/* Main gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getWeatherGradient()} transition-all duration-1000`} />
      
      {/* Weather particles */}
      {renderParticles()}
      
      {/* Ambient orbs */}
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"
      />
      
      {/* Sun/Moon for clear weather */}
      {(lowerCondition.includes("clear") || lowerCondition.includes("sunny")) && (
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-20 right-20 w-32 h-32 rounded-full ${
            isDay 
              ? "bg-gradient-to-br from-yellow-300 to-orange-400 shadow-[0_0_60px_30px_rgba(255,200,100,0.3)]" 
              : "bg-gradient-to-br from-slate-200 to-slate-400 shadow-[0_0_40px_20px_rgba(200,200,255,0.2)]"
          }`}
        />
      )}
    </div>
  );
};

export default DynamicBackground;