import { useState } from "react";
import { motion } from "framer-motion";
import { Navigation, Loader2 } from "lucide-react";

interface GPSButtonProps {
  onLocationFound: (lat: number, lon: number) => void;
}

const GPSButton = ({ onLocationFound }: GPSButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoading(false);
        onLocationFound(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setIsLoading(false);
        setError(err.code === 1 ? "Permission denied" : "Location unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGetLocation}
        disabled={isLoading}
        className="glass-button rounded-full p-3 text-white hover:bg-white/20 transition-colors disabled:opacity-50"
        title="Use GPS Location"
      >
        {isLoading ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Navigation size={20} />
        )}
      </motion.button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  );
};

export default GPSButton;