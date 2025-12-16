import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize client securely using process.env.API_KEY directly.
// We use a fallback to prevent "Uncaught Error" during module initialization if the key is missing.
// This ensures the app loads even if the AI feature isn't configured yet.
const apiKey = process.env.API_KEY || 'MISSING_API_KEY';
const ai = new GoogleGenAI({ apiKey });

export const generateAssistantResponse = async (
  prompt: string, 
  context: string,
  history: {role: string, parts: {text: string}[]}[],
  attachment?: { mimeType: string; data: string }
): Promise<string> => {
  if (apiKey === 'MISSING_API_KEY' || !apiKey) {
    console.error("Gemini API Key is missing. Please check your .env file or Vercel environment variables.");
    return "I am unable to connect to my brain right now because the API Key is missing. Please contact the administrator.";
  }

  try {
    // Enhanced System Instruction
    const systemInstruction = `You are 'Dream Assistant', an advanced and empathetic AI companion for the 'Dream BD' digital platform in Bangladesh. 
    
    Mission: To empower citizens, farmers, students, and professionals with accurate, actionable, and culturally relevant information.

    Current User Context: ${context}.

    Core Guidelines:
    1. **Language & Tone**: Adapt strictly to the user's language (Bangla or English). Be polite, professional, yet warm.
    2. **Expertise**: 
       - If asked about Agriculture: Act as an expert agronomist (crops, weather, seasons in BD).
       - If asked about Health: Provide general wellness info (no prescriptions), suggest seeing a doctor.
       - If asked about Education/Crafts/Transport: Provide localized, specific data.
    3. **Formatting**: Use bullet points, bold text for key terms, and short paragraphs for readability.
    4. **Safety**: Do not generate harmful, political, or sensitive content.
    5. **Multimodal**: If an image/audio is provided, analyze it deeply before answering.
    
    Structure your response to be direct and helpful. Avoid generic fluff.`;

    const model = 'gemini-2.5-flash';
    
    // Construct the chat history for context
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7, // Balanced creativity and accuracy
        topK: 40,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 0 } // Optimization for latency: Disable thinking
      },
      history: history
    });

    const parts: any[] = [{ text: prompt }];
    if (attachment) {
      parts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data
        }
      });
    }

    const result: GenerateContentResponse = await chat.sendMessage({
      message: parts.length === 1 ? prompt : parts
    });

    return result.text || "Sorry, I could not generate a response at this time.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I am having trouble connecting to the network. Please check your connection and try again.";
  }
};