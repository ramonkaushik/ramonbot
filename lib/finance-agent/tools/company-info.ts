/**
 * =============================================================================
 * FINANCE-AGENT/TOOLS/COMPANY-INFO.TS
 * =============================================================================
 * 
 * LangChain tool: get_company_info
 * 
 * Fetches fundamental data about a company - what they do, their sector,
 * market cap, P/E ratio, etc.
 * 
 * Example queries this tool helps answer:
 * - "What does NVDA do?"
 * - "Tell me about Apple's fundamentals"
 * - "What sector is Tesla in?"
 * - "What's Microsoft's market cap?"
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getCompanyInfo, formatPrice, formatLargeNumber } from '../api';

/**
 * Create the get_company_info tool.
 * 
 * @returns LangChain tool instance
 */
export function createCompanyInfoTool() {
  return new DynamicStructuredTool({
    name: 'get_company_info',
    
    description: `Get fundamental information about a company.

Use this when you need to know:
- What the company does (business description)
- What sector/industry they're in
- Market capitalization
- P/E ratio and dividend yield
- 52-week high and low
- Analyst target price

Input: Stock ticker symbol (e.g., "NVDA", "AAPL", "TSLA")

Returns: Company description, sector, market cap, valuation metrics, and analyst targets.`,

    schema: z.object({
      symbol: z.string()
        .toUpperCase()
        .describe('Stock ticker symbol (e.g., NVDA, AAPL, TSLA)'),
    }),
    
    func: async ({ symbol }) => {
      console.log(`[Tool:get_company_info] Fetching info for ${symbol}`);
      
      try {
        const info = await getCompanyInfo(symbol);
        
        // Build response parts
        const parts: string[] = [];
        
        // Header
        parts.push(`🏢 **${info.name}** (${info.symbol})`);
        parts.push('');
        
        // Description (truncate if too long)
        const description = info.description.length > 500 
          ? info.description.slice(0, 500) + '...'
          : info.description;
        parts.push(`**About:** ${description}`);
        parts.push('');
        
        // Sector & Industry
        parts.push(`**Sector:** ${info.sector}`);
        parts.push(`**Industry:** ${info.industry}`);
        parts.push('');
        
        // Key Metrics
        parts.push('**Key Metrics:**');
        parts.push(`- Market Cap: $${formatLargeNumber(info.marketCap)}`);
        
        if (info.peRatio !== null) {
          parts.push(`- P/E Ratio: ${info.peRatio.toFixed(2)}`);
        } else {
          parts.push(`- P/E Ratio: N/A (company may not be profitable)`);
        }
        
        if (info.dividendYield !== null && info.dividendYield > 0) {
          parts.push(`- Dividend Yield: ${(info.dividendYield * 100).toFixed(2)}%`);
        }
        
        parts.push('');
        
        // 52-Week Range
        parts.push('**52-Week Range:**');
        parts.push(`- Low: ${formatPrice(info.fiftyTwoWeekLow)}`);
        parts.push(`- High: ${formatPrice(info.fiftyTwoWeekHigh)}`);
        
        // Analyst Target
        if (info.analystTargetPrice !== null) {
          parts.push('');
          parts.push(`**Analyst Target Price:** ${formatPrice(info.analystTargetPrice)}`);
        }
        
        const response = parts.join('\n');
        
        console.log(`[Tool:get_company_info] Got info for ${info.name}`);
        
        return response;
        
      } catch (error) {
        const err = error as Error;
        console.error(`[Tool:get_company_info] Error:`, err.message);
        
        if (err.message.includes('RATE_LIMITED')) {
          return `⚠️ API rate limit reached. Alpha Vantage free tier allows 25 requests/day.`;
        }
        
        if (err.message.includes('No company info found')) {
          return `❌ Could not find company info for "${symbol}". Make sure it's a valid US stock ticker.`;
        }
        
        return `❌ Error fetching company info: ${err.message}`;
      }
    },
  });
}
