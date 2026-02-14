
import { GoogleGenAI, Type } from "@google/genai";
import { Scene, VibeStats, PersonaState, IntelligenceReport } from "../types";
import { SYSTEM_INSTRUCTION, BERINA_BIO } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using recommended way of defining response schema
const REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    headline: { type: Type.STRING, description: "A punchy, noir newspaper headline. Max 5 words." },
    lede: { type: Type.STRING, description: "A sharp, journalism-style opening sentence." },
    summary: { type: Type.STRING, description: "A sophisticated overview of the night's events. Max 30 words." },
    vibeAnalysis: { type: Type.STRING, description: "A marketing-style analysis of the connection's 'brand'." },
    closingThought: { type: Type.STRING, description: "A final, cynical yet elegant thought." },
    date: { type: Type.STRING }
  },
  required: ["headline", "lede", "summary", "vibeAnalysis", "closingThought", "date"],
};

export const generateIntelligenceReport = async (
  vibe: VibeStats,
  partner: PersonaState,
  rating: number
): Promise<IntelligenceReport> => {
  const model = "gemini-3-flash-preview";
  const prompt = `
    GENERATE INTELLIGENCE REPORT: "THE MORNING EDITION"
    
    Context: A high-end virtual connection session between Haris and Berina.
    Berina Profile: ${BERINA_BIO}
    Final Vibe Stats: ${JSON.stringify(vibe)}
    Chemistry: ${partner.chemistry}%
    Haze Level: ${partner.drunkFactor}/5
    Memories Unlocked: ${partner.memories.join(", ")}
    Partner Rating of the Connection: ${rating}/10
    
    Instruction: Write a noir, journalism-style briefing summarizing this encounter. 
    Use the jargon of a sophisticated marketing executive or an ex-journalist.
    The tone should be 'Off the record' and elegant.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: REPORT_SCHEMA,
      },
    });

    // response.text is a property, not a function
    const data = JSON.parse(response.text || "{}");
    return { ...data, partnerRating: rating };
  } catch (error) {
    return {
      headline: "The Silent Campaign",
      lede: "Records remain incomplete as the connection fades into the digital ether.",
      summary: "An evening of unspoken truths and strategic silences.",
      vibeAnalysis: "The brand of this connection is high-stakes and elusive.",
      closingThought: "Some stories are better left in the draft folder.",
      partnerRating: rating,
      date: new Date().toLocaleDateString()
    };
  }
};

export const generateScene = async (
  currentVibe: VibeStats,
  round: number,
  persona: PersonaState,
  previousChoiceText?: string,
  mode: string = 'Standard'
): Promise<Scene> => {
  const model = "gemini-3-flash-preview";
  let specializedPrompt = "";
  if (mode === 'truth') {
    specializedPrompt = `
      ACTIVITY: TRUTH OR DRINK.
      Berina asks a direct, slightly uncomfortable "Truth" question.
      Choices: Witty Truth, Vulnerable Truth, The Drink (🥃).
    `;
  }

  const prompt = `
    Partner Profile: ${BERINA_BIO}
    Round: ${round}. Chemistry: ${persona.chemistry}%. Haze: ${persona.drunkFactor}.
    Activity: ${mode}. Vibe: ${JSON.stringify(currentVibe)}.
    General Instruction: Generate a WITTY Modern Noir scene. Berina husband is AWAY. Quiet house.
    IMPORTANT: EXACTLY 3 choices. Pithy narrative (max 12 words).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            narrative: { type: Type.STRING },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  symbol: { type: Type.STRING },
                  vibeEffect: { 
                    type: Type.OBJECT, 
                    properties: { 
                      playful: { type: Type.NUMBER }, 
                      flirty: { type: Type.NUMBER }, 
                      deep: { type: Type.NUMBER }, 
                      comfortable: { type: Type.NUMBER } 
                    } 
                  }
                }
              }
            }
          },
          required: ["id", "type", "narrative", "choices"]
        },
      },
    });

    // response.text is a property
    const sceneData = JSON.parse(response.text || "{}");
    return { ...sceneData, round };
  } catch (error) {
    return { id: "f", type: "conversation", narrative: "The signal flickers...", choices: [], round };
  }
};

/**
 * Switching model to gemini-3-flash-preview for multimodal JSON analysis.
 * gemini-2.5-flash-image (nano banana) does not support JSON responses.
 */
export const analyzeImageAction = async (
  base64Image: string,
  actionType: 'drink' | 'selfie'
): Promise<{ text: string; vibeUpdate: Partial<VibeStats>; secretUnlocked?: string }> => {
  const model = "gemini-3-flash-preview";
  const prompt = actionType === 'drink' 
    ? `Berina perspective: Roast his drink choice. 6 words max.`
    : `Berina perspective: Roast his selfie 'brand'. 6 words max.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { 
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } }, 
          { text: prompt }
        ] 
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            vibeUpdate: { 
              type: Type.OBJECT, 
              properties: { 
                flirty: { type: Type.INTEGER }, 
                playful: { type: Type.INTEGER } 
              } 
            },
            secretUnlocked: { type: Type.STRING }
          },
          required: ["text", "vibeUpdate"]
        }
      }
    });
    // response.text is a property
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return { text: "Passable.", vibeUpdate: {} };
  }
};

/**
 * Using gemini-2.5-flash-image (Nano Banana) for image generation from text.
 */
export const generateAbstractAvatar = async (traits: string[], revealProgress: number): Promise<string> => {
  const model = "gemini-2.5-flash-image"; 
  const prompt = `A cinematic silhouette portrait of a pretty 38-year-old blonde woman. Noir house, solitude, red wine, sophisticated. Reveal: ${revealProgress}%.`;
  try {
    const response = await ai.models.generateContent({ 
      model, 
      contents: { parts: [{ text: prompt }] }, 
      config: { imageConfig: { aspectRatio: "1:1" } } 
    });
    // Find the inlineData part in candidates
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return "";
  } catch (error) { return ""; }
};

/**
 * Using gemini-2.5-flash-image (Nano Banana) for image generation from text.
 */
export const generateReactionImage = async (persona: PersonaState, reactionType: string): Promise<string> => {
  const model = "gemini-2.5-flash-image";
  const prompt = `Reaction shot of a pretty 38yo blonde woman. Expression: ${reactionType}. Dark noir house, wine glass. 35mm film, grainy, sophisticated.`;
  try {
    const response = await ai.models.generateContent({ 
      model, 
      contents: { parts: [{ text: prompt }] }, 
      config: { imageConfig: { aspectRatio: "4:3" } } 
    });
    // Find the inlineData part
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData?.data) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return "";
  } catch (error) { return ""; }
};
