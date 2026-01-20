/**
 * =============================================================================
 * FINANCE-AGENT/TOOLS/STOCK-QUOTE.TS
 * =============================================================================
 * 
 * LangChain tool: get_stock_quote
 * 
 * Fetches current stock price and trading data for a ticker symbol.
 * The agent uses this when a user asks about a stock's current price
 * or recent performance.
 * 
 * Example queries this tool helps answer:
 * - "What's NVDA trading at?"
 * - "How's Apple doing today?"
 * - "Is Tesla up or down?"
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getStockQuote, formatPrice, formatPercent, formatLargeNumber } from '../api';

/**
 * Create the get_stock_quote tool.
 * 
 * @returns LangChain tool instance
 */
export function createStockQuoteTool() {
  return new DynamicStructuredTool({
    name: 'get_stock_quote',
    
    description: `Get the current stock price and trading data for a ticker symbol.

Use this when you need to know:
- Current stock price
- Today's price change (up/down)
- Trading volume
- Day's high and low

Input: Stock ticker symbol (e.g., "NVDA", "AAPL", "TSLA", "MSFT")

Returns: Current price, change, percent change, volume, and day's range.`,

    schema: z.object({
      symbol: z.string()
        .toUpperCase()
        .describe('Stock ticker symbol (e.g., NVDA, AAPL, TSLA)'),
    }),
    
    func: async ({ symbol }) => {
      console.log(`[Tool:get_stock_quote] Fetching quote for ${symbol}`);
      
      try {
        const quote = await getStockQuote(symbol);
        
        // Format the response for the LLM
        const direction = quote.change >= 0 ? 'up' : 'down';
        const emoji = quote.change >= 0 ? '📈' : '📉';
        
        const response = `${emoji} ${quote.symbol} Stock Quote (${quote.latestTradingDay})

**Price: ${formatPrice(quote.price)}** (${direction} ${formatPercent(quote.changePercent)} today)

Trading Data:
- Open: ${formatPrice(quote.open)}
- High: ${formatPrice(quote.high)}
- Low: ${formatPrice(quote.low)}
- Previous Close: ${formatPrice(quote.previousClose)}
- Volume: ${formatLargeNumber(quote.volume)} shares
- Dollar Change: ${quote.change >= 0 ? '+' : ''}$${quote.change.toFixed(2)}`;

        console.log(`[Tool:get_stock_quote] Got quote for ${symbol}: ${formatPrice(quote.price)}`);
        
        return response;
        
      } catch (error) {
        const err = error as Error;
        console.error(`[Tool:get_stock_quote] Error:`, err.message);
        
        if (err.message.includes('RATE_LIMITED')) {
          return `⚠️ API rate limit reached. Alpha Vantage free tier allows 25 requests/day. Try again tomorrow or upgrade your API key.`;
        }
        
        if (err.message.includes('No data found')) {
          return `❌ Could not find stock data for "${symbol}". Make sure it's a valid US stock ticker symbol.`;
        }
        
        return `❌ Error fetching stock quote: ${err.message}`;
      }
    },
  });
}
