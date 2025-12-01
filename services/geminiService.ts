import { PatternData, QuizQuestion } from "../types";

// --- EAGLE NOVA: THE CENTRAL BRAIN ---

// 1. PATTERN DATABASE (Visual Data & Metadata)
// Note: Actual visual rendering logic is in PatternViewer.tsx (SVG Engine)
const PATTERN_DB: Record<string, PatternData> = {
  "Head and Shoulders": {
    name: "Head and Shoulders",
    description: "A bearish reversal pattern that signals the exhaustion of a trend. The market makes a high (Left Shoulder), a higher high (Head), and a lower high (Right Shoulder). The breakdown occurs when the 'Neckline' support is breached.",
    significance: "Bearish",
    chartData: [],
    strategyTips: [
      "WAIT for the candle close below the neckline. Do not guess.",
      "The Stop Loss goes strictly above the Right Shoulder.",
      "This pattern often retests the broken neckline (turning support into resistance). That is the safest entry."
    ]
  },
  "Inverse Head and Shoulders": {
    name: "Inverse Head and Shoulders",
    description: "The bullish cousin of the H&S. Found at the bottom of downtrends. It shows sellers pushing price down three times, but failing to make a lower low on the final attempt (Right Shoulder), shifting momentum to buyers.",
    significance: "Bullish",
    chartData: [],
    strategyTips: [
      "Aggressive Entry: As price breaks the neckline.",
      "Conservative Entry: Wait for the retest of the neckline.",
      "Target: Measured move of the Head's height projected upwards."
    ]
  },
  "Double Top": {
    name: "Double Top",
    description: "A classic 'M' shape reversal. Price hits a resistance level twice and fails to break it. This creates a zone of supply where institutions are selling heavily.",
    significance: "Bearish",
    chartData: [],
    strategyTips: [
      "The second top often has lower volume (divergence).",
      "Entry is ONLY valid when the support valley (neckline) is broken.",
      "Stop loss goes above the highest wick of the formation."
    ]
  },
  "Double Bottom": {
    name: "Double Bottom",
    description: "A 'W' shape bullish reversal. Price finds a floor, bounces, tests the floor again, and buyers step in aggressively. It indicates a transfer of stock from weak hands to strong hands.",
    significance: "Bullish",
    chartData: [],
    strategyTips: [
      "Look for a long wick on the second bottom (Liquidity Grab).",
      "Entry on the break of the neckline (middle peak).",
      "Target is the height of the pattern added to the breakout point."
    ]
  },
  "Bull Flag": {
    name: "Bull Flag",
    description: "A continuation pattern. After a strong vertical move (The Pole), price consolidates in a gentle downward channel (The Flag). This is merely profit taking before the trend resumes.",
    significance: "Bullish",
    chartData: [],
    strategyTips: [
      "The Flag should not retrace more than 50% of the Pole.",
      "Entry on the breakout of the upper channel line.",
      "Stop loss goes below the lowest point of the flag."
    ]
  },
  "Bear Flag": {
    name: "Bear Flag",
    description: "A bearish continuation. Price drops sharply, then drifts upwards in a tight channel with low volume. Sellers are resting before the next leg down.",
    significance: "Bearish",
    chartData: [],
    strategyTips: [
      "Entry when the lower trendline of the flag breaks.",
      "Often occurs after a news event causes a sharp drop.",
      "Target is the length of the flagpole projected down."
    ]
  }
};

