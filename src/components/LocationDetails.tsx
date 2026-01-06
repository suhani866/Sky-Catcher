import { motion } from "framer-motion";
import { MapPin, Globe, Navigation, Compass } from "lucide-react";

interface LocationDetailsProps {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const LocationDetails = ({ name, country, latitude, longitude, timezone }: LocationDetailsProps) => {
  const formatCoordinate = (value: number, isLat: boolean) => {
    const direction = isLat 
      ? (value >= 0 ? "N" : "S") 
      : (value >= 0 ? "E" : "W");
    return `${Math.abs(value).toFixed(4)}° ${direction}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="glass-card card-glow rounded-3xl p-5"
    >
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Navigation size={20} className="text-primary" /> GPS Location Details
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-2xl px-4 py-3 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <MapPin size={14} />
            <span>City</span>
          </div>
          <span className="text-white font-medium">{name}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-2xl px-4 py-3 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Globe size={14} />
            <span>Country</span>
          </div>
          <span className="text-white font-medium">{country}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-2xl px-4 py-3 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Compass size={14} />
            <span>Latitude</span>
          </div>
          <span className="text-white font-medium text-sm">{formatCoordinate(latitude, true)}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-2xl px-4 py-3 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Compass size={14} />
            <span>Longitude</span>
          </div>
          <span className="text-white font-medium text-sm">{formatCoordinate(longitude, false)}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="col-span-2 glass-button rounded-2xl px-4 py-3 flex flex-col gap-1"
        >
          <div className="flex items-center gap-2 text-white/60 text-xs">
            <Globe size={14} />
            <span>Timezone</span>
          </div>
          <span className="text-white font-medium">{timezone}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LocationDetails;