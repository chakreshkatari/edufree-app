import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize GenAI only if key exists (handled in components usually, but good practice)
const ai = new GoogleGenAI({ apiKey });

export const generateSummary = async (text: string): Promise<string> => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Please provide a concise, structured summary of the following educational text. 
      Focus on key concepts, definitions, and main takeaways. 
      Format with clear headings and bullet points using Markdown.
      
      Text to summarize:
      ${text}`,
      config: {
        systemInstruction: "You are an expert academic tutor helper.",
        temperature: 0.3,
      }
    });

    return response.text || "Failed to generate summary.";
  } catch (error) {
    console.error("Gemini Summary Error:", error);
    throw error;
  }
};

export const searchEducationalResources = async (query: string) => {
  if (!apiKey) throw new Error("API Key missing");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 5 high-quality, free educational resources (videos, articles, open source textbooks, or courses) for learning about: "${query}". 
      Return the data in a strict JSON structure.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              url: { type: Type.STRING, description: "A valid URL if known, or a search query URL" },
              type: { type: Type.STRING, enum: ["video", "article", "book", "course"] },
              rating: { type: Type.NUMBER, description: "A simulated initial rating between 3.5 and 5.0" },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "type", "rating", "tags"]
          }
        }
      }
    });

    const jsonStr = response.text;
    return jsonStr ? JSON.parse(jsonStr) : [];
  } catch (error) {
    console.error("Gemini Search Error:", error);
    throw error;
  }
};