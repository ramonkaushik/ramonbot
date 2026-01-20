/**
 * =============================================================================
 * FINANCE-AGENT/TOOLS/COMPANY-NEWS.TS
 * =============================================================================
 * 
 * LangChain tool: get_company_news
 * 
 * Fetches recent news articles about a company with sentiment analysis.
 * This helps the agent understand current events affecting a stock.
 * 
 * Example queries this tool helps answer:
 * - "What's in the news about NVDA?"
 * - "Any recent Tesla news?"
 * - "What's the sentiment on Apple lately?"
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { getCompanyNews } from '../api';

/**
 * Create the get_company_news tool.
 * 
 * @returns LangChain tool instance
 */
export function createCompanyNewsTool() {
  return new DynamicStructuredTool({
    name: 'get_company_news',
    
    description: `Get recent news articles about a company with sentiment analysis.

Use this when you need to know:
- Recent news and headlines about a company
- Current market sentiment (bullish/bearish)
- What events might be affecting the stock price

Input: Stock ticker symbol and optional limit on number of articles

Returns: List of recent news articles with titles, summaries, sources, and sentiment scores.`,

    schema: z.object({
      symbol: z.string()
        .toUpperCase()
        .describe('Stock ticker symbol (e.g., NVDA, AAPL, TSLA)'),
      limit: z.number()
        .min(1)
        .max(10)
        .default(5)
        .describe('Number of articles to fetch (1-10, default 5)'),
    }),
    
    func: async ({ symbol, limit = 5 }) => {
      console.log(`[Tool:get_company_news] Fetching news for ${symbol}`);
      
      try {
        const articles = await getCompanyNews(symbol, limit);
        
        if (articles.length === 0) {
          return `📰 No recent news found for ${symbol}.`;
        }
        
        // Calculate overall sentiment
        const avgSentiment = articles.reduce((sum, a) => sum + a.sentimentScore, 0) / articles.length;
        const overallSentiment = avgSentiment > 0.15 ? '🟢 Bullish' 
          : avgSentiment < -0.15 ? '🔴 Bearish' 
          : '🟡 Neutral';
        
        // Build response
        const parts: string[] = [];
        
        parts.push(`📰 **Recent News for ${symbol}**`);
        parts.push(`Overall Sentiment: ${overallSentiment} (score: ${avgSentiment.toFixed(2)})`);
        parts.push('');
        
        articles.forEach((article, index) => {
          const sentimentEmoji = article.sentiment === 'positive' ? '🟢'
            : article.sentiment === 'negative' ? '🔴'
            : '🟡';
          
          parts.push(`**${index + 1}. ${article.title}**`);
          parts.push(`   ${sentimentEmoji} ${article.sentiment.toUpperCase()} | ${article.source} | ${article.publishedAt}`);
          
          // Truncate summary if too long
          const summary = article.summary.length > 200
            ? article.summary.slice(0, 200) + '...'
            : article.summary;
          parts.push(`   ${summary}`);
          parts.push('');
        });
        
        const response = parts.join('\n');
        
        console.log(`[Tool:get_company_news] Got ${articles.length} articles for ${symbol}`);
        
        return response;
        
      } catch (error) {
        const err = error as Error;
        console.error(`[Tool:get_company_news] Error:`, err.message);
        
        if (err.message.includes('RATE_LIMITED')) {
          return `⚠️ API rate limit reached. Alpha Vantage free tier allows 25 requests/day.`;
        }
        
        return `❌ Error fetching news: ${err.message}`;
      }
    },
  });
}
