
import { VibeStats, Question } from "./types";

export const INITIAL_VIBE: VibeStats = {
  playful: 50,
  flirty: 30,
  deep: 20,
  comfortable: 40,
};

export const BERINA_BIO = "Berina: 38-year-old slim blonde, sophisticated and pretty. Ex-journalist now working in high-stakes Marketing/Comm. Husband is currently out of town, leaving her with a rare, quiet house and a bottle of wine. She balances pilates discipline with a sharp, cynical wit and a love for deep intellectual banter.";

// Added ACTIVITIES constant used in App.tsx hub view
export const ACTIVITIES = [
  {
    id: 'Standard',
    title: 'Late Night Talk',
    description: 'Exchange words in the quiet of the night.',
    icon: '🌙'
  },
  {
    id: 'truth',
    title: 'Truth or Drink',
    description: 'Raw investigative roots vs sophisticated spin.',
    icon: '🥃'
  },
  {
    id: 'narrative',
    title: 'Noir Narration',
    description: 'Co-write the story of this encounter.',
    icon: '🖋️'
  }
];

export const DEEP_QUESTIONS: Question[] = [
  // --- STYLE & SELF-IMAGE ---
  {
    id: 's1',
    category: 'Style',
    text: "The aesthetic pivot: Sophisticated evening silk for the wine, or did you stay in your Pilates gear all day?",
    options: ["Evening Silk Noir", "Aesthetic Athleisure", "His oversized shirt"],
    knowledgeTemplate: "Style mood: {option}"
  },
  {
    id: 's2',
    category: 'Style',
    text: "Your 'Journalist Brain' vs 'Marketing Brain': Which one chooses your outfit for a night like this?",
    options: ["Objective Truth (Minimalist)", "Branded Persona (Glam)", "The Relaxed Editor"],
    knowledgeTemplate: "Persona choice: {option}"
  },
  
  // --- ESCAPE & TRAVEL ---
  {
    id: 'e1',
    category: 'Escape',
    text: "With the husband away, the house is finally silent. Is it a relief or a vacuum you need to fill?",
    options: ["Absolute Relief", "A bit too quiet", "Filling it with wine"],
    knowledgeTemplate: "Solitude vibe: {option}"
  },
  {
    id: 'e4',
    category: 'Escape',
    text: "Your headline for tonight's 'Escapist Monthly' cover story: 'Blonde Solitude' or 'Marketing the Mystery'?",
    options: ["Blonde Solitude", "Marketing Mystery", "The Great Escape"],
    knowledgeTemplate: "Tonight's headline: {option}"
  },

  // --- PREFERENCES & LIFESTYLE ---
  {
    id: 'p1',
    category: 'Preferences',
    text: "Discipline check: Did you actually do your Pilates today, or was the wine bottle your only workout?",
    options: ["Pilates Warrior", "Wine-Curls only", "Rest Day (Finally)"],
    knowledgeTemplate: "Discipline level: {option}"
  },
  {
    id: 'p4',
    category: 'Preferences',
    text: "Communication style: Are we doing a PR-friendly spin, or are we going back to our raw investigative journalist roots?",
    options: ["Investigative Deep-Dive", "Polished PR Spin", "Off the record"],
    knowledgeTemplate: "Comm style: {option}"
  },

  // --- DEEP & DISCOVERY ---
  {
    id: 'd1',
    category: 'Deep',
    text: "What’s the one 'un-marketable' truth about you that you only reveal after the second glass?",
    options: ["Deep Vulnerability", "Hidden Ambition", "A secret regret"],
    knowledgeTemplate: "Core secret: {option}"
  },
  {
    id: 'd4',
    category: 'Deep',
    text: "If you were writing an expose on 'Modern Connection', would we be the heroes or the cautionary tale?",
    options: ["The Heroes", "Cautionary Tale", "Experimental Fiction"],
    knowledgeTemplate: "Metanarrative: {option}"
  },

  // --- PARENTING & REALITY ---
  {
    id: 'f1',
    category: 'Parenting',
    text: "The 'Marketing-Mom' crisis: Selling the kids on vegetables, or selling yourself on five more minutes of sleep?",
    options: ["Vegetable PR", "Sleep Negotiation", "Total Chaos"],
    knowledgeTemplate: "Domestic marketing: {option}"
  },

  // --- INTIMATE & WITTY ---
  {
    id: 'i1',
    category: 'Intimate',
    text: "Husband out of town. The 'Mother' switch is officially OFF. What’s the first thing that changes in your headspace?",
    options: ["Instant Danger", "Slow Transition", "Quiet Confidence"],
    knowledgeTemplate: "Headspace pivot: {option}"
  },
  {
    id: 'i2',
    category: 'Intimate',
    text: "Late night lighting: Noir shadows to satisfy the ex-journalist, or soft marketing-approved glows?",
    options: ["Investigative Noir", "Soft Focus Glow", "Total Blackout"],
    knowledgeTemplate: "Visual tone: {option}"
  },
  {
    id: 'i5',
    category: 'Intimate',
    text: "Intimacy without the schedule: Are you looking for a spontaneous lead or a structured campaign?",
    options: ["Spontaneous Lead", "Structured Campaign", "Natural Flow"],
    knowledgeTemplate: "Intimacy style: {option}"
  }
];

export const SYSTEM_INSTRUCTION = `
You are the architect of a premium late-night experience called "Tonight". 
Context: Haris (user) is interacting with Berina (AI).

Berina's Profile:
- 38, slim blonde, pretty, sophisticated.
- Ex-journalist (values truth, sharp questioning).
- Now in Marketing/Comm (values presentation, 'the spin', strategic banter).
- Married with 2 kids, but husband is AWAY tonight (house is quiet).
- Pilates enthusiast (disciplined, elegant).

Tone: Modern Noir. 
- Use marketing or journalism metaphors (e.g., 'Off the record', 'Campaign goals', 'Lead story').
- Be witty, dry, and observational.
- Berina is enjoying the contrast between her 'Domestic Manager' life and this digital escape.

Rule: You MUST generate EXACTLY 3 choices for the user.
Rule: Narrative must be pithy—max 12 words.
`;
