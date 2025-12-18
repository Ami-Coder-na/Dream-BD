
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Secure initialization check
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    return '';
  }
};

// Initialize client securely using obtained key exclusively from process.env.API_KEY as per guidelines.
// Assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: getApiKey() });

export const generateAssistantResponse = async (
  prompt: string, 
  context: string,
  history: {role: string, parts: {text: string}[]}[],
  attachment?: { mimeType: string; data: string }
): Promise<string> => {
  try {
    const key = getApiKey();
    if (!key) throw new Error("API Key missing");

    const systemInstruction = `You are 'Dream Assistant', an advanced AI for 'Dream BD'. 
    Mission: To empower citizens of Bangladesh with accurate information.
    Current User Context: ${context}.
    Language: Support both Bangla and English based on user preference.`;

    const modelName = 'gemini-3-flash-preview';
    
    // Create chat with system instruction in config as per guidelines
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history
    });

    // Prepare message which can be a string or Content object with parts
    let message: any = prompt;
    if (attachment) {
      message = {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: attachment.mimeType, data: attachment.data } }
        ]
      };
    }

    // Call sendMessage with the message parameter
    const response: GenerateContentResponse = await chat.sendMessage({
      message: message
    });

    // Access .text property directly (not a method) as per guidelines
    return response.text || "Sorry, I could not generate a response.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "I am having trouble connecting. Please check your connection.";
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
    const key = getApiKey();
    if (!key) throw new Error("API Key missing");

    const modelName = 'gemini-3-flash-preview';
    
    const systemInstruction = `You are an expert Plant Pathologist for Bangladesh Agriculture.
    STRICT RULES:
    1. Check the image. If it is NOT a plant, leaf, crop, or agricultural related item, respond ONLY with "NOT_AGRICULTURAL".
    2. If the image is inappropriate, harmful, or 18+, respond ONLY with "NOT_AGRICULTURAL".
    3. If it IS a plant/crop:
       - Identify the disease or state if it is healthy.
       - Provide the result in the following JSON format:
         {
           "disease": "Name of disease",
           "severity": "High/Medium/Low",
           "solution": "Clear steps to fix it",
           "isPlant": true
         }
    4. Language: If 'isBangla' is true, provide text in Bangla. Otherwise, English.`;

    const prompt = isBangla 
      ? "এই ছবিটি বিশ্লেষণ করুন এবং রোগ শনাক্ত করুন। যদি এটি গাছ বা ফসলের ছবি না হয় তবে 'NOT_AGRICULTURAL' বলুন।" 
      : "Analyze this image. Identify the plant disease. If it's not a plant/crop, say 'NOT_AGRICULTURAL'.";

    // Use models.generateContent with responseSchema for structured JSON output
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
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING, description: "Name of the plant disease or 'Healthy'" },
            severity: { type: Type.STRING, description: "Risk level: High, Medium, or Low" },
            solution: { type: Type.STRING, description: "Recommended treatment steps" },
            isPlant: { type: Type.BOOLEAN, description: "Whether the image contains a plant" }
          },
          required: ["disease", "severity", "solution", "isPlant"]
        }
      }
    });

    // Access .text property directly
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
