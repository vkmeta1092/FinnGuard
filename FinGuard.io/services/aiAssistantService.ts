
import { GoogleGenAI, Type } from "@google/genai";
import { PondConfig, Screen } from "../types";

const ELEVEN_LABS_API_KEY = 'sk_d4ed41a77c069da3da3289e901897b314d382f6ef1845c8d';
const VOICE_ID = 'EhEJxxmk9e9L91lETuig';

export interface AIResponse {
  text: string;
  navigate?: Screen;
}

export const getGeminiAnalysis = async (query: string, pond: PondConfig, currentLang: string): Promise<AIResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are FinGuard AI, a friendly, expert aquaculture consultant for Indian farmers.
    
    TONE: Reassuring, professional, and conversational. Speak like a human expert.
    
    CAPABILITIES:
    1. Answer any question about fish farming (pH, diseases like White Spot or Dropsy, feeding, market prices).
    2. Understand mix of languages (Hinglish/Bengali-English).
    3. Navigate the app for the user.
    
    NAVIGATION MAPPING:
    - DASHBOARD: Home, metrics, health status.
    - MARKETPLACE: Shop, buy feed, seeds, medicine.
    - DISEASE: Detect illness, scan fish, camera diagnostic.
    - COLD_STORAGE: Storage, freezing, booking warehouse.
    - ANALYTICS: Yield forecast, charts, data.
    - PROFILE: Settings, account, logout.

    CURRENT DATA:
    - Pond: ${pond.name}, Health: ${pond.healthScore}/100.
    - Metrics: Temp ${pond.metrics.temp}C, pH ${pond.metrics.ph}, Oxygen ${pond.metrics.oxygen}mg/L.

    STRICT OUTPUT FORMAT (JSON ONLY):
    {
      "text": "Your helpful, conversational response in ${currentLang}",
      "navigate": "SCREEN_ID_OR_NULL"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: query,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            navigate: { type: Type.STRING, nullable: true }
          },
          required: ["text"]
        }
      },
    });

    const json = JSON.parse(response.text || "{}");
    return {
      text: json.text || "I'm here to help with your farm management.",
      navigate: json.navigate as Screen || undefined
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "I'm having a bit of trouble connecting to the brain center. Please try again in a moment." };
  }
};

/**
 * Premium Voice with ElevenLabs.
 * If ElevenLabs fails due to CORS or 'Failed to fetch', it catches the error and returns null.
 */
export const speakWithElevenLabs = async (text: string): Promise<HTMLAudioElement | null> => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVEN_LABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.5,
          use_speaker_boost: true
        }
      }),
    });

    if (!response.ok) {
      console.warn("ElevenLabs API returned non-OK status");
      return null;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    return new Audio(url);
  } catch (error) {
    // Gracefully handle 'Failed to fetch' errors which usually result from CORS or connection issues
    console.warn("ElevenLabs Fetch failed (possibly CORS). Falling back to Native TTS.");
    return null;
  }
};

/**
 * Fallback to standard Browser TTS if premium voice fails.
 */
export const speakWithFallback = (text: string, lang: string): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to pick a natural Indian-English voice or regional language voice
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (lang === 'hi') {
      utterance.lang = 'hi-IN';
      selectedVoice = voices.find(v => v.lang.includes('hi-IN'));
    } else if (lang === 'bn') {
      utterance.lang = 'bn-IN';
      selectedVoice = voices.find(v => v.lang.includes('bn-IN'));
    } else {
      utterance.lang = 'en-IN';
      selectedVoice = voices.find(v => v.lang.includes('en-IN')) || voices.find(v => v.lang.includes('en-GB'));
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    
    window.speechSynthesis.speak(utterance);
  });
};
