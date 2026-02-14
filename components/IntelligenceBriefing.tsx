import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligenceReport } from '../types';
import { GlassCard } from './ui/GlassCard';

interface IntelligenceBriefingProps {
  report: IntelligenceReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IntelligenceBriefing: React.FC<IntelligenceBriefingProps> = ({ report, isOpen, onClose }) => {
  if (!report) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="fixed inset-0 bg-black/95 backdrop-blur-2xl"
          />
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-2xl my-auto"
          >
            <div className="bg-[#f2f2f2] text-slate-900 p-12 rounded-[2px] shadow-[0_30px_90px_rgba(0,0,0,0.8)] border-8 border-slate-900 overflow-hidden font-serif">
               {/* Newspaper Header */}
               <header className="border-b-4 border-slate-900 pb-8 mb-8 text-center">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.4em] font-black mb-4 px-2">
                    <span>Vol. XXXVIII</span>
                    <span>Classified Edition</span>
                    <span>{report.date}</span>
                  </div>
                  <h1 className="text-7xl font-black uppercase tracking-tighter leading-none border-y-2 border-slate-900 py-4">Tonight</h1>
                  <p className="mt-4 text-sm italic opacity-60">"The only truth is off the record."</p>
               </header>

               {/* Main Article */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 border-r border-slate-300 pr-8">
                    <h2 className="text-4xl font-black leading-none mb-6">{report.headline}</h2>
                    <p className="text-lg font-bold mb-4 first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8]">{report.lede}</p>
                    <p className="text-base leading-relaxed opacity-80 mb-6">{report.summary}</p>
                    <div className="p-6 bg-slate-900 text-white rounded-[2px]">
                       <h4 className="text-[10px] uppercase tracking-widest font-black mb-2 opacity-50">Vibe Analysis</h4>
                       <p className="text-sm italic">"{report.vibeAnalysis}"</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-8">
                     <div className="border-b border-slate-300 pb-8">
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-4">Partner Rating</span>
                        <div className="flex items-baseline gap-2">
                           <span className="text-6xl font-black">{report.partnerRating}</span>
                           <span className="text-xl opacity-30">/ 10</span>
                        </div>
                     </div>
                     <div>
                        <span className="text-[10px] font-black uppercase tracking-widest block mb-4">Closing Thought</span>
                        <p className="text-sm italic leading-relaxed opacity-70">"{report.closingThought}"</p>
                     </div>
                     <button 
                        onClick={onClose}
                        className="mt-auto py-3 bg-slate-900 text-white uppercase text-[10px] tracking-[0.3em] font-black hover:bg-slate-800 transition-colors"
                     >
                        Close Files
                     </button>
                  </div>
               </div>
               
               <footer className="mt-12 pt-6 border-t border-slate-300 text-[9px] uppercase tracking-widest opacity-40 text-center">
                  All digital traces will be purged upon termination of this session.
               </footer>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};