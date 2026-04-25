import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI features will use fallback text.");
    }
    genAI = new GoogleGenAI({ apiKey: apiKey || "dummy_key" });
  }
  return genAI;
}

export const VOICE_VOICES = {
  CHEERFUL: "cheerful",
  NEUTRAL: "neutral",
  FORMAL: "formal",
};

/**
 * Simulates a voice assistant using Gemini.
 */
export async function getVoiceGuidance(text: string, language: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a extremely short, friendly, and clear instruction in ${language} for the following context: "${text}". 
      DO NOT use any special characters, markdown symbols, asterisks (*), or formatting.
      Return ONLY the plain text instruction.
      Keep it under 10 words as it will be read to elderly users.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return text; // Fallback to original text
  }
}

export async function translateText(text: string, targetLanguage: string) {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Translate the following text to ${targetLanguage}: "${text}". Return only the translated text.`,
    });
    
    return response.text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}