// 2. STRATEGY MASTERCLASS (Deep Content)
const STRATEGY_DATA: Record<string, string> = {
  "Scalping": `
### ⚡ Scalping: The 1-Minute Sniper

**Concept**
Scalping is the art of stealing small profits from the market repeatedly. A scalper acts like a market maker, providing liquidity and capturing spread inefficiencies. You are not an investor; you are a technician of the immediate moment.

**The "EMA Crossover" Strategy**
*   **Setup**: 1-Minute Chart (M1).
*   **Indicators**: 9 EMA (Blue) and 21 EMA (Red).
*   **The Rules**:
    1.  **Long**: Wait for the 9 EMA to cross *above* the 21 EMA.
    2.  **Trigger**: Enter on the pullback to the 9 EMA.
    3.  **Filter**: The angle of the EMAs must be steep. If they are flat, do not trade.
    4.  **Exit**: Take profit at 5-10 pips fixed, or if a candle closes below the 21 EMA.

**Pro Tip:**
> "Scalping is 10% strategy and 90% execution speed. If you hesitate for 2 seconds, the trade is dead. Use one-click trading."

**Risk Protocol**
*   Max 3 losses per session. Then you quit.
*   Never trade during major news (Red Folder events). Slippage will destroy you.
  `,

  "Swing Trading": `
### 🌊 Swing Trading: Riding the Waves

**Concept**
Swing trading attempts to capture a single move or "swing" in the market, usually lasting 2 to 6 days. This is the "sweet spot" for most traders as it filters out intraday noise but doesn't require holding through major monthly corrections.

**The "Fibonacci Golden Zone" Strategy**
*   **Setup**: 4-Hour Chart (H4).
*   **Tool**: Fibonacci Retracement.
*   **The Rules**:
    1.  Identify a strong impulse move (a big rally or drop).
    2.  Draw Fibs from the Low to the High of that move.
    3.  **The Zone**: Wait for price to pull back to the **0.50** or **0.618** level.
    4.  **Trigger**: Look for a reversal candlestick (Hammer, Engulfing) exactly at that level.
    5.  **Entry**: Buy the break of the reversal candle's high.

**Pro Tip:**
> "The 0.618 level is where algorithms and banks reload their positions. If price reacts there, you are trading with the Smart Money."

**Risk Protocol**
*   Stop Loss must go below the 0.786 Fib level.
*   First Take Profit is the -0.27 extension level.
  `,

  "Day Trading": `
### ☀️ Day Trading: The Daily Grind

**Concept**
Day traders open and close positions within the same trading session. The goal is to capture the daily expansion range.

**The "London/NY Overlap" Strategy**
*   **Time**: 8:00 AM EST to 11:00 AM EST.
*   **Concept**: This 3-hour window has the highest volume in the world.
*   **The Rules**:
    1.  Mark the High and Low of the "London Session" (3 AM - 8 AM EST).
    2.  **The Judas Swing**: Often, NY open will fake a breakout in one direction.
    3.  **Reversal**: If price breaks the London High, traps buyers, and falls back inside, SHORT it.
    4.  **Target**: The London Low.

**Pro Tip:**
> "Amateurs chase the breakout. Professionals fade the breakout. Wait for the failure of a move to enter the real move."

**Risk Protocol**
*   Risk 0.5% to 1% per trade.
*   Stop trading after 2 consecutive wins. Greed will make you give it back.
  `,

  "Price Action": `
### 🕯️ Pure Price Action: Reading the Language

**Concept**
Price action is the study of price movement over time. It ignores all lagging indicators. It relies on Support, Resistance, Supply, Demand, and Market Structure.

**The "Break and Retest" Strategy**
*   **The most reliable setup in history.**
*   **The Logic**: Resistance, once broken, becomes Support.
*   **The Rules**:
    1.  Identify a clear horizontal level that price has touched 3+ times.
    2.  Wait for a **strong** candle to close past this level.
    3.  **DO NOT CHASE**.
    4.  Place a Limit Order at the level you just broke.
    5.  **Entry**: When price returns to "kiss" the level goodbye.

**Pro Tip:**
> "The 'Retest' is the market checking if there are any sellers left. When the retest holds, the path of least resistance is confirmed."

**Risk Protocol**
*   Stop Loss goes below the breakout candle.
*   If price falls back into the range (Fakeout), exit immediately.
  `,

  "Institutional": `
### 🏦 Institutional Concepts (SMC)

**Concept**
Retail traders trade patterns. Banks trade liquidity. Institutional trading involves identifying where the "Smart Money" has placed their orders and riding their coattails.

**The "Liquidity Sweep" Model**
*   **The Truth**: Banks need your Stop Loss to fill their Buy Orders.
*   **The Rules**:
    1.  Spot "Equal Lows" (Double Bottom). Retail traders put stops below these.
    2.  Wait for a sudden spike DOWN through these lows.
    3.  This is the **Sweep**.
    4.  **Displacement**: Look for an immediate, violent reversal UP.
    5.  **Entry**: Enter on the "Fair Value Gap" (FVG) created by the violent move up.

**Pro Tip:**
> "If you cannot see the liquidity, YOU are the liquidity. Always ask: 'Where are the retail stop losses?'"

**Risk Protocol**
*   Strict Stops. This is high precision.
*   Risk/Reward ratios here are often 1:5 or 1:10.
  `
};

// 3. THE "NOVA BRAIN" - MENTOR KNOWLEDGE BASE
// This replaces the simple keyword list with a structured Q&A brain.
interface BrainNode {
  keywords: string[];
  response: string;
  weight: number;
}

