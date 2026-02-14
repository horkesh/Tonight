
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { User, Scene, VibeStats, PersonaState, Question, IntelligenceReport } from './types';
import { INITIAL_VIBE, DEEP_QUESTIONS, ACTIVITIES } from './constants';
import { generateScene, analyzeImageAction, generateAbstractAvatar, generateIntelligenceReport } from './services/geminiService';
import { PresenceBar } from './components/PresenceBar';
import { ActionDock } from './components/ActionDock';
import { VibeMatrix } from './components/VibeMatrix';
import { GlassCard } from './components/ui/GlassCard';
import { CameraModal } from './components/CameraModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { PersonaReveal } from './components/PersonaReveal';
import { ReactionPicker } from './components/ReactionPicker';
import { SharedDraft } from './components/SharedDraft';
import { Soundscape } from './components/Soundscape';
import { IntelligenceBriefing } from './components/IntelligenceBriefing';
import { motion, AnimatePresence } from 'framer-motion';

const HARIS_ID = 'haris';
const BERINA_ID = 'berina';

const INITIAL_PERSONA: PersonaState = {
  traits: [], memories: [], secrets: [], imageUrl: null, lastGeneratedRound: 0, isGenerating: false, 
  revealProgress: 5, chemistry: 20, drunkFactor: 0
};

type AppView = 'setup' | 'hub' | 'activity' | 'question' | 'loading' | 'rating';

