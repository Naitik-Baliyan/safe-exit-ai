import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu } from "lucide-react";
import { ZoneData } from "../types";

interface DecisionEngineProps {
  zones: ZoneData[];
  isAIEnabled: boolean;
}

export const DecisionEngine = ({ zones, isAIEnabled }: DecisionEngineProps) => {
  const highRiskZones = zones.filter(z => z.risk_level === "HIGH");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const generateLogs = () => {
      const timestamp = new Date().toLocaleTimeString();
      if (!isAIEnabled) {
        return [`[${timestamp}] ! ERR: TACTICAL ENGINE OFFLINE. MANUAL GUIDANCE REQUIRED.`];
      }
      if (highRiskZones.length > 0) {
        return highRiskZones.map(z => 
          `[${timestamp}] CRITICAL: ZONE ${z.zone} @ ${Math.round((z.number_of_people/z.capacity)*100)}% DETECTED. OPTIMIZING FLOW.`
        );
      }
      
      const nearCritical = zones.filter(z => (z.number_of_people/z.capacity)*100 > 120 && z.risk_level !== "HIGH");
      if (nearCritical.length > 0) {
        return nearCritical.map(z => 
          `[${timestamp}] PREDICTIVE: ZONE ${z.zone} DENSITY TRENDING TOWARDS PEAK. EST. LIMIT IN 30S.`
        );
      }

      return [`[${timestamp}] SCANNING SECTORS A-D... ALL NODES GREEN.`];
    };

    const newLogs = generateLogs();
    setLogs(prev => [...newLogs, ...prev].slice(0, 5));
  }, [zones, isAIEnabled]);

  return (
    <div className="glass rounded-[2rem] border-white/5 bg-black/60 p-8 h-[300px] overflow-hidden relative flex flex-col gap-4 font-mono shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <Cpu className="text-indigo-400" size={16} />
          <span className="text-[10px] font-black text-white uppercase tracking-[.3em]">AI Decision Engine</span>
        </div>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-rose-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {logs.map((log, i) => (
            <motion.div
              key={`${log}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`text-[10px] leading-relaxed tracking-wider ${
                log.includes("CRITICAL") ? "text-rose-400" : "text-emerald-400/60"
              }`}
            >
              <span className="opacity-40">{'>'}</span> {log}
              {i === 0 && (
                <motion.span 
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-1.5 h-3 bg-white/40 ml-1 translate-y-0.5"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
      <div className="absolute inset-0 scan-line opacity-10" />
    </div>
  );
};
