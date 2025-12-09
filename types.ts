export enum SignalType {
  LONG = 'LONG',
  SHORT = 'SHORT',
  NEUTRAL = 'NEUTRAL'
}

export interface PivotLevel {
  name: string;
  price: number;
  type: 'RESISTANCE' | 'SUPPORT' | 'PIVOT';
}

export interface TrendState {
  timeframe: string;
  trend: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  strength: number; // 0-100
  ema200: number;
  price: number;
}

export interface TradeSignal {
  signal: SignalType;
  symbol: string;
  timeframe: string;
  
  // Price Levels
  entryPrice: string;
  entryPriceNumeric: number;
  stopLoss: number;
  takeProfit: number[];
  
  // Risk Management
  positionSize: string;
  expectedRR: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  
  // Analysis Metrics
  confidenceScore: number; // 0-100
  probability: number; // 0.0 - 1.0
  marketSentiment: 'EXTREME FEAR' | 'FEAR' | 'NEUTRAL' | 'GREED' | 'EXTREME GREED';
  
  // Multi-Timeframe Data
  trendAlignment: TrendState[];
  
  // Institutional Levels
  liquidityZones: PivotLevel[];
  
  // Explanations
  keyIndicators: { name: string; value: string; signal: 'BULLISH' | 'BEARISH' | 'NEUTRAL' }[];
  rationale: string[];
  contrarianRisks: string[];
  marketConditions: string;
  humanSummary: string;
  
  sources?: { title: string; uri: string }[];
}

export interface AnalysisRequest {
  symbol: string;
  timeframe: string;
  balance?: string;
}