const MENTOR_KNOWLEDGE_BASE: BrainNode[] = [
  // --- GREETINGS ---
  {
    keywords: ["hello", "hi", "hey", "start", "morning"],
    weight: 1,
    response: "Systems Online. I am **Nova**, your Lead Trading Mentor.\n\nI am here to analyze patterns, refine your strategy, and check your psychology.\n\n**Command me:**\n*   'Explain the Head and Shoulders'\n*   'How do I manage risk?'\n*   'What is a liquidity sweep?'"
  },
  // --- PSYCHOLOGY (CRITICAL) ---
  {
    keywords: ["fear", "scared", "afraid", "losing", "loss", "red"],
    weight: 5,
    response: "**Psychology Alert:** Fear is a reaction to the unknown.\n\nIf you are afraid to pull the trigger, it means one of two things:\n1.  You are risking too much money.\n2.  You do not trust your edge.\n\n**The Fix:** Lower your position size to a point where you *do not care* if you lose. That is the 'Sleeping Point'. Only then can you trade objectively."
  },
  {
    keywords: ["greedy", "greed", "profit", "rich", "money", "target"],
    weight: 4,
    response: "**Greed kills more traders than bad analysis.**\n\nWhen you are up, your brain releases dopamine and you want *more*. You move your Take Profit further away. You ignore sell signals.\n\n**Rule:** Set your Take Profit BEFORE you enter the trade. When price hits it, you exit. No exceptions. Leave the last 10% of the move for the gamblers."
  },
  {
    keywords: ["revenge", "angry", "mad", "market rigged"],
    weight: 5,
    response: "**STOP TRADING IMMEDIATELY.**\n\nYou are in 'Tilt'. You are trying to hurt the market, but the market does not know you exist. It will only take the rest of your money.\n\n**Protocol:** Close your charts. Walk away. Do not trade for 24 hours. Preserving your capital is more important than making it back today."
  },
  // --- RISK MANAGEMENT ---
  {
    keywords: ["risk", "size", "lot", "leverage", "manage"],
    weight: 10, // High priority
    response: "**Risk Management is the only thing you control.**\n\nHere is the Professional Standard:\n\n1.  **Risk per Trade:** Never more than 1-2% of equity.\n2.  **Reward:** Never take a trade with less than 1:2 R/R.\n3.  **The Math:** If you risk $100 to make $200, you can lose 60% of your trades and still be profitable.\n\n*Without this, you are just a gambler with a chart.*"
  },
  {
    keywords: ["stop", "sl", "stoploss", "protect"],
    weight: 5,
    response: "**The Stop Loss is your seatbelt.**\n\nNever enter a trade without it. \n\n**Where to place it?**\n*   **Short:** Above the most recent Lower High.\n*   **Long:** Below the most recent Higher Low.\n\nDo not place it based on a dollar amount (e.g., 'I only want to lose $50'). Place it where the trade setup is *invalidated*."
  },
  // --- STRATEGY SPECIFICS ---
  {
    keywords: ["trend", "direction", "bias"],
    weight: 3,
    response: "**Trend is your friend until it bends.**\n\n*   **Uptrend:** Higher Highs (HH) + Higher Lows (HL).\n*   **Downtrend:** Lower Highs (LH) + Lower Lows (LL).\n\n**The Golden Rule:** Never short a Higher Low, and never buy a Lower High. Wait for the market structure to break before betting against the trend."
  },
  {
    keywords: ["timeframe", "chart", "daily", "hour"],
    weight: 3,
    response: "**Top-Down Analysis is key.**\n\n1.  **Daily/Weekly:** Identifies the Direction (The Tide).\n2.  **4-Hour:** Identifies the Zones (The Waves).\n3.  **15-Minute:** Identifies the Entry (The Ripple).\n\nDo not try to catch a 5-minute reversal if the Daily chart is crashing down."
  },
  {
    keywords: ["fake", "fakeout", "trap", "manipulation"],
    weight: 4,
    response: "**The Fakeout (Liquidity Grab)**\n\nInstitutions know where retail traders put their stops (right above resistance or below support).\n\nThey will push price *just* past that level to trigger the stops (generating liquidity), then reverse hard.\n\n**Defense:** Wait for the candle to CLOSE. If it wicks past the level but closes inside, it's a trap."
  },
  // --- PATTERN HELP ---
  {
    keywords: ["head", "shoulder", "hs"],
    weight: 4,
    response: "The **Head and Shoulders** is a reliable reversal pattern.\n\n*   **Left Shoulder**: Bulls are strong.\n*   **Head**: Bulls make a new high, but momentum slows.\n*   **Right Shoulder**: Bulls fail to make a new high. Weakness confirmed.\n*   **Entry**: SELL when the Neckline breaks."
  },
  {
    keywords: ["flag", "pennant"],
    weight: 4,
    response: "**Flags are profit-taking pauses.**\n\nThink of a Bull Flag as a runner catching their breath. \n\n*   **Look for**: A sharp pole (sprint), followed by a slow, low-volume drift down (breath).\n*   **Action**: Buy the breakout of the top trendline. The trend is resuming."
  }
];

