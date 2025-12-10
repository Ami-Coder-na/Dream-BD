import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize client securely
const ai = new GoogleGenAI({ apiKey });

export const generateAssistantResponse = async (
  prompt: string, 
  context: string,
  history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment.";
  }

  try {
    const systemInstruction = `You are 'Dream Assistant', a helpful AI for the 'Dream BD' platform in Bangladesh. 
    Current Context: ${context}.
    
    Guidelines:
    1. Be helpful, polite, and culturally aware of Bangladesh.
    2. If the user asks in Bangla, reply in Bangla. If English, reply in English.
    3. Keep answers concise and relevant to the selected module (e.g., Agriculture, Health).
    4. Do not give medical prescriptions, only general health advice.
    `;

    const model = 'gemini-2.5-flash';
    
    // Construct the chat history for context
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: history
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: prompt
    });

    return result.text || "Sorry, I could not generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am currently experiencing issues connecting to the service. Please try again later.";
  }
};
