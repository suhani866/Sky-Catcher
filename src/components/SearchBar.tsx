import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city name..."
          disabled={isLoading}
          className="flex-1 px-5 py-3 rounded-full bg-black/30 text-white placeholder-white/60 border border-white/20 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 backdrop-blur-sm"
        />
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 rounded-full bg-black/30 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
        >
          <Search size={20} />
        </motion.button>
      </div>
    </form>
  );
};

export default SearchBar;
