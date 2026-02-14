import React from 'react';
import { User } from '../types';
import { motion } from 'framer-motion';

interface PresenceBarProps {
  users: User[];
  round: number;
}

export const PresenceBar: React.FC<PresenceBarProps> = ({ users, round }) => {
  const self = users.find(u => u.isSelf);
  const partner = users.find(u => !u.isSelf);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-6 pointer-events-none">
      <div className="max-w-md mx-auto flex justify-between items-center bg-black/40 backdrop-blur-2xl border border-white/5 px-6 py-3 rounded-full shadow-2xl pointer-events-auto">
        {/* Self Avatar (How they see you) */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden bg-white/5">
              {self?.avatar ? (
                <img src={self.avatar} className="w-full h-full object-cover" alt="You" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-white/40 uppercase font-black">
                  {self?.name[0]}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-obsidian-950" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">You</span>
            <span className="text-[11px] text-white/70 font-serif italic">{self?.name}</span>
          </div>
        </div>

        {/* Partner Avatar (How you see them) */}
        <div className="flex items-center gap-3 text-right">
          <div className="flex flex-col">
            <span className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black">Partner</span>
            <span className="text-[11px] text-white/70 font-serif italic">{partner?.name}</span>
          </div>
          <div className="relative group">
            <div className="w-10 h-10 rounded-full border border-rose-500/20 overflow-hidden bg-rose-900/10">
              {partner?.avatar ? (
                <img src={partner.avatar} className="w-full h-full object-cover" alt={partner.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] text-rose-300/40 uppercase font-black">
                  {partner?.name[0]}
                </div>
              )}
            </div>
            <motion.div 
              animate={{ opacity: partner?.status === 'choosing' ? [0.4, 1, 0.4] : 1 }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full border-2 border-obsidian-950 ${
                partner?.status === 'choosing' ? 'bg-amber-400' : 'bg-rose-500'
              }`} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};