export interface User {
  id: string;
  name: string;
  avatar?: string | null;
  isSelf: boolean;
  status: 'online' | 'choosing' | 'waiting' | 'reacting' | 'camera';
}

export interface Choice {
  id: string;
  text: string;
  symbol?: string; 
  vibeEffect: {
    playful?: number;
    flirty?: number;
    deep?: number;
    comfortable?: number;
  };
}

export interface Question {
  id: string;
  text: string;
  category: 'Style' | 'Escape' | 'Preferences' | 'Deep' | 'Parenting' | 'Intimate';
  options: string[];
  knowledgeTemplate: string;
  traitEffect?: string;
}

export interface Scene {
  id: string;
  type: 'intro' | 'conversation' | 'activity' | 'climax' | 'resolution' | 'question_round';
  narrative: string;
  choices: Choice[];
  round: number;
}

export interface VibeStats {
  playful: number;
  flirty: number;
  deep: number;
  comfortable: number;
}

export interface PersonaState {
  traits: string[];
  memories: string[]; 
  secrets: string[]; 
  imageUrl: string | null;
  lastGeneratedRound: number;
  isGenerating: boolean;
  revealProgress: number; 
  chemistry: number; 
  drunkFactor: number; 
}

export interface IntelligenceReport {
  headline: string;
  lede: string;
  summary: string;
  vibeAnalysis: string;
  closingThought: string;
  partnerRating?: number;
  date: string;
}

export interface SessionState {
  users: User[];
  currentScene: Scene | null;
  history: Scene[];
  vibe: VibeStats;
  round: number;
  sipLevel: number;
  sharedDraft: string;
}