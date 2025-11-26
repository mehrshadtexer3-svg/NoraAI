import { GoogleGenAI, GenerateContentResponse, Chat } from '@google/genai';
import { AgentConfig } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const createChatSession = (config: AgentConfig) => {
  const tools: any[] = [];
  if (config.useGrounding) {
    tools.push({ googleSearch: {} });
  }

  const modelConfig: any = {
    systemInstruction: config.systemInstruction,
    tools: tools.length > 0 ? tools : undefined,
  };
  
  // Apply thinking budget if > 0 and model supports it (Gemini 2.5 Flash / Pro)
  if (config.thinkingBudget > 0) {
      modelConfig.thinkingConfig = { thinkingBudget: config.thinkingBudget };
  }

  return ai.chats.create({
    model: config.model,
    config: modelConfig,
  });
};

export const sendMessageStream = async (
  chat: Chat,
  message: string,
  images: string[] = [] // base64 strings
): Promise<AsyncIterable<GenerateContentResponse>> => {
  
  // Construct content. If images exist, we can't use the simple string overload
  // However, chat.sendMessageStream only accepts `message` as string or Part[].
  // We need to construct the Parts.
  
  let msgContent: any = message;

  if (images.length > 0) {
    const parts: any[] = [];
    // Add images first
    images.forEach(img => {
       // Strip prefix if present (data:image/png;base64,)
       const data = img.split(',')[1] || img;
       parts.push({
         inlineData: {
           mimeType: 'image/png', // Assuming PNG for simplicity, or detect from string
           data: data
         }
       });
    });
    // Add text last
    parts.push({ text: message });
    msgContent = parts;
  }

  return chat.sendMessageStream({ message: msgContent });
};

// Helper to extract grounding metadata
export const extractGrounding = (response: GenerateContentResponse) => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (!chunks) return undefined;
  
  const webSources = chunks
    .filter((c: any) => c.web)
    .map((c: any) => ({ uri: c.web.uri, title: c.web.title }));
    
  return webSources.length > 0 ? { webSources } : undefined;
};