// --- EXPORTED FUNCTIONS ---

export const getPatternDetails = async (patternName: string): Promise<PatternData> => {
  // Simulate database latency
  await new Promise(resolve => setTimeout(resolve, 200));
  return PATTERN_DB[patternName] || {
    name: patternName,
    description: "Pattern data unavailable in local database.",
    significance: "Neutral",
    chartData: [],
    strategyTips: []
  };
};

export const getStrategyContent = async (strategyName: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return STRATEGY_DATA[strategyName] || "Content unavailable.";
};

export const generateTradingQuiz = async (topic: string, difficulty: 'Beginner' | 'Pro'): Promise<QuizQuestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  // In a full implementation, this would filter a massive question bank.
  // For this offline version, we return a mixed set.
  return [
    {
      id: 1,
      question: "Which candlestick pattern indicates strong rejection of lower prices?",
      options: ["Marubozu", "Dragonfly Doji / Hammer", "Shooting Star", "Bearish Engulfing"],
      correctAnswerIndex: 1,
      explanation: "A long lower wick (Hammer) shows sellers pushed price down, but buyers overwhelmed them and closed near the high."
    },
    {
      id: 2,
      question: "What defines a 'Bearish Trend'?",
      options: ["Red candles", "Lower Highs and Lower Lows", "Price below VWAP", "RSI under 30"],
      correctAnswerIndex: 1,
      explanation: "Market structure (LH + LL) is the only true definition of a downtrend."
    },
    {
      id: 3,
      question: "Where should you typically place a Stop Loss on a Short position?",
      options: ["Exactly at entry", "Below the low", "Above the recent Swing High", "10 pips away"],
      correctAnswerIndex: 2,
      explanation: "The Stop Loss should be where the trade idea is invalidated. If price breaks the recent Swing High, the trend has changed."
    },
    {
      id: 4,
      question: "What is a 'Liquidity Sweep'?",
      options: ["A cleaning service", "Price taking out a high/low to hit stops before reversing", "Low volume trading", "A market crash"],
      correctAnswerIndex: 1,
      explanation: "Institutions push price into areas of resting orders (stops) to fill their large positions before moving the market."
    },
    {
      id: 5,
      question: "If your account is $10,000 and you risk 1%, what is your max dollar loss?",
      options: ["$10", "$50", "$100", "$1000"],
      correctAnswerIndex: 2,
      explanation: "1% of 10,000 is 100. This is the golden rule of longevity."
    }
  ];
};

// IMPROVED MENTOR LOGIC
export const chatWithTutor = async (history: {role: 'user'|'model', content: string}[], message: string) => {
  await new Promise(resolve => setTimeout(resolve, 600)); // Thinking delay
  
  const lowerMsg = message.toLowerCase();
  
  // 1. Exact Pattern Match Check
  for (const key in PATTERN_DB) {
    if (lowerMsg.includes(key.toLowerCase())) {
       const p = PATTERN_DB[key];
       return `### ${p.name}\n\n${p.description}\n\n**Strategy Tip:** ${p.strategyTips[0]}`;
    }
  }

  // 2. Weighted Keyword Scoring Algorithm
  let bestMatch: BrainNode | null = null;
  let highestScore = 0;

  for (const node of MENTOR_KNOWLEDGE_BASE) {
    let score = 0;
    let matchedKeywords = 0;

    node.keywords.forEach(k => {
      if (lowerMsg.includes(k)) {
        score += node.weight;
        matchedKeywords++;
      }
    });

    // Bonus for multiple keyword matches (specificity)
    if (matchedKeywords > 1) score += 2;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = node;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  // Fallback
  return "**I am analyzing your request...**\n\nThat is a complex query. Could you specify if you are asking about **Technical Analysis**, **Psychology**, or **Risk Management**? \n\nTry asking: *'What is a fakeout?'* or *'I keep losing trades.'*";
};
