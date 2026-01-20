/**
 * =============================================================================
 * API/FINANCE/CHAT/ROUTE.TS
 * =============================================================================
 */

import { NextRequest } from 'next/server';
import { runFinanceAgent } from '@/lib/finance-agent';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface StreamMessage {
  type: 'thought' | 'message' | 'error';
  content: string;
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: StreamMessage) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };
      
      try {
        // Parse request
        let message: string;
        
        try {
          const body = await request.json();
          message = body.message;
        } catch {
          send({ type: 'error', content: 'Invalid request body' });
          controller.close();
          return;
        }
        
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
          send({ type: 'error', content: 'Please provide a message' });
          controller.close();
          return;
        }
        
        message = message.trim().slice(0, 500);
        
        console.log(`[API/Finance] Received: "${message.slice(0, 50)}..."`);
        
        send({ type: 'thought', content: 'Researching...' });
        
        // Run the agent
        const result = await runFinanceAgent(message);
        
        send({ type: 'message', content: result.output });
        
        console.log('[API/Finance] Response sent successfully');
        
      } catch (err: unknown) {
        const error = err as Error;
        console.error('[API/Finance] Error:', error.message);
        
        if (error.message.includes('OPENAI_API_KEY')) {
          send({ type: 'error', content: 'OpenAI API key is not configured.' });
        } else if (error.message.includes('ALPHA_VANTAGE_API_KEY')) {
          send({ type: 'error', content: 'Alpha Vantage API key is not configured.' });
        } else {
          send({ type: 'error', content: 'Something went wrong. Please try again.' });
        }
        
      } finally {
        controller.close();
      }
    },
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}