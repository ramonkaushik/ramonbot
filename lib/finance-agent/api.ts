/**
 * =============================================================================
 * FINANCE-AGENT/API.TS
 * =============================================================================
 * 
 * Alpha Vantage API client.
 * 
 * Alpha Vantage provides free financial data:
 * - Stock quotes (real-time prices)
 * - Company info (fundamentals, description)
 * - News with sentiment analysis
 * 
 * Free tier: 25 requests/day
 * Get your key at: https://www.alphavantage.co/support/#api-key
 * 
 * We wrap the raw API responses into clean TypeScript types.
 */

import {
  StockQuote,
  CompanyInfo,
  NewsArticle,
  AlphaVantageQuoteResponse,
  AlphaVantageOverviewResponse,
  AlphaVantageNewsResponse,
} from './types';

// =============================================================================
// CONSTANTS
// =============================================================================

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Get the API key from environment variables.
 * Throws a helpful error if not set.
 */
function getApiKey(): string {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  
  if (!key) {
    throw new Error(
      'ALPHA_VANTAGE_API_KEY is not set.\n' +
      'Get a free key at: https://www.alphavantage.co/support/#api-key\n' +
      'Then add it to your .env.local file.'
    );
  }
  
  return key;
}

// =============================================================================
// STOCK QUOTE
// =============================================================================

/**
 * Get current stock quote for a ticker.
 * 
 * @param symbol - Stock ticker (e.g., "NVDA", "AAPL")
 * @returns Stock quote with price, change, volume, etc.
 * 
 * Example:
 *   const quote = await getStockQuote('NVDA');
 *   console.log(`${quote.symbol} is trading at $${quote.price}`);
 */
export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const apiKey = getApiKey();
  const url = `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  console.log(`[AlphaVantage] Fetching quote for ${symbol}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`);
  }
  
  const data: AlphaVantageQuoteResponse = await response.json();
  
  // Check for API errors (Alpha Vantage returns 200 even on errors)
  if (!data['Global Quote'] || !data['Global Quote']['01. symbol']) {
    // Check if it's a rate limit error
    if (JSON.stringify(data).includes('rate limit')) {
      throw new Error('RATE_LIMITED: Alpha Vantage free tier allows 25 requests/day');
    }
    throw new Error(`No data found for symbol: ${symbol}`);
  }
  
  const quote = data['Global Quote'];
  
  return {
    symbol: quote['01. symbol'],
    price: parseFloat(quote['05. price']),
    change: parseFloat(quote['09. change']),
    changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
    open: parseFloat(quote['02. open']),
    high: parseFloat(quote['03. high']),
    low: parseFloat(quote['04. low']),
    volume: parseInt(quote['06. volume'], 10),
    latestTradingDay: quote['07. latest trading day'],
    previousClose: parseFloat(quote['08. previous close']),
  };
}

// =============================================================================
// COMPANY INFO
// =============================================================================

/**
 * Get company overview/fundamentals.
 * 
 * @param symbol - Stock ticker
 * @returns Company info with description, sector, market cap, P/E, etc.
 * 
 * Example:
 *   const info = await getCompanyInfo('AAPL');
 *   console.log(`${info.name} is in the ${info.sector} sector`);
 */
export async function getCompanyInfo(symbol: string): Promise<CompanyInfo> {
  const apiKey = getApiKey();
  const url = `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;
  
  console.log(`[AlphaVantage] Fetching company info for ${symbol}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`);
  }
  
  const data: AlphaVantageOverviewResponse = await response.json();
  
  // Check for errors
  if (!data.Symbol) {
    if (JSON.stringify(data).includes('rate limit')) {
      throw new Error('RATE_LIMITED: Alpha Vantage free tier allows 25 requests/day');
    }
    throw new Error(`No company info found for symbol: ${symbol}`);
  }
  
  return {
    symbol: data.Symbol,
    name: data.Name,
    description: data.Description,
    sector: data.Sector,
    industry: data.Industry,
    marketCap: parseInt(data.MarketCapitalization, 10) || 0,
    peRatio: data.PERatio !== 'None' ? parseFloat(data.PERatio) : null,
    dividendYield: data.DividendYield !== 'None' ? parseFloat(data.DividendYield) : null,
    fiftyTwoWeekHigh: parseFloat(data['52WeekHigh']),
    fiftyTwoWeekLow: parseFloat(data['52WeekLow']),
    analystTargetPrice: data.AnalystTargetPrice !== 'None' 
      ? parseFloat(data.AnalystTargetPrice) 
      : null,
  };
}

// =============================================================================
// NEWS
// =============================================================================

/**
 * Get recent news for a stock with sentiment analysis.
 * 
 * @param symbol - Stock ticker
 * @param limit - Max number of articles (default 5)
 * @returns Array of news articles with sentiment scores
 * 
 * Example:
 *   const news = await getCompanyNews('TSLA', 3);
 *   news.forEach(article => {
 *     console.log(`${article.title} (${article.sentiment})`);
 *   });
 */
export async function getCompanyNews(
  symbol: string,
  limit: number = 5
): Promise<NewsArticle[]> {
  const apiKey = getApiKey();
  const url = `${ALPHA_VANTAGE_BASE_URL}?function=NEWS_SENTIMENT&tickers=${symbol}&limit=${limit}&apikey=${apiKey}`;
  
  console.log(`[AlphaVantage] Fetching news for ${symbol}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Alpha Vantage API error: ${response.status}`);
  }
  
  const data: AlphaVantageNewsResponse = await response.json();
  
  // Check for errors
  if (!data.feed) {
    if (JSON.stringify(data).includes('rate limit')) {
      throw new Error('RATE_LIMITED: Alpha Vantage free tier allows 25 requests/day');
    }
    // No news isn't necessarily an error
    return [];
  }
  
  return data.feed.slice(0, limit).map(article => ({
    title: article.title,
    url: article.url,
    source: article.source,
    summary: article.summary,
    publishedAt: formatAlphaVantageDate(article.time_published),
    sentiment: mapSentimentLabel(article.overall_sentiment_label),
    sentimentScore: article.overall_sentiment_score,
  }));
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Convert Alpha Vantage date format to readable string.
 * Input: "20250117T143000"
 * Output: "Jan 17, 2025"
 */
function formatAlphaVantageDate(dateStr: string): string {
  try {
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    
    const date = new Date(`${year}-${month}-${day}`);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

/**
 * Map Alpha Vantage sentiment labels to our simpler types.
 */
function mapSentimentLabel(label: string): 'positive' | 'negative' | 'neutral' {
  const lower = label.toLowerCase();
  
  if (lower.includes('bullish') || lower.includes('positive')) {
    return 'positive';
  }
  if (lower.includes('bearish') || lower.includes('negative')) {
    return 'negative';
  }
  return 'neutral';
}

// =============================================================================
// UTILITY: FORMAT NUMBERS
// =============================================================================

/**
 * Format large numbers (e.g., market cap) to readable strings.
 * 1500000000 → "1.5B"
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1e12) {
    return `${(num / 1e12).toFixed(2)}T`;
  }
  if (num >= 1e9) {
    return `${(num / 1e9).toFixed(2)}B`;
  }
  if (num >= 1e6) {
    return `${(num / 1e6).toFixed(2)}M`;
  }
  if (num >= 1e3) {
    return `${(num / 1e3).toFixed(2)}K`;
  }
  return num.toString();
}

/**
 * Format price to 2 decimal places with dollar sign.
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Format percent change with + or - sign.
 */
export function formatPercent(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(2)}%`;
}
