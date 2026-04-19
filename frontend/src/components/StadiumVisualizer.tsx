import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { ZoneData } from "../types";

const EVACUATION_ROUTES: Record<string, string> = {
  "A": "M 100,100 L 60,60 L 40,40",
  "B": "M 500,100 L 540,60 L 560,40",
  "C": "M 100,300 L 60,340 L 40,360",
  "D": "M 500,300 L 540,340 L 560,360",
};

const EXIT_LABEL_POS: Record<string, { x: number, y: number }> = {
  "A": { x: 50, y: 50 },
  "B": { x: 550, y: 50 },
  "C": { x: 50, y: 350 },
  "D": { x: 550, y: 350 },
};

const getRiskStyles = (risk: string) => {
  switch (risk) {
    case "HIGH": return {
      border: "border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
      text: "text-rose-400",
      neon: "text-rose-300 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]"
    };
    case "MEDIUM": return {
      border: "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      text: "text-amber-400",
      neon: "text-amber-300 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]"
    };
    default: return {
      border: "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      text: "text-emerald-400",
      neon: "text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"
    };
  }
};

interface StadiumVisualizerProps {
  zones: ZoneData[];
  selectedZone: string | null;
  onSelectZone: (zone: string) => void;
  isAIEnabled: boolean;
}

export const StadiumVisualizer = ({ zones, selectedZone, onSelectZone, isAIEnabled }: StadiumVisualizerProps) => {
  return (
    <div className="relative aspect-video w-full max-w-2xl mx-auto glass rounded-[3rem] overflow-hidden p-8 border-white/5 shadow-2xl group/map">
      <div className="absolute inset-0 scan-line opacity-20" />
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #818cf8 1px, transparent 0)', backgroundSize: '32px 32px' }} />
      
      <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full pointer-events-none fill-none stroke-none">
        <AnimatePresence>
          {selectedZone && isAIEnabled && (
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              d={EVACUATION_ROUTES[selectedZone]}
              className="stroke-indigo-400 stroke-[5px] stroke-linecap-round stroke-linejoin-round"
              style={{ strokeDasharray: "12 16", filter: 'drop-shadow(0 0 10px rgba(129, 140, 248, 0.8))' }}
            >
              <animate attributeName="stroke-dashoffset" from="28" to="0" dur="0.8s" repeatCount="indefinite" />
            </motion.path>
          )}
        </AnimatePresence>

        {Object.entries(EXIT_LABEL_POS).map(([id, pos]) => (
          <g key={id}>
             <motion.circle 
                initial={{ r: 3 }}
                animate={{ r: [3, 6, 3], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                cx={pos.x} cy={pos.y} className="fill-emerald-400 shadow-emerald-500 shadow-lg" 
             />
             <text x={pos.x + 10} y={pos.y + 4} className="fill-emerald-400/60 text-[10px] font-black uppercase tracking-tighter italic">EXIT {id}</text>
          </g>
        ))}
      </svg>

      <div className="relative w-full h-full border-2 border-white/5 rounded-full flex items-center justify-center p-12 bg-black/40">
        <div className="w-1/2 h-1/2 border border-white/10 rounded-2xl bg-indigo-500/5 flex items-center justify-center relative backdrop-blur-sm overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover/map:translate-x-full transition-transform duration-1000" />
           <div className="w-px h-full bg-white/10 absolute left-1/2" />
           <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
              <Globe className="text-white/5" size={24} />
           </div>
        </div>

        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-6 p-10">
          {zones.map((zone) => {
            const styles = getRiskStyles(zone.risk_level);
            const isSelected = selectedZone === zone.zone;
            return (
              <motion.div
                key={zone.zone}
                onClick={() => onSelectZone(zone.zone)}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ 
                  scale: isSelected ? 1.05 : 1, 
                  opacity: 1,
                  backgroundColor: isSelected ? 'rgba(129, 140, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)'
                }}
                whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                className={`relative cursor-pointer flex items-center justify-center rounded-3xl border ${isSelected ? 'border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.4)]' : styles.border} transition-all duration-500 group/quad`}
              >
                <div className={`absolute top-4 left-4 text-[10px] font-black tracking-widest ${styles.neon}`}>
                  Z-{zone.zone}
                </div>
                <div className="flex flex-col items-center">
                   <motion.div 
                     animate={{ scale: isSelected ? 1.1 : 1 }}
                     className={`text-3xl font-black ${isSelected ? 'text-white drop-shadow(0 0 10px rgba(255,255,255,0.5))' : styles.text}`}
                   >
                    {Math.round((zone.number_of_people / zone.capacity) * 100)}%
                   </motion.div>
                </div>

                {(isSelected || zone.risk_level === "HIGH") && (
                   <motion.div 
                     animate={{ opacity: [0.2, 0.4, 0.2] }}
                     transition={{ repeat: Infinity, duration: 1.5 }}
                     className={`absolute inset-0 ${isSelected ? 'bg-indigo-400/20' : 'bg-rose-500/20'} rounded-3xl`}
                   />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
