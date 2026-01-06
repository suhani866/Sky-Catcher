import {useEffect, useMemo, useState} from "react";
import { motion } from "framer-motion";
import { Clock, Globe, Calendar } from "lucide-react";

interface TimeCardProps {
  timezone: string;
  localtime: string;
  cityname: string;
}

const TimeCard = ({ timezone, localtime, cityname }: TimeCardProps) => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

const tzAbbr = useMemo(() => {
    if (!timezone) return "";
    try {
        const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            timeZoneName: "short",
        }).formatToParts(new Date());
        return parts.find(part => part.type === "timeZoneName")?.value ?? "";
        } catch {
            return "";
        }       
    }, [timezone]);

useEffect(() => {
    const tick = () => {
        const now = new Date();

        try {
           setCurrentTime(new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
            }).format(now)
        );

        setCurrentDate(new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }).format(now)
        );
        } catch {
         
            setCurrentTime(now.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",  
                second: "2-digit",
                hour12: true,
            })
        );
        
        setCurrentDate(now.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        );
        }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
}, [timezone]);

const lastUpdatedLabel = useMemo(() => {
    if (!localtime) return "Now";

    const [hh, mm] = localtime.split(" : ");
    const h = Number(hh);
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    if (Number.isNaN(h)) return localtime;

    const ampm = h >= 12 ? "PM" : "AM";
     return `${hour12.toString().padStart(2, "0")}:${(mm || "00").slice(0, 2)} ${ampm}`;
  }, [localtime]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card card-glow rounded-3xl p-6"
    >
      {/* Live Clock */}
      <div className="text-center mb-4">
        <motion.p
          key={currentTime}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          className="text-4xl md:text-5xl font-bold text-white text-glow font-mono"
        >
          {currentTime || "--:--:-- --"}
        </motion.p>
        <p className="text-white/70 mt-2 text-sm">{cityname} Local Time</p>
      </div>

      <div className="space-y-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-full px-5 py-3 flex items-center gap-3"
        >
          <Calendar size={20} className="text-green-400" />
          <span className="text-white/90">Date:</span>
          <span className="text-white font-medium ml-auto text-sm">{currentDate || "Loading..."}</span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-full px-5 py-3 flex items-center gap-3"
        >
          <Globe size={20} className="text-purple-400" />
          <span className="text-white/90">Time Zone:</span>
          <span className="text-white font-medium ml-auto text-sm">
            {timezone}
            {tzAbbr ? ` (${tzAbbr})` : ""}
          </span>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="glass-button rounded-full px-5 py-3 flex items-center gap-3"
        >
          <Clock size={20} className="text-pink-400" />
          <span className="text-white/90">Last Updated:</span>
          <span className="text-white font-medium ml-auto text-sm">
            {localtime ? new Date(localtime.replace(" ", "T")).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }) : "Now"}
          </span>
          <span className = "text-white font-medium ml-auto text-sm">{lastUpdatedLabel}</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimeCard;