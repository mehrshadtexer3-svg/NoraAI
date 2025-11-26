export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  images?: string[]; // base64 strings
  isThinking?: boolean;
  groundingMetadata?: GroundingMetadata;
}

export interface GroundingMetadata {
  webSources?: { uri: string; title: string }[];
}

export enum ModelId {
  GEMINI_2_5_FLASH = 'gemini-2.5-flash',
  GEMINI_3_PRO = 'gemini-3-pro-preview',
  GEMINI_LIVE = 'gemini-2.5-flash-native-audio-preview-09-2025'
}

export interface AgentConfig {
  model: ModelId;
  systemInstruction: string;
  useGrounding: boolean; // Google Search
  thinkingBudget: number; // 0 to disable
}

export type LiveConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
