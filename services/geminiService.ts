
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
    const systemInstruction = `You are 'Mithu', an advanced AI persona for 'Digital Desh BD'. 
    Mission: To empower the citizens of Bangladesh with accurate, helpful, and culturally relevant information.
    
    IDENTITY & STYLE:
    - Language: Primary support for both Bangla (Bengali) and English. Respond in the language the user uses.
    - Personality: Friendly, respectful, proactive, and knowledgeable. Use an encouraging tone.
    - Formatting: ALWAYS use Markdown to make your responses beautiful and readable. Use **bolding** for emphasis, bullet points for lists, and headers where appropriate.
    - Cultural Context: You understand local traditions, agricultural seasons, and the specific needs of different districts in Bangladesh.
    
    Current User Context: ${context}.`;

    // Using Flash for significantly better reliability and speed in production
    const modelName = 'gemini-3-flash-preview';
    
    // Construct contents from history
    // IMPORTANT: History must start with 'user' role for Gemini API
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

    // Use generateContent for more stateless and robust connection in browser
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        // Disable thinking to prioritize speed and avoid timeouts
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    // Access .text property directly (not a method)
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
    // Using Flash for high-speed analysis
    const modelName = 'gemini-3-flash-preview';
    
    const systemInstruction = `You are an elite Agricultural Scientist and Plant Pathologist specialized in crops of Bangladesh (Rice, Jute, Mango, Tea, Potato, etc.).
    
    STRICT RULES:
    1. IMAGE VALIDATION: Verify the image content. If it is NOT related to agriculture (plants, leaves, crops, pests, soil), respond ONLY with "NOT_AGRICULTURAL".
    2. SAFETY: If the image is inappropriate or harmful, respond ONLY with "NOT_AGRICULTURAL".
    3. DIAGNOSIS: If it IS an agricultural image:
       - Identify the specific disease or pest damage.
       - If the plant is healthy, state "Healthy".
       - Determine risk level (Low, Medium, High).
       - Provide comprehensive, actionable solutions including organic methods and specific chemical names if necessary.
    4. FORMAT: You MUST respond strictly in the requested JSON schema.
    5. LANGUAGE: Provide text in ${isBangla ? 'Bangla' : 'English'}.`;

    const prompt = isBangla 
      ? "এই কৃষি ছবিটি গভীরভাবে বিশ্লেষণ করুন। রোগের নাম, ভয়াবহতা এবং প্রতিকার সম্পর্কে বিস্তারিত তথ্য দিন। যদি এটি গাছ বা ফসলের ছবি না হয় তবে 'NOT_AGRICULTURAL' বলুন।" 
      : "Deeply analyze this agricultural image. Provide the disease name, severity level, and a detailed step-by-step solution. If it's not a plant/crop, say 'NOT_AGRICULTURAL'.";

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
        thinkingConfig: { thinkingBudget: 0 },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING, description: "Specific name of the plant disease, pest, or 'Healthy'" },
            severity: { type: Type.STRING, description: "Risk level: High, Medium, or Low" },
            solution: { type: Type.STRING, description: "Detailed treatment steps, including organic and chemical options" },
            isPlant: { type: Type.BOOLEAN, description: "Whether the image contains agricultural content" }
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
