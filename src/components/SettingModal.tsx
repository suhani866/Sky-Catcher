import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Thermometer, Palette } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  useFahrenheit: boolean;
  onToggleUnit: () => void;
  theme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: "purple", color: "bg-purple-600", gradient: "from-purple-900 via-fuchsia-800 to-indigo-900" },
  { id: "blue", color: "bg-blue-600", gradient: "from-blue-900 via-cyan-800 to-teal-900" },
  { id: "green", color: "bg-green-600", gradient: "from-emerald-900 via-green-800 to-teal-900" },
  { id: "orange", color: "bg-orange-500", gradient: "from-orange-900 via-red-800 to-rose-900" },
];

const SettingsModal = ({
  isOpen,
  onClose,
  useFahrenheit,
  onToggleUnit,
  theme,
  onThemeChange,
}: SettingsModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="glass-card rounded-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-black/30 px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Settings</h3>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* Dark/Light Mode (Visual only) */}
              <div className="glass-button rounded-full px-5 py-3 flex items-center gap-3">
                <Moon size={20} className="text-purple-400" />
                <span className="text-white/90">Mode:</span>
                <div className="ml-auto flex items-center gap-2">
                  <Moon size={18} className="text-white" />
                  <Sun size={18} className="text-white/50" />
                </div>
              </div>

              {/* Temperature Unit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onToggleUnit}
                className="w-full glass-button rounded-full px-5 py-3 flex items-center gap-3"
              >
                <Thermometer size={20} className="text-red-400" />
                <span className="text-white/90">Temperature:</span>
                <div className="ml-auto flex items-center gap-2 text-white">
                  <span className={!useFahrenheit ? "font-bold text-primary" : "opacity-50"}>°C</span>
                  <span>/</span>
                  <span className={useFahrenheit ? "font-bold text-primary" : "opacity-50"}>°F</span>
                </div>
              </motion.button>

              {/* Theme Selection */}
              <div className="glass-button rounded-2xl px-5 py-4">
                <div className="flex items-center gap-3 mb-4">
                  <Palette size={20} className="text-pink-400" />
                  <span className="text-white/90">Change Theme</span>
                </div>
                <div className="flex justify-center gap-4">
                  {themes.map((t) => (
                    <motion.button
                      key={t.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onThemeChange(t.id)}
                      className={`w-10 h-10 rounded-full ${t.color} border-4 transition-all duration-300 ${
                        theme === t.id
                          ? "border-white shadow-lg shadow-white/30"
                          : "border-white/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full py-3 rounded-full bg-red-500/80 hover:bg-red-500 text-white font-medium transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;