import React from "react";
import { motion } from "framer-motion";
import { Zap, Navigation } from "lucide-react";
import { ZoneData } from "../types";

interface SmartAssistantProps {
  selectedZone: string | null;
  zones: ZoneData[];
  isAIEnabled: boolean;
}

export const SmartAssistant = ({ selectedZone, zones, isAIEnabled }: SmartAssistantProps) => {
  const currentZoneData = zones.find(z => z.zone === selectedZone);
  
  const getGuidance = () => {
    if (!selectedZone || !currentZoneData) return {
      status: "AWAITING SECTOR INPUT",
      message: "Please select your current location in the stadium grid for personalized AI guidance.",
      exit: "N/A",
      alert: false
    };

    if (!isAIEnabled) return {
      status: "MANUAL PROTOCOL",
      message: "AI Optimization is offline. Please follow standard stadium floor marking and overhead signage.",
      exit: "STADIUM DEFAULT",
      alert: true
    };

    const occupancy = (currentZoneData.number_of_people / currentZoneData.capacity) * 100;
    
    if (currentZoneData.risk_level === "HIGH" || occupancy > 150) {
      return {
        status: "URGENT EVACUATION",
        message: `Zone ${selectedZone} is critically overcrowded. Please proceed immediately to Exit ${selectedZone === 'A' || selectedZone === 'C' ? 'B' : 'A'} via the reinforced service corridor.`,
        exit: selectedZone === 'A' || selectedZone === 'C' ? 'B' : 'A',
        alert: true
      };
    }

    if (currentZoneData.risk_level === "MEDIUM" || occupancy > 100) {
      return {
        status: "CAUTION: HIGH FLOW",
        message: `Zone ${selectedZone} is reaching peak capacity. We recommend moving towards Exit ${selectedZone === 'A' || selectedZone === 'B' ? 'C' : 'D'} now to avoid future bottlenecks.`,
        exit: selectedZone === 'A' || selectedZone === 'B' ? 'C' : 'D',
        alert: false
      };
    }

    return {
      status: "OPTIMAL STATUS",
      message: `You are in Zone ${selectedZone}. Current density is low. All primary exits are green. SafeExit recommends using Exit ${selectedZone} for the fastest departure.`,
      exit: selectedZone,
      alert: false
    };
  };

  const guidance = getGuidance();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden p-8 rounded-[2.5rem] glass border ${guidance.alert ? 'border-rose-500/30' : 'border-indigo-400/30'} backdrop-blur-3xl shadow-2xl transition-all duration-500`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-20 ${guidance.alert ? 'bg-rose-500' : 'bg-indigo-500'}`} />
      
      <div className="flex items-start gap-6 relative z-10">
        <div className={`p-4 rounded-2xl ${guidance.alert ? 'bg-rose-600' : 'bg-indigo-600'} shadow-xl ${guidance.alert ? 'shadow-rose-900/40' : 'shadow-indigo-900/40'}`}>
           <Zap className="text-white" size={24} />
        </div>
        <div className="flex-1 space-y-4">
           <div>
              <div className={`text-[10px] font-black uppercase tracking-[.4em] mb-1 ${guidance.alert ? 'text-rose-400' : 'text-indigo-400'}`}>
                Smart Assistant // {guidance.status}
              </div>
              <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic">
                {selectedZone ? `Zone ${selectedZone} Analysis` : "Select Your Zone"}
              </h4>
           </div>
           
           <p className="text-white/60 text-sm font-medium leading-relaxed italic pr-4">
             "{guidance.message}"
           </p>

           {selectedZone && (
             <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Recommended Exit</div>
                   <div className="text-xl font-black text-white italic">EXIT {guidance.exit}</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                   <div className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-1">Safety Status</div>
                   <div className={`text-xl font-black italic ${guidance.alert ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {guidance.alert ? 'CRITICAL' : 'STABLE'}
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {!selectedZone && (
        <div className="mt-8 flex gap-3 flex-wrap">
           {['A', 'B', 'C', 'D'].map(z => (
             <button
               key={z}
               onClick={() => {(window as any).selectZone(z)}}
               className="px-6 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black text-white/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-400 transition-all uppercase tracking-widest"
             >
               Zone {z}
             </button>
           ))}
        </div>
      )}
    </motion.div>
  );
};
