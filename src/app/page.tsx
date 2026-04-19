"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Navigation,
  Zap
} from "lucide-react";

import { ZoneData } from "../types";
import { StadiumVisualizer } from "../components/StadiumVisualizer";
import { DecisionEngine } from "../components/DecisionEngine";
import { SmartAssistant } from "../components/SmartAssistant";
import { ZoneCard } from "../components/ZoneCard";

const FALLBACK_DATA: ZoneData[] = [
  { zone: "A", number_of_people: 42, capacity: 100, risk_level: "LOW", sim_call_index: 0 },
  { zone: "B", number_of_people: 125, capacity: 100, risk_level: "MEDIUM", sim_call_index: 0 },
  { zone: "C", number_of_people: 180, capacity: 100, risk_level: "HIGH", sim_call_index: 0 },
  { zone: "D", number_of_people: 35, capacity: 100, risk_level: "LOW", sim_call_index: 0 },
];

export default function StadiumDashboard() {
  const [zones, setZones] = useState<ZoneData[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const [isDemoMode] = useState(false);
  const [isAIEnabled] = useState(true);
  const [scenarioProgress] = useState(0);

  const totalPeople = useMemo(() => {
    let data: ZoneData[] = isDemoMode 
      ? zones.map(z => z.zone === "B" ? { ...z, number_of_people: Math.round(z.number_of_people + scenarioProgress), risk_level: ((z.number_of_people + scenarioProgress) > 150 ? "HIGH" : "MEDIUM") as "LOW" | "MEDIUM" | "HIGH" } : z) 
      : zones;
    
    if (!isAIEnabled) {
      data = data.map(z => ({ ...z, number_of_people: Math.round(z.number_of_people * 1.15) }));
    }
    return data.reduce((acc, curr) => acc + (curr.number_of_people || 0), 0);
  }, [zones, isDemoMode, isAIEnabled, scenarioProgress]);

  const displayedZones = useMemo(() => {
    let data: ZoneData[] = isDemoMode 
      ? zones.map(z => {
          if (z.zone === "B") {
            const p = Math.round(z.number_of_people + scenarioProgress);
            return { 
              ...z, 
              number_of_people: p, 
              risk_level: (p > 150 ? "HIGH" : p > 100 ? "MEDIUM" : "LOW") as "LOW" | "MEDIUM" | "HIGH"
            };
          }
          return z as ZoneData;
        }) 
      : zones;
    
    if (!isAIEnabled) {
      data = data.map(z => {
        const p = Math.round(z.number_of_people * 1.15);
        return { 
          ...z, 
          number_of_people: p,
          risk_level: (p > 150 ? "HIGH" : p > 100 ? "MEDIUM" : "LOW") as "LOW" | "MEDIUM" | "HIGH"
        };
      });
    }

    return data;
  }, [zones, isDemoMode, isAIEnabled, scenarioProgress]);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/crowd-data");
      if (!res.ok) throw new Error("Backend unreachable");
      const data = await res.json();
      setZones(data);
      setIsUsingFallback(false);
      setLoading(false);
    } catch (err) {
      if (loading) {
        setZones(FALLBACK_DATA);
        setLoading(false);
      }
      setIsUsingFallback(true);
    }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchData();
    const interval = setInterval(fetchData, 2000); 
    
    // @ts-ignore
    window.selectZone = (zone: string) => setSelectedZone(zone);
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-[#020617]" />;

  return (
    <div className="relative min-h-screen Selection:bg-indigo-500/30">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-500/5 blur-[150px] rounded-full animate-pulse capitalize" style={{ animationDelay: '3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_100%)]" />
      </div>

      <nav className="sticky top-0 z-[100] px-12 py-10 backdrop-blur-3xl border-b border-white/5 bg-black/40">
         <div className="max-w-[1600px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
               <motion.div 
                 whileHover={{ rotate: 180, scale: 1.1 }}
                 className="w-14 h-14 glass rounded-3xl flex items-center justify-center border-indigo-500/30 shadow-[0_0_20px_rgba(129,140,248,0.2)]"
               >
                  <ShieldCheck className="text-indigo-400" size={32} />
               </motion.div>
               <div>
                  <h1 className="text-3xl font-black leading-none tracking-tighter text-white uppercase italic">
                    SafeExit <span className="text-indigo-400">Gen-AI</span>
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-indigo-400/60 tracking-[.5em] uppercase">Security Engine</span>
                    <div className="w-10 h-px bg-indigo-500/20" />
                  </div>
               </div>
            </div>

            <div className="hidden lg:flex items-center gap-12 glass px-10 py-4 rounded-[2rem] border-white/10 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[.3em] mb-1">Global Health</span>
                  <div className="flex items-center gap-2">
                     <motion.div 
                        animate={{ opacity: [1, 0.5, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-2 h-2 rounded-full ${isUsingFallback ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]'}`} 
                     />
                     <span className="text-xs font-black text-white leading-none uppercase tracking-widest">
                        {isUsingFallback ? 'Simulation' : 'Synchronized'}
                     </span>
                  </div>
               </div>
               <div className="w-px h-10 bg-white/5" />
               <div className="flex flex-col min-w-[140px]">
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-[.3em] mb-1">Live Occupancy</span>
                  <span className="text-2xl font-black text-white leading-none tracking-tighter">
                    {totalPeople} <span className="text-xs text-white/20 font-bold uppercase italic tracking-normal mx-1">Capacity</span>
                  </span>
               </div>
               <div className="flex items-end gap-1.5 h-10">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-1.5 h-full bg-white/5 rounded-full overflow-hidden flex items-end">
                       <motion.div 
                         animate={{ height: `${Math.random() * 80 + 20}%` }}
                         transition={{ repeat: Infinity, duration: 1.5, repeatType: 'reverse', delay: i * 0.1 }}
                         className="bg-indigo-500 w-full rounded-full" 
                       />
                    </div>
                  ))}
               </div>
            </div>

            <div className="flex items-center gap-6">
               <div className="text-right hidden sm:block space-y-1">
                  <div className="text-sm font-black text-white uppercase italic tracking-tighter tracking-widest">{isUsingFallback ? 'MOCK VIEW' : 'CLOUD CTR'}</div>
                  <div className="text-[9px] font-bold text-indigo-400/40 uppercase tracking-[.4em]">
                    {isUsingFallback ? 'UPLINK OFFLINE' : 'CLOUD UPLINK'}
                  </div>
               </div>
               <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 p-0.5 shadow-xl shadow-indigo-500/20">
                  <div className="w-full h-full rounded-[1.25rem] bg-slate-950 flex items-center justify-center text-xs font-black text-white">AI.X</div>
               </div>
            </div>
         </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-12 py-24 space-y-32">
        
        {/* Connection Notice */}
        <AnimatePresence>
          {isUsingFallback && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-[2rem] p-6 flex items-center gap-6 mb-12 overflow-hidden glass shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 flex items-center justify-center shadow-lg shadow-amber-900/20">
                 <AlertTriangle className="text-amber-500" size={24} />
              </div>
              <div className="flex-1">
                 <div className="text-sm font-black text-white uppercase tracking-[.3em] mb-1">AI Engine: Simulation Mode</div>
                 <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                    Cloud Uplink failed. Running recursive synthetic data loop.
                 </p>
              </div>
              <button 
                onClick={fetchData}
                className="px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-black text-white hover:bg-white/10 transition-colors uppercase tracking-widest"
              >
                 Reconnect
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Hero Section with Visualizer */}
        <section className="grid lg:grid-cols-2 gap-32 items-center">
           <div className="space-y-12">
              <div className="flex flex-col gap-4">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center self-start gap-3 px-6 py-2 rounded-full glass border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[.4em] uppercase"
                >
                  <Activity size={12} className="animate-pulse" /> Telemetry: Optimized
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {displayedZones.filter(z => z.risk_level === "HIGH").map((zone) => (
                    <motion.div
                      key={`alert-hero-high-${zone.zone}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="glass border-rose-500/50 bg-rose-500/20 px-6 py-3 rounded-2xl flex items-center gap-4 backdrop-blur-3xl neon-border-rose">
                        <AlertTriangle className="text-rose-400 fill-rose-400/20" size={18} />
                        <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">CRITICAL: Zone {zone.zone} Overcrowded</span>
                      </div>
                    </motion.div>
                  ))}

                  {displayedZones.filter(z => z.risk_level === "MEDIUM" && (z.number_of_people/z.capacity)*100 > 120).map((zone) => (
                    <motion.div
                      key={`alert-hero-pred-${zone.zone}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="glass border-amber-500/30 bg-amber-500/10 px-6 py-3 rounded-2xl flex items-center gap-4 backdrop-blur-3xl">
                        <Zap className="text-amber-400" size={18} />
                        <span className="text-[11px] font-black text-white uppercase italic tracking-tighter">PREDICTIVE: Zone {zone.zone} Critical Surge</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="space-y-4">
                <h2 className="text-6xl font-black text-white leading-[1] tracking-tighter uppercase italic pt-12">
                   Stadium <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-600">Density</span> <br />
                   Uplink.
                </h2>
                <div className="w-24 h-2 bg-indigo-600 rounded-full" />
              </div>
              <div className="space-y-8 max-w-xl">
                <p className="text-zinc-500 text-xl font-medium leading-relaxed tracking-tight">
                  Next-generation spatial computing interface for stadium-wide 
                  occupancy monitoring and AI-guided extraction protocols.
                </p>
                {selectedZone && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-400/40 flex items-start gap-6 backdrop-blur-3xl shadow-[0_0_40px_rgba(129,140,248,0.1)] neon-border-indigo"
                  >
                    <div className="p-4 rounded-2xl bg-indigo-500 shadow-xl shadow-indigo-900/40">
                       <Navigation className="text-white" size={28} />
                    </div>
                    <div>
                       <div className="text-[12px] font-black text-indigo-300 uppercase tracking-[.4em] mb-2">Protocol: Active Routing</div>
                       <div className="text-2xl font-black text-white tracking-tighter uppercase italic">SafeExit GUIDANCE: Zone {selectedZone}</div>
                       <p className="text-[11px] text-white/40 font-bold uppercase mt-2 tracking-widest leading-relaxed">
                          Primary corridor identified. Estimated time to extraction: 180s. 
                          Automated gate deployment synchronized.
                       </p>
                    </div>
                  </motion.div>
                )}
              </div>

              <SmartAssistant 
                selectedZone={selectedZone} 
                zones={displayedZones} 
                isAIEnabled={isAIEnabled} 
              />

              <div className="flex gap-4">
                 <button className="px-10 py-5 rounded-2xl bg-indigo-600 text-white font-black text-[11px] uppercase tracking-[.3em] shadow-xl shadow-indigo-900/40 hover:bg-indigo-500 hover:scale-105 transition-all">
                    Data Report
                 </button>
                 <button className="px-10 py-5 rounded-2xl glass border-white/10 text-white font-black text-[11px] uppercase tracking-[.3em] hover:bg-white/5 hover:scale-105 transition-all">
                    Layout Map
                 </button>
              </div>
           </div>

           <StadiumVisualizer 
             zones={displayedZones} 
             selectedZone={selectedZone} 
             onSelectZone={(z) => setSelectedZone(z)} 
             isAIEnabled={isAIEnabled}
           />
        </section>

        {/* Zones Grid */}
        <section className="space-y-16">
          <div className="flex items-end justify-between border-b border-white/5 pb-10">
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-px bg-indigo-500" />
                   <span className="text-indigo-400 text-[11px] font-black uppercase tracking-[.6em]">Spatial Segments</span>
                </div>
                <h3 className="text-6xl font-black text-white tracking-tighter uppercase italic">Section Monitoring</h3>
             </div>
             <div className="flex items-center gap-6">
               {selectedZone && (
                 <button 
                  onClick={() => setSelectedZone(null)}
                  className="text-[11px] font-black text-indigo-400 uppercase tracking-[.4em] border border-indigo-500/40 px-10 py-4 rounded-[1.5rem] hover:bg-indigo-500/10 transition-all shadow-[0_0_20px_rgba(129,140,248,0.1)]"
                 >
                   Clear Routing
                 </button>
               )}
               <div className="glass px-8 py-4 rounded-[1.5rem] border-white/10 flex items-center gap-4">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                    <Activity size={16} className="text-indigo-500" />
                  </motion.div>
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-[.3em]">
                    Uplink Live: 2.0s
                  </span>
               </div>
             </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {displayedZones.map((zone) => (
              <ZoneCard 
                key={zone.zone} 
                data={zone} 
                isSelected={selectedZone === zone.zone}
                onSelect={() => setSelectedZone(zone.zone)}
              />
            ))}
          </div>
        </section>

        {/* Dashboard Bottom Section */}
        <section className="grid lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
             <DecisionEngine zones={displayedZones} isAIEnabled={isAIEnabled} />
           </div>
           <div className="glass rounded-[2rem] border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent p-10 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                 <ShieldCheck size={120} />
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[.4em]">Security Status</div>
                <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">System <br /> Integrity</h4>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-white/40">
                   <span>Auth Node</span>
                   <span className="text-emerald-400">Verified</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-white/40">
                   <span>Encryption</span>
                   <span className="text-emerald-400">SHA-256</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-white/40">
                   <span>Uplink</span>
                   <span className="text-emerald-400">Active</span>
                </div>
              </div>
              <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all mt-8">
                 Security Logs
              </button>
           </div>
        </section>

      </main>

      <footer className="px-12 py-20 border-t border-white/5 bg-black/60 backdrop-blur-3xl">
         <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="text-white" size={20} />
               </div>
               <span className="text-sm font-black text-white uppercase italic tracking-tighter">SafeExit AI // 2024</span>
            </div>
            <div className="flex gap-12 text-[10px] font-black text-white/40 uppercase tracking-[.4em]">
               <a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a>
               <a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a>
            </div>
            <div className="text-[9px] font-bold text-white/20 uppercase tracking-[.3em]">
               Uptime: 99.98% / Build: v2.4.0
            </div>
         </div>
      </footer>
    </div>
  );
}
