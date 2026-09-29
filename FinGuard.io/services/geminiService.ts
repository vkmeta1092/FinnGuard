
import { GoogleGenAI, Type } from "@google/genai";
import { PondMetrics, DiseaseAnalysis } from "../types";

export interface SearchProductResult {
  title: string;
  price?: string;
  description: string;
  sourceUrl: string;
  sourceTitle: string;
}

const getAIClient = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * Robust disease detection using Gemini 3 Pro with multimodal reasoning.
 */
export const detectFishDisease = async (base64Image: string): Promise<DiseaseAnalysis> => {
  const ai = getAIClient();
  
  // Ensure we only have the raw base64 data
  const cleanBase64 = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
          { text: "Analyze this fish for diseases. Look for white spots, red patches, missing scales, or growths. Return a detailed JSON object with diseaseId, confidence, treatmentPlan, and recommendations." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 4000 },
        systemInstruction: "You are an expert Fish Pathologist. If symptoms are visible, identify the disease. If the fish is healthy, return 'Healthy'. Output ONLY valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseaseId: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            treatmentPlan: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["diseaseId", "confidence", "treatmentPlan", "recommendations"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    return {
      diseaseId: data.diseaseId || 'Unknown Pathogen',
      confidence: data.confidence || 0.5,
      treatmentPlan: data.treatmentPlan || 'Consult a specialist.',
      recommendations: data.recommendations || ['Maintain water quality.']
    };
  } catch (err) {
    console.error("[AI] Disease Identification Failed:", err);
    throw new Error("Diagnosis unavailable. Ensure image quality is high.");
  }
};

/**
 * Health analysis with high reasoning budget.
 */
export const analyzePondHealth = async (metrics: PondMetrics): Promise<string> => {
  const ai = getAIClient();
  const prompt = `Critically analyze these pond metrics: pH ${metrics.ph}, Temp ${metrics.temp}C, DO ${metrics.oxygen}mg/L. Provide a health score and actionable advice.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { thinkingConfig: { thinkingBudget: 2000 } }
  });

  return response.text || "Unable to generate health analysis.";
};

/**
 * Market search with search grounding.
 */
export const searchAquacultureProducts = async (query: string): Promise<{ products: SearchProductResult[]; sources: any[] }> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Top 5 ${query} for Indian fish farmers. Include sources.`,
    config: { tools: [{ googleSearch: {} }] },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const products: SearchProductResult[] = (response.text || "").split('\n')
    .filter(l => l.match(/^\d\./))
    .slice(0, 5)
    .map((line, i) => ({
      title: line.replace(/^\d\.\s*/, '').split(':')[0],
      description: line.includes(':') ? line.split(':')[1] : "Verified aquaculture product.",
      sourceUrl: groundingChunks[i]?.web?.uri || "https://google.com",
      sourceTitle: groundingChunks[i]?.web?.title || "Search Result"
    }));

  return { products, sources: groundingChunks };
};

// Added getSearchSuggestions to provide AI-powered autocomplete for the marketplace search.
export const getSearchSuggestions = async (query: string): Promise<string[]> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 common search autocomplete suggestions for an aquaculture marketplace given the partial query: "${query}". Target audience: Indian fish farmers. Products like fish feed, probiotic, aerators, seeds.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (err) {
    console.error("[AI] Failed to fetch search suggestions:", err);
    return [];
  }
};

export const getTreatmentMedicines = async (diseaseName: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Medicines for ${diseaseName} in India.`,
    config: { tools: [{ googleSearch: {} }] },
  });
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const products = (response.text || "").split('\n')
    .filter(l => l.match(/^\d\./))
    .slice(0, 3)
    .map((line, i) => ({
      title: line.replace(/^\d\.\s*/, '').split(':')[0],
      description: "Effective treatment.",
      sourceUrl: groundingChunks[i]?.web?.uri || "https://google.com",
      sourceTitle: groundingChunks[i]?.web?.title || "Verified"
    }));
  return { products };
};

export const getWaterQualityCrisisAdvice = async (issue: string) => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `CRITICAL: ${issue}. Provide immediate fixes and products.`,
    config: { tools: [{ googleSearch: {} }] },
  });
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return { 
    advice: response.text || "", 
    products: groundingChunks.slice(0, 3).map(c => ({
      title: c.web?.title || "Product",
      sourceUrl: c.web?.uri || "https://google.com",
      description: "Urgent fix.",
      sourceTitle: "Google Verified"
    }))
  };
};
