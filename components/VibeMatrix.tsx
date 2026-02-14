import React from 'react';
import { VibeStats } from '../types';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface VibeMatrixProps {
  vibe: VibeStats;
  sipLevel: number;
  drunkFactor: number;
}

export const VibeMatrix: React.FC<VibeMatrixProps> = ({ vibe, sipLevel, drunkFactor }) => {
  const data = [
    { subject: 'PLAYFUL', A: vibe.playful, fullMark: 100 },
    { subject: 'FLIRTY', A: vibe.flirty, fullMark: 100 },
    { subject: 'DEEP', A: vibe.deep, fullMark: 100 },
    { subject: 'COMFORT', A: vibe.comfortable, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 h-48 mt-8">
      {/* 3D Visualization Area */}
      <div className="col-span-3 bg-white/[0.02] border border-white/5 rounded-[40px] p-4 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-6 flex flex-col">
            <span className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">Atmosphere Matrix</span>
            <span className="text-[10px] text-rose-500/60 uppercase font-serif italic mt-0.5">Live Syncing</span>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="55%" outerRadius="60%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 7, fontWeight: 900, letterSpacing: 2 }} 
            />
            <Radar
              name="Vibe"
              dataKey="A"
              stroke="#e11d48"
              fill="#e11d48"
              fillOpacity={0.3}
              animationDuration={2000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Haze Meter Area */}
      <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col justify-between relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <span className="text-[8px] text-white/20 uppercase tracking-[0.4em] font-black">Haze Vector</span>
          <div className="flex gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div 
                key={i}
                initial={false}
                animate={{ 
                  backgroundColor: i <= drunkFactor ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                  boxShadow: i <= drunkFactor ? '0 0 8px rgba(245,158,11,0.3)' : 'none'
                }}
                className="h-1 flex-1 rounded-full transition-all duration-1000"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pt-2">
            <div className="relative w-full h-12 bg-white/5 rounded-2xl overflow-hidden border border-white/5">
                <motion.div 
                    animate={{ width: `${100 - sipLevel}%` }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-600/40 via-rose-500/20 to-transparent"
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <span className="text-[11px] font-black tracking-widest text-white uppercase">{100 - sipLevel}% ABV</span>
                </div>
            </div>
            <div className="mt-2 flex justify-between w-full px-1">
                <span className="text-[7px] text-white/20 uppercase font-black">Sober</span>
                <span className="text-[7px] text-rose-500 uppercase font-black">Infused</span>
            </div>
        </div>

        <div className="text-center">
            <span className="text-[14px] font-serif italic text-white/40">Glass {drunkFactor + 1}</span>
        </div>
      </div>
    </div>
  );
};