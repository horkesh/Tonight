import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';

interface SharedDraftProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (val: string) => void;
}

export const SharedDraft: React.FC<SharedDraftProps> = ({ isOpen, onClose, value, onChange }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-3xl"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }}
            className="relative w-full max-w-lg"
          >
            <GlassCard className="p-10 bg-slate-950/80 border-white/5 shadow-2xl rounded-[48px]">
               <header className="flex justify-between items-center mb-8">
                  <div>
                    <span className="text-[10px] tracking-[0.5em] text-rose-500 uppercase font-black">Shared Draft</span>
                    <p className="text-[9px] text-white/20 uppercase mt-1 font-mono">Off the record. Ephemeral.</p>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/30 hover:text-white transition-colors">✕</button>
               </header>
               
               <div className="relative">
                 <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type your classified thoughts here..."
                    className="w-full h-80 bg-white/[0.02] border border-white/5 rounded-[32px] p-8 text-white/80 font-serif text-lg leading-relaxed focus:outline-none focus:border-rose-500/30 transition-all resize-none placeholder:text-white/5"
                 />
                 <div className="absolute bottom-6 right-8 text-[9px] text-white/10 uppercase tracking-widest font-black pointer-events-none">
                    Syncing Ink...
                 </div>
               </div>
               
               <div className="mt-8 flex justify-center">
                  <p className="text-[8px] text-white/5 uppercase tracking-[0.6em] font-black">Data Dissolves on Exit</p>
               </div>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};