import { AgentConfig, ModelId } from './types';

export const DEFAULT_CONFIG: AgentConfig = {
  model: ModelId.GEMINI_2_5_FLASH,
  systemInstruction: "You are OmniAgent, a helpful, witty, and precise AI assistant.",
  useGrounding: false,
  thinkingBudget: 0,
};

export const SAMPLE_PROMPTS = [
  "Explain quantum entanglement like I'm 5",
  "Write a Python script to visualize stock data",
  "Who won the 2024 F1 Championship?",
  "Analyze this image for me",
];

// Audio constants
export const AUDIO_SAMPLE_RATE_INPUT = 16000;
export const AUDIO_SAMPLE_RATE_OUTPUT = 24000;
