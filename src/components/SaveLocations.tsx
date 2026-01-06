import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Plus, Bookmark } from "lucide-react";

interface SavedLocationsProps {
  locations: string[];
  currentCity: string;
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
  onSaveCurrent: () => void;
}

const SavedLocations = ({ 
  locations, 
  currentCity, 
  onSelect, 
  onRemove,
  onSaveCurrent 
}: SavedLocationsProps) => {
  const isCurrentSaved = locations.includes(currentCity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card card-glow rounded-3xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Bookmark size={20} className="text-yellow-400" />
          Saved Locations
        </h3>
        {!isCurrentSaved && currentCity && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSaveCurrent}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-primary/30 hover:bg-primary/50 text-white transition-colors"
          >
            <Plus size={14} />
            Save Current
          </motion.button>
        )}
      </div>

      {locations.length === 0 ? (
        <p className="text-white/50 text-sm text-center py-4">
          No saved locations yet. Search for a city and save it!
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {locations.map((city) => (
              <motion.div
                key={city}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="group relative"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelect(city)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                    city === currentCity
                      ? "bg-primary/50 border border-primary"
                      : "bg-white/10 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  <MapPin size={14} className="text-primary" />
                  <span className="text-white text-sm">{city}</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(city);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} className="text-white" />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default SavedLocations;