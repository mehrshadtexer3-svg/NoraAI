export interface ChartPoint {
  time: string | number;
  value: number;
}

export interface PatternData {
  name: string;
  description: string;
  significance: 'Bullish' | 'Bearish' | 'Neutral';
  chartData: ChartPoint[];
  strategyTips: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export enum AppMode {
  DASHBOARD = 'DASHBOARD',
  PATTERNS = 'PATTERNS',
  STRATEGIES = 'STRATEGIES',
  QUIZ = 'QUIZ',
  TUTOR = 'TUTOR'
}