export default function App() {
  const [view, setView] = useState<AppView>('setup');
  const [activePersonaTab, setActivePersonaTab] = useState<'partner' | 'self'>('partner');
  const [vibe, setVibe] = useState<VibeStats>(INITIAL_VIBE);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [round, setRound] = useState(0);
  const [sipLevel, setSipLevel] = useState(0);
  const [partnerPersona, setPartnerPersona] = useState<PersonaState>({
    ...INITIAL_PERSONA, traits: ['Sophisticated', 'Observational', 'Escapist']
  });
  const [userPersona, setUserPersona] = useState<PersonaState>(INITIAL_PERSONA);
  const [sharedDraft, setSharedDraft] = useState('');
  
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [questionOwnerId, setQuestionOwnerId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Question['category'] | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([]);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<'drink' | 'selfie'>('drink');
  const [reactionPickerOpen, setReactionPickerOpen] = useState(false);
  const [draftOpen, setDraftOpen] = useState(false);
  const [activeReaction, setActiveReaction] = useState<string | null>(null);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [showPlotTwistConfirm, setShowPlotTwistConfirm] = useState(false);
  const [showEndSessionConfirm, setShowEndSessionConfirm] = useState(false);
  
  const [intelligenceReport, setIntelligenceReport] = useState<IntelligenceReport | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  
  const [clinkActive, setClinkActive] = useState(false);
  const lastDrinkTime = useRef<number>(0);

  const [users, setUsers] = useState<User[]>([
    { id: HARIS_ID, name: 'Haris', isSelf: false, status: 'online', avatar: null },
    { id: BERINA_ID, name: 'Berina', isSelf: false, status: 'online', avatar: null }
  ]);

  const getSelf = useCallback(() => users.find(u => u.isSelf), [users]);
  const getPartner = useCallback(() => users.find(u => !u.isSelf), [users]);

  // Sensory Haze Effect
  useEffect(() => {
    const root = document.documentElement;
    const blur = partnerPersona.drunkFactor * 0.8;
    root.style.setProperty('--haze-blur', `${blur}px`);
    if (partnerPersona.drunkFactor > 0) document.body.classList.add('haze-active');
    else document.body.classList.remove('haze-active');
  }, [partnerPersona.drunkFactor]);

  // Chemistry Logic
  useEffect(() => {
    const chem = Math.round((vibe.flirty * 0.6) + (vibe.comfortable * 0.4));
    setPartnerPersona(p => ({ ...p, chemistry: chem }));
  }, [vibe.flirty, vibe.comfortable]);

  // Bot Logic (Simulated Partner interaction for Questions)
  useEffect(() => {
    const self = getSelf();
    if (self?.id === HARIS_ID && view === 'question' && activeQuestion && questionOwnerId === HARIS_ID) {
      setUsers(prev => prev.map(u => u.id === BERINA_ID ? { ...u, status: 'choosing' } : u));
      
      const timer = setTimeout(() => {
        const refusalThreshold = activeQuestion.category === 'Intimate' ? 0.35 : 0.15;
        const shouldRefuse = Math.random() < refusalThreshold && partnerPersona.chemistry < 50;

        if (shouldRefuse) {
          showFlash("Berina: Too direct. 🍷", 3000);
          handleRefuse();
        } else {
          const randomChoice = activeQuestion.options[Math.floor(Math.random() * activeQuestion.options.length)];
          handleAnswerSelect(randomChoice);
        }
        
        setUsers(prev => prev.map(u => u.id === BERINA_ID ? { ...u, status: 'online' } : u));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [view, activeQuestion, questionOwnerId, getSelf, partnerPersona.chemistry]);

  const showFlash = (msg: string, duration = 2500) => {
    setFlashMessage(msg);
    setTimeout(() => setFlashMessage(null), duration);
  };

  const startApp = (charId: string) => {
    setUsers(prev => prev.map(u => ({ ...u, isSelf: u.id === charId, status: 'online' })));
    if (charId === HARIS_ID) updatePersonaImage('partner', ['Blonde', 'Sophisticated'], 15);
    setView('hub');
  };

  const updatePersonaImage = async (target: 'self' | 'partner', traits: string[], progress: number) => {
    const setter = target === 'self' ? setUserPersona : setPartnerPersona;
    setter(p => ({ ...p, isGenerating: true }));
    try {
      const url = await generateAbstractAvatar(traits, progress);
      setter(p => ({ ...p, imageUrl: url, lastGeneratedRound: round }));
    } catch {
      setter(p => ({ ...p, imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop" }));
    } finally {
      setter(p => ({ ...p, isGenerating: false }));
    }
  };

  const handleDrinkAction = () => {
    const now = Date.now();
    const withinClinkRange = (now - lastDrinkTime.current) < 5000 && lastDrinkTime.current !== 0;
    
    if (withinClinkRange) {
      setClinkActive(true);
      showFlash("VIRTUAL CLINK 🥃", 3000);
      if (navigator.vibrate) navigator.vibrate([100, 30, 100]);
      setTimeout(() => setClinkActive(false), 1000);
    }
    
    lastDrinkTime.current = now;
    setSipLevel(0);
    setPartnerPersona(p => ({ ...p, drunkFactor: Math.min(5, p.drunkFactor + 1) }));
  };

  const handleActivitySelect = async (activityId: string) => {
    setView('loading');
    try {
      const scene = await generateScene(vibe, round + 1, partnerPersona, undefined, activityId);
      setCurrentScene(scene);
      setRound(round + 1);
      setView('activity');
    } catch { setView('hub'); }
  };

  const handleChoice = (choiceId: string) => {
    const choice = currentScene?.choices?.find(c => c.id === choiceId);
    if (!choice) return;

    setVibe(v => ({
      playful: Math.min(100, Math.max(0, (v.playful || 0) + (choice.vibeEffect.playful || 0))),
      flirty: Math.min(100, Math.max(0, (v.flirty || 0) + (choice.vibeEffect.flirty || 0))),
      deep: Math.min(100, Math.max(0, (v.deep || 0) + (choice.vibeEffect.deep || 0))),
      comfortable: Math.min(100, Math.max(0, (v.comfortable || 0) + (choice.vibeEffect.comfortable || 0))),
    }));

    if (choice.symbol === '🥃') handleDrinkAction();
    setView('hub');
  };

  const handleCategorySelect = (cat: Question['category']) => {
    setSelectedCategory(cat);
    const filtered = DEEP_QUESTIONS.filter(q => q.category === cat && !askedQuestionIds.includes(q.id));
    setAvailableQuestions([...filtered].sort(() => 0.5 - Math.random()).slice(0, 3));
    showFlash(`Focus: ${cat}`, 1000);
  };

  const handleQuestionSelect = (q: Question) => {
    setActiveQuestion(q);
    setAskedQuestionIds(prev => [...prev, q.id]);
    setQuestionOwnerId(getSelf()?.id || null);
    showFlash(`Requesting Disclosure`, 1200);
  };

  const handleRefuse = () => {
    setPartnerPersona(p => ({ 
        ...p, drunkFactor: Math.min(5, p.drunkFactor + 1),
        memories: [...p.memories, "Chose silence and wine"].slice(-10)
    }));
    setSipLevel(0);
    setActiveQuestion(null);
    setSelectedCategory(null);
    setView('hub');
    showFlash("🥃 Respecting the boundary.", 2000);
  };

  const handleAnswerSelect = (opt: string) => {
    const isDrink = opt.toLowerCase().includes("sip") || opt.toLowerCase().includes("wine");
    const question = activeQuestion;
    const entry = question ? question.knowledgeTemplate.replace('{option}', opt) : opt;
    
    setPartnerPersona(p => {
      const nextProgress = Math.min(100, p.revealProgress + (isDrink ? 5 : 12));
      const newTraits = [...new Set([...p.traits, opt.split(' ').slice(-1)[0]])].slice(0, 6);
      if (round % 2 === 0 || !p.imageUrl) updatePersonaImage('partner', newTraits, nextProgress);
      return {
        ...p, revealProgress: nextProgress, 
        drunkFactor: isDrink ? Math.min(5, p.drunkFactor + 1) : p.drunkFactor,
        memories: [...p.memories, entry].slice(-10), traits: newTraits
      };
    });

    if (isDrink) handleDrinkAction();
    setActiveQuestion(null);
    setQuestionOwnerId(null);
    setSelectedCategory(null);
    setView('hub');
  };

  const handleRequestReport = () => {
    setView('rating');
    showFlash("Requesting Partner Appraisal...");
  };

  const finalizeReport = async (rating: number) => {
    setView('loading');
    try {
      const report = await generateIntelligenceReport(vibe, partnerPersona, rating);
      setIntelligenceReport(report);
      setReportOpen(true);
      setView('hub');
    } catch { setView('hub'); }
  };

  const categories: Question['category'][] = ['Style', 'Escape', 'Preferences', 'Deep', 'Parenting', 'Intimate'];

  return (
    <div className="min-h-screen pb-40 overflow-x-hidden selection:bg-rose-500/30">
      {view !== 'setup' && (
        <>
          <PresenceBar users={users} round={round} />
          <Soundscape vibe={vibe} />
          
          <AnimatePresence>
            {getPartner()?.status === 'choosing' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 0.2, scale: 1.2 }} exit={{ opacity: 0, scale: 1.5 }}
                className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-rose-950 rounded-full blur-[100px] pointer-events-none mix-blend-screen z-[-1]"
              />
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {clinkActive && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-amber-500 z-[200] pointer-events-none mix-blend-overlay"
              />
            )}
          </AnimatePresence>
        </>
      )}
      
      <main className="px-6 max-w-md mx-auto flex flex-col pt-24">
        <AnimatePresence>
            {flashMessage && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-24 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none">
                    <div className="bg-rose-600 text-white px-8 py-3.5 rounded-full text-[10px] tracking-widest uppercase shadow-2xl font-black">
                        {flashMessage}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
            {view === 'setup' && (
              <motion.div key="setup" className="flex items-center justify-center pt-24">
                <GlassCard className="w-full max-w-sm p-14 flex flex-col items-center text-center bg-black/40 border-white/5 rounded-[64px]">
                    <h1 className="text-7xl font-serif mb-6 text-white tracking-tighter">Tonight</h1>
                    <div className="grid grid-cols-1 gap-5 w-full">
                        <button onClick={() => startApp(HARIS_ID)} className="p-7 rounded-[40px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all flex items-center justify-center gap-5 group">
                            <span className="text-4xl grayscale group-hover:grayscale-0">👨🏻</span>
                            <span className="font-serif text-2xl">Haris</span>
                        </button>
                        <button onClick={() => startApp(BERINA_ID)} className="p-7 rounded-[40px] bg-white/[0.03] border border-white/5 hover:bg-rose-950/20 hover:border-rose-500/30 transition-all flex items-center justify-center gap-5 group">
                            <span className="text-4xl grayscale group-hover:grayscale-0">👱‍♀️</span>
                            <span className="font-serif text-2xl">Berina</span>
                        </button>
                    </div>
                </GlassCard>
              </motion.div>
            )}

            {view === 'hub' && (
              <motion.div key="hub" className="flex flex-col gap-10">
                 <section className="flex flex-col gap-6">
                    <PersonaReveal persona={activePersonaTab === 'partner' ? partnerPersona : userPersona} name={activePersonaTab === 'partner' ? getPartner()?.name || "Partner" : "You"} isSelf={activePersonaTab === 'self'} />
                    <div className="flex justify-center gap-4 bg-white/[0.02] p-1.5 rounded-full border border-white/5 backdrop-blur-3xl">
                        {['partner', 'self'].map(tab => (
                          <button key={tab} onClick={() => setActivePersonaTab(tab as any)} className={`flex-1 py-3 rounded-full text-[10px] uppercase tracking-widest font-black transition-all ${activePersonaTab === tab ? 'bg-rose-600 text-white' : 'text-white/30'}`}>
                            {tab === 'partner' ? 'Their Mystery' : 'Your Projection'}
                          </button>
                        ))}
                    </div>
                 </section>

                 <VibeMatrix vibe={vibe} sipLevel={sipLevel} drunkFactor={partnerPersona.drunkFactor} />

                 {/* Questions & Reactions Action Grid */}
                 <section className="grid grid-cols-2 gap-4">
                    <button onClick={() => setView('question')} className="p-8 bg-rose-600 border border-rose-400/30 rounded-[48px] hover:bg-rose-500 transition-all text-center flex flex-col items-center gap-4 shadow-[0_15px_35px_rgba(225,29,72,0.3)] group">
                        <span className="text-4xl group-hover:scale-110 transition-transform">✨</span>
                        <h4 className="text-lg font-serif text-white">Ask Question</h4>
                    </button>
                    <button onClick={() => setReactionPickerOpen(true)} className="p-8 bg-white/[0.03] border border-white/5 rounded-[48px] hover:bg-white/[0.06] transition-all text-center flex flex-col items-center gap-4 group">
                        <span className="text-4xl group-hover:scale-110 transition-transform">🎭</span>
                        <h4 className="text-lg font-serif text-white/80">Reaction</h4>
                    </button>
                 </section>

                 <section className="flex flex-col gap-4">
                    <button onClick={handleRequestReport} className="w-full p-8 bg-white/[0.03] border border-white/5 rounded-[48px] flex items-center justify-between group overflow-hidden relative">
                        <div className="relative z-10 text-left">
                           <span className="text-[9px] text-rose-500 tracking-[0.4em] uppercase font-black">Narration PERSISTENCE</span>
                           <h4 className="text-2xl font-serif italic text-white/80">The Morning Edition</h4>
                        </div>
                        <span className="text-4xl relative z-10 group-hover:rotate-12 transition-transform">🗞️</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                 </section>

                 <section className="grid grid-cols-1 gap-4 pb-24">
                    {ACTIVITIES.map((act) => (
                    <button key={act.id} onClick={() => handleActivitySelect(act.id)} className="p-6 bg-white/[0.02] border border-white/5 rounded-[48px] hover:bg-rose-950/20 transition-all text-left flex items-center gap-7 group">
                        <div className="w-16 h-16 rounded-[28px] bg-white/5 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">{act.icon}</div>
                        <div>
                            <h4 className="text-xl font-serif text-white/80 group-hover:text-white">{act.title}</h4>
                            <p className="text-[10px] text-white/20 uppercase tracking-widest mt-0.5">{act.description}</p>
                        </div>
                    </button>
                    ))}
                 </section>
              </motion.div>
            )}

            {view === 'question' && (
              <motion.div key="q-view" className="flex flex-col pt-16 gap-10">
                 {!selectedCategory && (
                    <div className="grid grid-cols-1 gap-4">
                        <span className="text-[10px] text-white/20 uppercase tracking-[0.5em] text-center font-black mb-4">Intel Sector</span>
                        {categories.map(cat => (
                            <button key={cat} onClick={() => handleCategorySelect(cat)} className="p-8 bg-white/[0.03] border border-white/5 rounded-[40px] hover:bg-rose-950/20 transition-all text-center">
                                <span className="text-2xl font-serif text-white/80">{cat}</span>
                            </button>
                        ))}
                        <button onClick={() => setView('hub')} className="mt-8 text-white/10 text-[11px] tracking-[0.6em] uppercase font-black">Back to Hub</button>
                    </div>
                 )}
                 {selectedCategory && !activeQuestion && (
                    <div className="flex flex-col gap-6">
                        <span className="text-[10px] text-rose-500 uppercase tracking-[0.5em] text-center font-black">Sector: {selectedCategory}</span>
                        {availableQuestions.map(q => (
                            <button key={q.id} onClick={() => handleQuestionSelect(q)} className="p-9 rounded-[56px] bg-white/5 border border-white/5 hover:bg-rose-950/20 transition-all text-left">
                                <p className="text-white/90 text-xl font-serif italic leading-relaxed">"{q.text}"</p>
                            </button>
                        ))}
                        <button onClick={() => setSelectedCategory(null)} className="mt-8 text-white/10 text-[11px] tracking-[0.6em] uppercase font-black">Back</button>
                    </div>
                 )}
                 {activeQuestion && (
                    <div className="flex flex-col gap-12">
                        <div className="p-12 bg-rose-950/20 rounded-[72px] border border-rose-500/20 text-center">
                           <span className="text-[11px] tracking-[0.8em] text-rose-500 uppercase font-black mb-8 block">{activeQuestion.category}</span>
                           <p className="text-4xl font-serif text-white italic leading-tight">"{activeQuestion.text}"</p>
                        </div>
                        {questionOwnerId !== getSelf()?.id ? (
                          <div className="grid grid-cols-1 gap-5">
                            {activeQuestion.options.map((opt, i) => (
                              <button key={i} onClick={() => handleAnswerSelect(opt)} className="p-9 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/10 text-[12px] tracking-[0.2em] uppercase font-black transition-all">
                                {opt}
                              </button>
                            ))}
                            <button onClick={handleRefuse} className="mt-4 p-9 rounded-full border border-rose-500/40 text-rose-500 hover:bg-rose-500 hover:text-white text-[12px] tracking-[0.4em] uppercase font-black transition-all">Refuse & Sip 🥃</button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-32 text-white/10 gap-8">
                             <div className="w-12 h-12 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
                             <span className="text-[11px] uppercase tracking-[0.8em] font-black">Awaiting Disclosure</span>
                          </div>
                        )}
                    </div>
                 )}
              </motion.div>
            )}

            {view === 'rating' && (
                <motion.div key="rating" className="flex flex-col items-center justify-center pt-24 gap-12 text-center">
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] text-rose-500 tracking-[0.6em] uppercase font-black">Appraisal Request</span>
                        <h2 className="text-4xl font-serif text-white italic">Rate the connection...</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 max-w-xs">
                        {[1,2,3,4,5,6,7,8,9,10].map(n => (
                            <button 
                                key={n} onClick={() => finalizeReport(n)}
                                className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-lg font-black hover:bg-rose-600 hover:border-rose-400 transition-all"
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setView('hub')} className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black">Cancel Briefing</button>
                </motion.div>
            )}

            {view === 'activity' && currentScene && (
                <motion.div key={currentScene.id} className="flex flex-col gap-16 pt-16">
                    <p className="px-6 text-center text-5xl font-serif italic text-white leading-tight tracking-tighter drop-shadow-lg">{currentScene.narrative}</p>
                    <div className="flex flex-col gap-4 pb-20">
                        {currentScene.choices.map((c) => (
                            <button key={c.id} onClick={() => handleChoice(c.id)} className="flex items-center justify-between p-7 rounded-[40px] bg-white/[0.02] border border-white/5 hover:bg-rose-950/20 transition-all active:scale-98 group">
                                <span className="text-4xl grayscale group-hover:grayscale-0">{c.symbol || "✨"}</span>
                                <span className="text-[11px] text-white/40 uppercase tracking-[0.3em] font-black group-hover:text-white ml-6">{c.text}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {view === 'loading' && (
              <div className="flex flex-col items-center justify-center py-52">
                 <div className="w-24 h-[2px] bg-rose-600 animate-[width_2s_infinite] mx-auto" />
                 <span className="text-[10px] text-rose-500 tracking-[0.6em] uppercase mt-8 font-black">Drafting Files</span>
              </div>
            )}
        </AnimatePresence>
      </main>

      <ActionDock 
        onReact={(e) => showFlash(e, 1000)} 
        onCamera={() => { setCameraType('drink'); setCameraOpen(true); }} 
        onPlotTwist={() => setDraftOpen(true)} 
        onEndSession={() => setShowEndSessionConfirm(true)}
      />
      
      <CameraModal isOpen={cameraOpen} onClose={() => setCameraOpen(false)} onCapture={async (b) => {
          setCameraOpen(false); showFlash("Analyzing Image...");
          const r = await analyzeImageAction(b, cameraType);
          showFlash(r.text);
      }} instruction="Exhibit Object" />
      
      <SharedDraft isOpen={draftOpen} onClose={() => setDraftOpen(false)} value={sharedDraft} onChange={setSharedDraft} />
      
      <ReactionPicker isOpen={reactionPickerOpen} onClose={() => setReactionPickerOpen(false)} onSelect={(u) => { setActiveReaction(u); setReactionPickerOpen(false); setTimeout(()=>setActiveReaction(null), 5000); }} persona={partnerPersona} />
      
      <IntelligenceBriefing report={intelligenceReport} isOpen={reportOpen} onClose={() => setReportOpen(false)} />

      <ConfirmationModal 
        isOpen={showEndSessionConfirm} onClose={() => setShowEndSessionConfirm(false)} 
        onConfirm={() => window.location.reload()} title="Seal Records?" 
        message="Terminate this session and purge all ephemeral drafts." confirmText="Purge" variant="danger" 
      />
    </div>
  );
}
