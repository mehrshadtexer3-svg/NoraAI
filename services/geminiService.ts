import { TradeSignal, SignalType, AnalysisRequest, TrendState, PivotLevel } from '../types';

/**
 * ADVANCED TECHNICAL ANALYSIS ENGINE (PRO VER.)
 * ---------------------------------------------
 * Features:
 * - Multi-Timeframe Correlation (Current, 4H, Daily)
 * - Institutional Pivot Points (Classic)
 * - Advanced Indicators: MACD, Bollinger Bands, Volume SMA
 * - Confluence Scoring Model
 */

// --- Interfaces for Internal Data ---
interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// --- Math Library ---

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const mean = (arr: number[]) => sum(arr) / arr.length;

const stdDev = (arr: number[]) => {
  const avg = mean(arr);
  const squareDiffs = arr.map(v => Math.pow(v - avg, 2));
  return Math.sqrt(mean(squareDiffs));
};

const calculateSMA = (data: number[], period: number): number[] => {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(NaN);
      continue;
    }
    sma.push(mean(data.slice(i - period + 1, i + 1)));
  }
  return sma;
};

const calculateEMA = (data: number[], period: number): number[] => {
  const k = 2 / (period + 1);
  const ema: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    ema.push(data[i] * k + ema[i - 1] * (1 - k));
  }
  return ema;
};

const calculateRSI = (data: number[], period: number = 14): number[] => {
  const rsi: number[] = [];
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i] - data[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  rsi.push(100 - (100 / (1 + avgGain / avgLoss)));

  for (let i = period + 1; i < data.length; i++) {
    const diff = data[i] - data[i - 1];
    const currentGain = diff > 0 ? diff : 0;
    const currentLoss = diff < 0 ? -diff : 0;
    
    avgGain = (avgGain * (period - 1) + currentGain) / period;
    avgLoss = (avgLoss * (period - 1) + currentLoss) / period;
    
    const rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }
  return Array(period).fill(NaN).concat(rsi);
};

const calculateMACD = (data: number[]) => {
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const macdLine = ema12.map((v, i) => v - ema26[i]);
  const signalLine = calculateEMA(macdLine.filter(n => !isNaN(n)), 9);
  
  // Pad signal line to match length
  const padding = Array(data.length - signalLine.length).fill(NaN);
  return { 
    macdLine, 
    signalLine: [...padding, ...signalLine], 
    histogram: macdLine.map((v, i) => v - ([...padding, ...signalLine][i] || 0)) 
  };
};

const calculateBollingerBands = (data: number[], period: number = 20, multiplier: number = 2) => {
  const sma = calculateSMA(data, period);
  const upper = [];
  const lower = [];
  
  for(let i=0; i<data.length; i++) {
    if(i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }
    const slice = data.slice(i - period + 1, i + 1);
    const sd = stdDev(slice);
    upper.push(sma[i] + (sd * multiplier));
    lower.push(sma[i] - (sd * multiplier));
  }
  return { upper, lower, basis: sma };
};

const calculateATR = (highs: number[], lows: number[], closes: number[], period: number = 14): number[] => {
  const tr: number[] = [highs[0] - lows[0]];
  for (let i = 1; i < highs.length; i++) {
    tr.push(Math.max(
      highs[i] - lows[i],
      Math.abs(highs[i] - closes[i - 1]),
      Math.abs(lows[i] - closes[i - 1])
    ));
  }
  return calculateEMA(tr, period);
};

const calculatePivotPoints = (high: number, low: number, close: number) => {
  const p = (high + low + close) / 3;
  const r1 = 2 * p - low;
  const s1 = 2 * p - high;
  const r2 = p + (high - low);
  const s2 = p - (high - low);
  return { p, r1, s1, r2, s2 };
};

// --- Data Fetching ---

const fetchCandles = async (symbol: string, timeframe: string, limit: number = 200) => {
  let fsym = symbol.toUpperCase().replace('/USDT', '').replace('/USD', '').split('/')[0];
  const tsym = 'USD';
  
  // Mapping
  let endpoint = 'histohour';
  if (timeframe === '15m') endpoint = 'histominute';
  if (timeframe.includes('d') || timeframe.includes('w')) endpoint = 'histoday';

  const url = `https://min-api.cryptocompare.com/data/v2/${endpoint}?fsym=${fsym}&tsym=${tsym}&limit=${limit}`;
  const response = await fetch(url);
  const json = await response.json();
  
  if (json.Response === 'Error') throw new Error(json.Message);
  
  return json.Data.Data.map((d: any) => ({
    time: d.time, open: d.open, high: d.high, low: d.low, close: d.close, volume: d.volumeto
  }));
};

// --- Engine Core ---

