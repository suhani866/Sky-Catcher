import { motion } from "framer-motion";
import { Cloud, Sun } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -z-10 -left-4 -top-4"
        >
          <Sun size={80} className="text-yellow-400 opacity-70" />
        </motion.div>
        <motion.div
          animate={{ x: [0, 10, 0], y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud size={100} className="text-white drop-shadow-2xl" />
        </motion.div>
      </div>
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-white/80 mt-6 text-lg"
      >
        Loading weather data...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;