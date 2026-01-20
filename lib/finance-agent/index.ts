/**
 * =============================================================================
 * FINANCE-AGENT/INDEX.TS
 * =============================================================================
 * 
 * Main agent for the Financial Research Agent.
 * 
 * This uses a simple tool-calling loop instead of LangChain's agent framework.
 * Why? It's cleaner, easier to debug, and you understand exactly what's happening.
 * 
 * How it works:
 * 1. Send the user's question to GPT with tools available
 * 2. If GPT wants to call a tool, execute it and add result to conversation
 * 3. Repeat until GPT gives a final answer (no more tool calls)
 */

import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage, AIMessage, ToolMessage } from '@langchain/core/messages';
import { StructuredTool } from '@langchain/core/tools';
import { FINANCE_AGENT_SYSTEM_PROMPT } from './prompts';
import {
  createStockQuoteTool,
  createCompanyInfoTool,
  createCompanyNewsTool,
} from './tools';

// =============================================================================
// TYPES
// =============================================================================

export interface AgentResponse {
  output: string;
}

// =============================================================================
// CONFIGURATION
// =============================================================================

const AGENT_CONFIG = {
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  temperature: 0.3,
  maxIterations: 10,
  timeoutMs: 30000,
};

function getOpenAIKey(): string {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error(
      'OPENAI_API_KEY is not set.\n' +
      'Get a key at: https://platform.openai.com/api-keys\n' +
      'Then add it to your .env.local file.'
    );
  }
  return key;
}

// =============================================================================
// AGENT RUNNER
// =============================================================================

/**
 * Run the Finance Agent on a query.
 * 
 * This is a simple tool-calling loop:
 * 1. Send messages to LLM with tools bound
 * 2. If LLM returns tool_calls, execute them IN PARALLEL
 * 3. Add tool results to messages
 * 4. Repeat until LLM returns a final text response
 * 
 * @param query - User's question
 * @returns Agent's final response
 */
export async function runFinanceAgent(query: string): Promise<AgentResponse> {
  console.log(`[FinanceAgent] Running query: "${query.slice(0, 50)}..."`);

  // Create tools
  const tools = [
    createStockQuoteTool(),
    createCompanyInfoTool(),
    createCompanyNewsTool(),
  ];

  // Create LLM with tools bound
  const llm = new ChatOpenAI({
    modelName: AGENT_CONFIG.model,
    temperature: AGENT_CONFIG.temperature,
    openAIApiKey: getOpenAIKey(),
  }).bindTools(tools);

  // Initialize conversation
  const messages: (SystemMessage | HumanMessage | AIMessage | ToolMessage)[] = [
    new SystemMessage(FINANCE_AGENT_SYSTEM_PROMPT),
    new HumanMessage(query),
  ];

  // Tool-calling loop
  for (let i = 0; i < AGENT_CONFIG.maxIterations; i++) {
    console.log(`[FinanceAgent] Iteration ${i + 1}`);
    
    // Get LLM response
    const response = await llm.invoke(messages);
    
    // Add response to conversation history
    messages.push(response);

    // Check if model wants to call tools
    const toolCalls = response.tool_calls;
    
    if (!toolCalls || toolCalls.length === 0) {
      // No tool calls - this is the final response
      console.log(`[FinanceAgent] Completed after ${i + 1} iterations`);
      return { output: response.content as string };
    }

    // Execute tool calls in parallel for speed
    console.log(`[FinanceAgent] Executing ${toolCalls.length} tool(s) in parallel`);
    
    const toolResults = await Promise.all(
      toolCalls.map(async (toolCall) => {
        const tool = tools.find(t => t.name === toolCall.name);
        
        if (tool) {
          console.log(`[FinanceAgent] Calling: ${toolCall.name}`);
          
          try {
            const result = await (tool as StructuredTool).invoke(toolCall.args);
            return new ToolMessage({
              content: result,
              tool_call_id: toolCall.id!,
            });
          } catch (error) {
            console.error(`[FinanceAgent] Tool error:`, error);
            return new ToolMessage({
              content: `Error: ${(error as Error).message}`,
              tool_call_id: toolCall.id!,
            });
          }
        } else {
          console.warn(`[FinanceAgent] Unknown tool: ${toolCall.name}`);
          return null;
        }
      })
    );
    
    // Add all tool results to messages
    for (const result of toolResults) {
      if (result) {
        messages.push(result);
      }
    }
  }

  // If we hit max iterations, return what we have
  console.warn('[FinanceAgent] Max iterations reached');
  return { output: 'I was unable to complete the research. Please try a simpler question.' };
}