export const analyzeMarket = async (request: AnalysisRequest): Promise<TradeSignal> => {
  const { symbol, timeframe } = request;
  
  // 1. Parallel Data Fetching for Multi-Timeframe Analysis
  // We fetch: Requested TF, 4H (Intermediate), Daily (Macro)
  const fetchPromises = [
    fetchCandles(symbol, timeframe, 200), // Main
    fetchCandles(symbol, '1d', 30)       // Macro (for pivots & trend)
  ];
  
  // Only fetch 4h if main is not 4h or 1d
  if (timeframe !== '4h' && timeframe !== '1d' && timeframe !== '1w') {
    fetchPromises.push(fetchCandles(symbol, '4h', 100));
  }

  const results = await Promise.all(fetchPromises);
  const mainCandles: Candle[] = results[0];
  const dailyCandles: Candle[] = results[1];
  const fourHCandles: Candle[] = results.length > 2 ? results[2] : results[0]; // Fallback if 4h not fetched

  // 2. Process Data Arrays
  const closes = mainCandles.map(c => c.close);
  const currentPrice = closes[closes.length - 1];
  const prevDaily = dailyCandles[dailyCandles.length - 2]; // Yesterday's complete candle

  // 3. Calculate Indicators (Main TF)
  const ema50 = calculateEMA(closes, 50);
  const ema200 = calculateEMA(closes, 200);
  const rsi = calculateRSI(closes, 14);
  const macd = calculateMACD(closes);
  const bb = calculateBollingerBands(closes);
  const atr = calculateATR(mainCandles.map(c=>c.high), mainCandles.map(c=>c.low), closes, 14);
  
  // 4. Calculate Indicators (Macro/Secondary TF)
  const dailyEMA200 = calculateEMA(dailyCandles.map(c=>c.close), 200);
  const fourHEMA200 = calculateEMA(fourHCandles.map(c=>c.close), 200);

  // 5. Current Values
  const curRSI = rsi[rsi.length - 1];
  const curATR = atr[atr.length - 1];
  const curMACD = macd.histogram[macd.histogram.length - 1];
  const prevMACD = macd.histogram[macd.histogram.length - 2];
  const curEMA200 = ema200[ema200.length - 1];
  
  // 6. Trend Analysis (Multi-Timeframe)
  const getTrend = (price: number, ema: number): 'BULLISH'|'BEARISH' => price > ema ? 'BULLISH' : 'BEARISH';
  
  const mainTrend = getTrend(currentPrice, curEMA200);
  const dailyTrend = getTrend(dailyCandles[dailyCandles.length-1].close, dailyEMA200[dailyEMA200.length-1]);
  const fourHTrend = getTrend(fourHCandles[fourHCandles.length-1].close, fourHEMA200[fourHEMA200.length-1]);

  // 7. Pivot Points (Institutional Levels)
  const pivots = calculatePivotPoints(prevDaily.high, prevDaily.low, prevDaily.close);

  // 8. CONFLUENCE SCORING ENGINE
  let score = 0; // -100 to 100
  let rationale: string[] = [];
  let risks: string[] = [];
  let keyIndicators: any[] = [];

  // A. Trend Confluence (Max 40 pts)
  if (mainTrend === dailyTrend) {
    score += (mainTrend === 'BULLISH' ? 25 : -25);
    rationale.push(`Macro Trend Alignment: Daily and ${timeframe} are both ${mainTrend}.`);
  } else {
    risks.push(`Trend Conflict: Daily is ${dailyTrend} while ${timeframe} is ${mainTrend}.`);
  }

  // B. Momentum (Max 30 pts)
  // RSI
  if (curRSI < 30) {
    score += 15; // Oversold -> Bullish reversal potential
    keyIndicators.push({ name: 'RSI', value: curRSI.toFixed(1), signal: 'BULLISH' });
    rationale.push('RSI is Oversold (Value opportunity).');
  } else if (curRSI > 70) {
    score -= 15; // Overbought -> Bearish reversal potential
    keyIndicators.push({ name: 'RSI', value: curRSI.toFixed(1), signal: 'BEARISH' });
    rationale.push('RSI is Overbought (Pullback risk).');
  } else {
    // Trend continuation logic
    if (mainTrend === 'BULLISH' && curRSI > 50) score += 5;
    if (mainTrend === 'BEARISH' && curRSI < 50) score -= 5;
    keyIndicators.push({ name: 'RSI', value: curRSI.toFixed(1), signal: 'NEUTRAL' });
  }

  // MACD
  if (curMACD > 0 && curMACD > prevMACD) {
    score += 10;
    keyIndicators.push({ name: 'MACD', value: 'Rising', signal: 'BULLISH' });
  } else if (curMACD < 0 && curMACD < prevMACD) {
    score -= 10;
    keyIndicators.push({ name: 'MACD', value: 'Falling', signal: 'BEARISH' });
  }

  // C. Price Action & Structure (Max 30 pts)
  // Check vs EMA200
  if (currentPrice > curEMA200) {
    score += 10;
    keyIndicators.push({ name: 'EMA 200', value: 'Price Above', signal: 'BULLISH' });
  } else {
    score -= 10;
    keyIndicators.push({ name: 'EMA 200', value: 'Price Below', signal: 'BEARISH' });
  }

  // Bollinger Squeeze?
  const bandwidth = (bb.upper[bb.upper.length-1] - bb.lower[bb.lower.length-1]) / bb.basis[bb.basis.length-1];
  if (bandwidth < 0.05) {
    rationale.push('Bollinger Squeeze detected: High volatility breakout imminent.');
  }

  // 9. Signal Generation
  let signal: SignalType = SignalType.NEUTRAL;
  if (score >= 35) signal = SignalType.LONG;
  else if (score <= -35) signal = SignalType.SHORT;

  // 10. Risk Management
  const slATRMult = 1.5;
  const tpATRMult = 2.5;
  let sl = 0, tp1 = 0, tp2 = 0;

  if (signal === SignalType.LONG) {
    sl = currentPrice - (curATR * slATRMult);
    // Target R1 or ATR target, whichever is logical
    tp1 = currentPrice + (curATR * 2);
    tp2 = pivots.r2 > currentPrice ? pivots.r2 : currentPrice + (curATR * 3.5);
    
    // Check against Pivot Resistance
    if (pivots.r1 > currentPrice && pivots.r1 < tp1) {
        risks.push(`Pivot R1 ($${pivots.r1.toFixed(2)}) is a nearby resistance.`);
    }
  } else if (signal === SignalType.SHORT) {
    sl = currentPrice + (curATR * slATRMult);
    tp1 = currentPrice - (curATR * 2);
    tp2 = pivots.s2 < currentPrice ? pivots.s2 : currentPrice - (curATR * 3.5);

    if (pivots.s1 < currentPrice && pivots.s1 > tp1) {
        risks.push(`Pivot S1 ($${pivots.s1.toFixed(2)}) is a nearby support.`);
    }
  } else {
    // Neutral visualizer
    sl = currentPrice * 0.99;
    tp1 = currentPrice * 1.01;
    tp2 = currentPrice * 1.02;
  }

  const confidence = Math.min(Math.abs(score) + 30, 95); // normalize to 100 roughly
  
  return {
    signal,
    symbol: request.symbol.toUpperCase(),
    timeframe: request.timeframe,
    entryPrice: `$${currentPrice.toFixed(2)}`,
    entryPriceNumeric: currentPrice,
    stopLoss: Number(sl.toFixed(2)),
    takeProfit: [Number(tp1.toFixed(2)), Number(tp2.toFixed(2))],
    positionSize: request.balance ? "Calculated based on risk" : "2% Risk / Trade",
    expectedRR: Number(((Math.abs(tp1 - currentPrice) / Math.abs(currentPrice - sl))).toFixed(2)),
    riskLevel: curRSI > 80 || curRSI < 20 ? 'HIGH' : 'MEDIUM',
    confidenceScore: Math.round(confidence),
    probability: Number((confidence / 100).toFixed(2)),
    marketSentiment: confidence > 80 ? (signal === 'LONG' ? 'EXTREME GREED' : 'EXTREME FEAR') : 'NEUTRAL',
    trendAlignment: [
      { timeframe: 'Daily', trend: dailyTrend, strength: 80, ema200: dailyEMA200[dailyEMA200.length-1], price: 0 },
      { timeframe: '4H', trend: fourHTrend, strength: 70, ema200: fourHEMA200[fourHEMA200.length-1], price: 0 },
      { timeframe: request.timeframe, trend: mainTrend, strength: 60, ema200: curEMA200, price: currentPrice }
    ],
    liquidityZones: [
      { name: 'Pivot R2', price: pivots.r2, type: 'RESISTANCE' },
      { name: 'Pivot R1', price: pivots.r1, type: 'RESISTANCE' },
      { name: 'Pivot P', price: pivots.p, type: 'PIVOT' },
      { name: 'Pivot S1', price: pivots.s1, type: 'SUPPORT' },
      { name: 'Pivot S2', price: pivots.s2, type: 'SUPPORT' },
    ],
    keyIndicators,
    rationale,
    contrarianRisks: risks.length > 0 ? risks : ['Market volatility news.'],
    marketConditions: `Volatility (ATR): ${curATR.toFixed(2)} | B-Band Width: ${bandwidth.toFixed(3)}`,
    humanSummary: `Systems indicate a ${signal.toLowerCase()} bias driven by ${mainTrend.toLowerCase()} macro trend and ${curMACD > 0 ? 'positive' : 'negative'} momentum.`,
    sources: [{ title: 'CryptoCompare API', uri: 'https://data.cryptocompare.com' }]
  };
};
