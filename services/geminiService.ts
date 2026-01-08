
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Removed global initialization and top-level getApiKey helper to comply with Gemini SDK security guidelines.
// Each request now initializes its own client right before the API call using process.env.API_KEY directly.

export const generateAssistantResponse = async (
  prompt: string, 
  context: string,
  history: {role: string, parts: {text: string}[]}[],
  attachment?: { mimeType: string; data: string }
): Promise<string> => {
  // Fix: Obtained API key directly from process.env and initialized right before usage.
  if (!process.env.API_KEY) return "এপিআই কী (API Key) পাওয়া যায়নি। দয়া করে এডমিনকে জানান।";
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const systemInstruction = `You are 'Mithu', an elite AI persona for 'Digital Desh BD'. 
    Respond helpfuly and concisely. ALWAYS use Markdown. Use Bangla/English as per user.
    Context: ${context}.`;

    const modelName = 'gemini-3-flash-preview';
    
    let contents = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts
    }));

    if (contents.length > 0 && contents[0].role === 'model') {
      contents.shift();
    }

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
        temperature: 0.4,
      },
    });

    // Fix: Access response.text property directly as per latest SDK guidelines.
    return response.text || "দুঃখিত, আমি উত্তর তৈরি করতে পারছি না।";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে আপনার ইন্টারনেট চেক করুন।";
  }
};

export const analyzePlantDisease = async (
  base64Data: string,
  mimeType: string,
  isBangla: boolean
): Promise<{ disease: string; severity: string; solution: string; isPlant: boolean }> => {
  // Fix: Obtained API key directly from process.env and initialized right before usage.
  if (!process.env.API_KEY) throw new Error("API Key Missing");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const promptText = isBangla 
      ? "এই কৃষি ছবিটি (ফসল, পাতা, গবাদি পশু যেমন গরু/ছাগল, হাঁস-মুরগি বা মাছ) বিশ্লেষণ করুন। যদি এটি কোন রোগ হয় তবে তার নাম, ভয়াবহতা এবং প্রতিকার প্রদান করুন।" 
      : "Analyze this agricultural image (crop, leaf, livestock like cow/goat, poultry, or fish). Identify any disease, its severity, and provide a detailed solution.";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: promptText },
          { inlineData: { data: base64Data, mimeType: mimeType } }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING, description: "Name of the disease or issue" },
            severity: { type: Type.STRING, description: "How serious the condition is" },
            solution: { type: Type.STRING, description: "Step by step treatment or solution" },
            isPlant: { type: Type.BOOLEAN, description: "True if it's a plant/crop, False if it's animal/fish/bird" }
          },
          required: ["disease", "severity", "solution", "isPlant"]
        }
      }
    });

    // Fix: Access response.text property directly as per latest SDK guidelines.
    const text = response.text || "";
    return JSON.parse(text);
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};
