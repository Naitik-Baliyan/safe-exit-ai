import React from "react";
import { motion } from "framer-motion";
import { Users, AlertTriangle, ShieldCheck, Activity, Navigation, Layers, ChevronRight, Cpu, Zap } from "lucide-react";
import { ZoneData } from "../types";

interface ZoneCardProps {
  data: ZoneData;
  isSelected: boolean;
  onSelect: () => void;
}

const getRiskStyles = (risk: string) => {
  switch (risk) {
    case "HIGH": return {
      bg: "from-rose-500/10 to-rose-950/40",
      border: "border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]",
      text: "text-rose-400",
      accent: "bg-rose-500",
      glow: "shadow-[0_0_40px_rgba(244,63,94,0.3)]",
      neon: "text-rose-300 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)]"
    };
    case "MEDIUM": return {
      bg: "from-amber-500/10 to-amber-950/40",
      border: "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
      text: "text-amber-400",
      accent: "bg-amber-500",
      glow: "shadow-[0_0_30px_rgba(245,158,11,0.2)]",
      neon: "text-amber-300 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]"
    };
    default: return {
      bg: "from-emerald-500/10 to-emerald-950/40",
      border: "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]",
      text: "text-emerald-400",
      accent: "bg-emerald-500",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      neon: "text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]"
    };
  }
};

export const ZoneCard = ({ data, isSelected, onSelect }: ZoneCardProps) => {
  const styles = getRiskStyles(data.risk_level);
  const occupancyRate = (data.number_of_people / data.capacity) * 100;
  
  return (
    <motion.div
      layout
      onClick={onSelect}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group cursor-pointer relative overflow-hidden rounded-[3rem] border backdrop-blur-3xl transition-all duration-700 ${
        isSelected 
          ? 'bg-indigo-500/10 border-indigo-400 shadow-[0_0_50px_rgba(129,140,248,0.2)]' 
          : `bg-slate-950/60 ${styles.border} ${styles.glow}`
      } p-10`}
    >
      <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
         <Cpu className="text-white" size={120} />
      </div>

      <div className="flex justify-between items-start mb-14 relative z-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-1 bg-gradient-to-r ${isSelected ? 'from-indigo-400 to-indigo-600' : styles.accent + ' to-black'}`} />
             <span className={`text-[10px] font-black tracking-[.4em] uppercase ${isSelected ? 'text-indigo-400' : 'text-white/40'}`}>
                {isSelected ? 'NAV-ACTIVE' : 'TELEMETRY DATA'}
             </span>
          </div>
          <h3 className="text-5xl font-black tracking-tighter text-white uppercase italic">
            Zone <span className={isSelected ? 'text-indigo-400' : styles.text}>{data.zone}</span>
          </h3>
        </div>
        <div className={`p-5 rounded-3xl glass transition-all duration-500 ${isSelected ? 'border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.5)]' : ''}`}>
          {isSelected ? <Navigation className="text-indigo-400" size={28} /> :
           data.risk_level === "HIGH" ? <AlertTriangle className="text-rose-400 animate-pulse" size={28} /> : 
           data.risk_level === "MEDIUM" ? <Activity className="text-amber-400" size={28} /> : 
           <ShieldCheck className="text-emerald-400" size={28} />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-12 mb-10 relative z-10">
        <div className="space-y-2">
           <div className="text-white/20 text-[11px] uppercase font-black tracking-widest flex items-center gap-2">
              <Users size={12} /> Occupancy
           </div>
           <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-white tabular-nums tracking-tighter">{data.number_of_people}</span>
              <span className="text-white/20 text-xl font-bold italic">/ {data.capacity}</span>
           </div>
        </div>
        <div className="text-right space-y-2">
           <div className="text-white/20 text-[11px] uppercase font-black tracking-widest">Risk Factor</div>
           <div className={`text-4xl font-black uppercase italic ${isSelected ? 'text-indigo-200' : styles.neon}`}>{data.risk_level}</div>
           
           {data.risk_level === "MEDIUM" && occupancyRate > 120 && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-[9px] text-amber-400 font-bold uppercase tracking-tighter flex items-center justify-end gap-1.5 mt-2"
             >
                <Zap size={10} className="animate-pulse" />
                <span>CRITICAL IN 30S</span>
             </motion.div>
           )}

           <div className={`inline-block px-3 py-1 rounded-full text-[8px] font-black tracking-tighter border ${isSelected ? 'border-indigo-400/30 text-indigo-400' : 'border-white/10 text-white/40'} mt-2`}>
              SENSOR: ACTIVATED
           </div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="flex justify-between items-end">
           <div className="space-y-1">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">Density Gradient</span>
           </div>
           <div className={`text-xl font-black italic shadow-indigo-500/20 ${isSelected ? 'text-indigo-400' : styles.text}`}>
              {Math.round(occupancyRate)}%
           </div>
        </div>
        <div className="relative h-4 w-full bg-black/40 rounded-full overflow-hidden p-1 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(occupancyRate, 100)}%` }}
            transition={{ type: "spring", stiffness: 35, damping: 12 }}
            className={`h-full rounded-full ${isSelected ? 'bg-gradient-to-r from-indigo-600 to-indigo-400' : `bg-gradient-to-r from-${styles.accent.replace('bg-', '')}/50 to-${styles.accent.replace('bg-', '')}`} relative shadow-2xl z-10`}
          >
             <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
          </motion.div>
        </div>
      </div>

      <div className={`mt-10 pt-8 border-t border-white/5 flex justify-between items-center transition-all duration-500 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
         <div className={`text-[10px] font-black ${isSelected ? 'text-indigo-400' : 'text-white/20'} flex items-center gap-2 uppercase tracking-[.4em]`}>
            {isSelected ? (
              <><Navigation size={14} className="animate-bounce" /> Guidance Mode Engaged</>
            ) : (
              <><Layers size={14} /> Analyze Spatial Node</>
            )}
         </div>
         <ChevronRight size={18} className={isSelected ? 'text-indigo-400' : 'text-white/20'} />
      </div>

      <div className={`absolute -bottom-32 -right-32 w-64 h-64 blur-[100px] rounded-full opacity-40 transition-all duration-1000 ${isSelected ? 'bg-indigo-600' : styles.accent}`} />
    </motion.div>
  );
};
