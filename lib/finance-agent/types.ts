/**
 * =============================================================================
 * FINANCE-AGENT/TYPES.TS
 * =============================================================================
 * 
 * TypeScript types for the Financial Research Agent.
 */

// =============================================================================
// STOCK DATA TYPES
// =============================================================================

/**
 * Stock quote data from Alpha Vantage
 */
export interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
}

/**
 * Company overview/info from Alpha Vantage
 */
export interface CompanyInfo {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  marketCap: number;
  peRatio: number | null;
  dividendYield: number | null;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  analystTargetPrice: number | null;
}

/**
 * News article from Alpha Vantage
 */
export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  summary: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
}

// =============================================================================
// API RESPONSE TYPES (Raw Alpha Vantage responses)
// =============================================================================

/**
 * Raw response from Alpha Vantage GLOBAL_QUOTE endpoint
 */
export interface AlphaVantageQuoteResponse {
  'Global Quote': {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
  };
}

/**
 * Raw response from Alpha Vantage OVERVIEW endpoint
 */
export interface AlphaVantageOverviewResponse {
  Symbol: string;
  Name: string;
  Description: string;
  Sector: string;
  Industry: string;
  MarketCapitalization: string;
  PERatio: string;
  DividendYield: string;
  '52WeekHigh': string;
  '52WeekLow': string;
  AnalystTargetPrice: string;
}

/**
 * Raw response from Alpha Vantage NEWS_SENTIMENT endpoint
 */
export interface AlphaVantageNewsResponse {
  feed: Array<{
    title: string;
    url: string;
    source: string;
    summary: string;
    time_published: string;
    overall_sentiment_score: number;
    overall_sentiment_label: string;
  }>;
}

// =============================================================================
// CHAT TYPES
// =============================================================================

/**
 * Message in the chat interface
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * SSE message types during streaming
 */
export type StreamMessageType = 'thought' | 'message' | 'error' | 'data';

export interface StreamMessage {
  type: StreamMessageType;
  content?: string;
  data?: Record<string, unknown>;
}
