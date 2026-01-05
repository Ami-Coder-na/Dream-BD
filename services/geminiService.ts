
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Initialize client securely using obtained key exclusively from process.env.API_KEY as per guidelines.
// Assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAssistantResponse = async (
  prompt: string, 
  context: string,
  history: {role: string, parts: {text: string}[]}[],
  attachment?: { mimeType: string; data: string }
): Promise<string> => {
  try {
    const systemInstruction = `You are 'Mithu', an elite AI persona for 'Digital Desh BD'. 
    
    CORE DIRECTIVES:
    1. EXTREME SPEED: Be concise. Avoid long introductions. Get straight to the point.
    2. BEAUTIFUL FORMATTING: ALWAYS use Markdown. Use bullet points (• or *) for almost everything to make it "guchano" (organized).
    3. ENGAGING STYLE: Use friendly, cheerful, and helpful language. Use relevant emojis.
    4. STRUCTURE: 
       - Start with a tiny friendly greeting.
       - Use bullet points for the main information.
       - End with a short encouraging closing.
    5. LANGUAGE: Respond in the user's language (Bangla/English).
    
    Current User Context: ${context}.`;

    // Using gemini-3-flash-preview for maximum speed
    const modelName = 'gemini-3-flash-preview';
    
    // Construct contents from history
    let contents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));

    // Ensure the first message is from 'user'
    if (contents.length > 0 && contents[0].role === 'model') {
      contents.shift();
    }

    // Add current message
    const currentParts: any[] = [{ text: prompt }];
    if (attachment) {
      currentParts.push({ inlineData: attachment });
    }
    contents.push({ role: 'user', parts: currentParts });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Lower temperature for faster, more focused and concise responses
        thinkingConfig: { thinkingBudget: 0 }, // Disable thinking for maximum speed
      },
    });

    return response.text || "দুঃখিত, আমি উত্তর তৈরি করতে পারছি না।";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার ইন্টারনেট চেক করুন।";
  }
};

/**
 * Specialized function for Agricultural Image Analysis
 */
export const analyzePlantDisease = async (
  base64Data: string,
  mimeType: string,
  isBangla: boolean
): Promise<{ disease: string; severity: string; solution: string; isPlant: boolean }> => {
  try {
    const modelName = 'gemini-3-flash-preview';
    
    const systemInstruction = `You are an elite Agricultural Scientist.
    
    STRICT RULES:
    1. IMAGE VALIDATION: If NOT agricultural, respond ONLY with "NOT_AGRICULTURAL".
    2. DIAGNOSIS: Provide specific disease name, risk level, and solution.
    3. STYLE: Use beautiful bullet points for the solution steps. Be concise for speed.
    4. FORMAT: JSON only.
    5. LANGUAGE: Text in ${isBangla ? 'Bangla' : 'English'}.`;

    const prompt = isBangla 
      ? "এই কৃষি ছবিটি বিশ্লেষণ করে সুন্দর বুলেট পয়েন্টে সমাধান দিন।" 
      : "Analyze this image and provide solutions in beautiful bullet points.";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { text: prompt },
          { inlineData: { data: base64Data, mimeType: mimeType } }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.3,
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING },
            severity: { type: Type.STRING },
            solution: { type: Type.STRING, description: "Detailed steps using bullet points" },
            isPlant: { type: Type.BOOLEAN }
          },
          required: ["disease", "severity", "solution", "isPlant"]
        }
      }
    });

    const text = response.text?.trim() || "";
    
    if (text.includes("NOT_AGRICULTURAL")) {
      return { disease: "", severity: "", solution: "", isPlant: false };
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      return { 
        disease: isBangla ? "অজ্ঞাত সমস্যা" : "Unknown Condition", 
        severity: "Unknown", 
        solution: text, 
        isPlant: true 
      };
    }
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};
