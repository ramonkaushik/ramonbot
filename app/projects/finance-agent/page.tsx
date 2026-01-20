/**
 * =============================================================================
 * FINANCE AGENT PAGE
 * =============================================================================
 * 
 * The main UI for the Financial Research Agent.
 * 
 * Features:
 * - Chat interface for asking questions
 * - Real-time streaming of agent responses
 * - Suggested questions to get started
 * - Clean, professional design matching portfolio aesthetic
 */

'use client';

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Loader2, TrendingUp, Building2, Newspaper } from "lucide-react";
import Link from "next/link";

// =============================================================================
// TYPES
// =============================================================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export default function FinanceAgent() {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentThought, setCurrentThought] = useState<string | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentThought]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);
    setCurrentThought("Thinking...");

    try {
      const response = await fetch('/api/finance/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      let assistantMessage = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'thought') {
                  setCurrentThought(data.content);
                } else if (data.type === 'message') {
                  assistantMessage = data.content;
                } else if (data.type === 'error') {
                  assistantMessage = `⚠️ ${data.content}`;
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }

      setCurrentThought(null);
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);

    } catch (error) {
      console.error('Error:', error);
      setCurrentThought(null);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '⚠️ Something went wrong. Please try again.' 
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle suggestion click
  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  // Suggested questions
  const suggestions = [
    { icon: TrendingUp, text: "What's happening with NVDA?" },
    { icon: Building2, text: "Tell me about Apple's fundamentals" },
    { icon: Newspaper, text: "Any recent news on Tesla?" },
    { icon: TrendingUp, text: "Compare MSFT and GOOGL" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-[#e8e8e8] flex flex-col relative overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');

        :root {
          --bg: #050505;
          --surface: #0c0c0c;
          --border: #1a1a1a;
          --border-hover: #2a2a2a;
          --text: #e8e8e8;
          --text-muted: #888;
          --text-dim: #555;
          --accent: #10b981;
          --accent-dim: rgba(16, 185, 129, 0.15);
        }

        html { scroll-behavior: smooth; }
        
        body {
          background: var(--bg);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          font-weight: 300;
          letter-spacing: 0.02em;
          -webkit-font-smoothing: antialiased;
        }

        .serif { font-family: 'Instrument Serif', serif; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }

        .gradient-bg {
          position: fixed;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(ellipse at 30% 20%, rgba(16, 185, 129, 0.03) 0%, transparent 50%),
                      radial-gradient(ellipse at 70% 80%, rgba(16, 185, 129, 0.02) 0%, transparent 40%);
          pointer-events: none;
          z-index: 0;
        }

        .grain {
          position: fixed;
          top: 0; left: 0;
          width: 100%; height: 100%;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          z-index: 1000;
        }

        .message-user {
          background: linear-gradient(135deg, var(--surface) 0%, #0f0f0f 100%);
          border-left: 2px solid var(--accent);
        }

        .message-assistant {
          background: transparent;
          border-left: 2px solid var(--border);
        }

        .suggestion-card {
          transition: all 0.3s ease;
        }

        .suggestion-card:hover {
          border-color: var(--border-hover);
          background: var(--surface);
        }

        input::placeholder { color: var(--text-dim); }
        input:focus { outline: none; }

        .thinking-dot {
          display: inline-block;
          width: 4px; height: 4px;
          background: var(--accent);
          border-radius: 50%;
          margin: 0 2px;
          animation: thinking 1.4s infinite ease-in-out both;
        }

        .thinking-dot:nth-child(1) { animation-delay: -0.32s; }
        .thinking-dot:nth-child(2) { animation-delay: -0.16s; }
        .thinking-dot:nth-child(3) { animation-delay: 0s; }

        @keyframes thinking {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }

        /* Markdown-like formatting for responses */
        .assistant-content strong {
          color: #fff;
          font-weight: 500;
        }

        .assistant-content ul, .assistant-content ol {
          margin-left: 1rem;
          margin-top: 0.5rem;
        }

        .assistant-content li {
          margin-bottom: 0.25rem;
        }

        .assistant-content p {
          margin-bottom: 0.75rem;
        }

        .assistant-content p:last-child {
          margin-bottom: 0;
        }
      `}</style>

      <div className="gradient-bg" />
      <div className="grain" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border-b border-[#111]">
        <Link href="/" className="flex items-center gap-3 text-sm text-[#666] hover:text-[#aaa] transition-colors duration-300">
          <ArrowLeft className="w-4 h-4" />
          <span className="tracking-wider">back</span>
        </Link>
        <div className="flex items-center gap-3">
          <TrendingUp className="w-4 h-4 text-[#10b981]" />
          <span className="text-sm tracking-widest uppercase text-[#888]">Finance Agent</span>
        </div>
        <div className="w-20" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-24 pb-6 relative z-10">
        <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-6">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-8 space-y-6">
            {messages.length === 0 ? (
              // Empty state with suggestions
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-[#10b981]" />
                </div>
                
                <h2 className="serif text-3xl italic text-[#fff] mb-3">
                  Financial Research Agent
                </h2>
                <p className="text-sm text-[#666] mb-10 max-w-md mx-auto">
                  Ask me about stocks, companies, and market data. I'll research it for you.
                </p>
                
                <div className="grid gap-3 max-w-md mx-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestion(suggestion.text)}
                      className="suggestion-card flex items-center gap-4 w-full text-left px-5 py-4 text-sm text-[#777] border border-[#1a1a1a] bg-[#0a0a0a]"
                    >
                      <suggestion.icon className="w-4 h-4 text-[#10b981] shrink-0" />
                      {suggestion.text}
                    </button>
                  ))}
                </div>
                
                <p className="text-xs text-[#444] mt-8">
                  Powered by GPT-4 + Alpha Vantage
                </p>
              </div>
            ) : (
              // Message list
              messages.map((message, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 ${message.role === 'user' ? 'message-user' : 'message-assistant'}`}
                >
                  <div className="flex items-center gap-2 text-xs text-[#555] mb-3 tracking-wider uppercase">
                    {message.role === 'user' ? 'You' : 'Agent'}
                  </div>
                  
                  <div 
                    className={`text-base leading-relaxed whitespace-pre-wrap ${
                      message.role === 'user' ? 'text-[#ddd]' : 'text-[#aaa] assistant-content'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}

            {/* Current thinking indicator */}
            {currentThought && (
              <div className="message-assistant p-5">
                <div className="flex items-center gap-2 text-xs text-[#555] mb-3 tracking-wider uppercase">
                  Agent
                </div>
                <div className="flex items-center gap-3 text-sm text-[#666]">
                  <div className="flex gap-1">
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                    <span className="thinking-dot" />
                  </div>
                  {currentThought}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-[#151515] pt-6">
            <div className="flex gap-4">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about any stock or company..."
                disabled={isProcessing}
                className="flex-1 px-5 py-4 bg-[#0a0a0a] border border-[#1a1a1a] text-[#eee] focus:border-[#2a2a2a] disabled:opacity-40 transition-all duration-300"
              />
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="px-5 py-4 bg-[#0a0a0a] border border-[#1a1a1a] text-[#666] hover:text-[#10b981] hover:border-[#10b981] disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-8 py-5 border-t border-[#111] relative z-10">
        <div className="max-w-2xl mx-auto flex justify-between items-center text-xs text-[#444] tracking-wide">
          <span>Not financial advice · Data from Alpha Vantage</span>
          <span>GPT-4 + LangChain</span>
        </div>
      </footer>
    </div>
  );
}
