'use client';

import { useEffect, useRef, useState } from "react";
import { Music, Search, X, ArrowUpRight, ArrowLeft, Play, Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

type Song = {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  year?: number;
  preview_url?: string;
  spotify_url?: string;
  image?: string;
};

export default function SpotifyAI() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const selectionRef = useRef(null);
  const recommendationRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fade-in",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out", stagger: 0.1 }
      );

      gsap.fromTo(
        ".hero-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
      );

      if (selectionRef.current) {
        gsap.fromTo(
          selectionRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: selectionRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/spotify/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();
        
        if (data.tracks) {
          const filtered = data.tracks.filter(
            (song: Song) => !selectedSongs.find(s => s.id === song.id)
          );
          setFilteredSongs(filtered);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedSongs]);

  const handleSelectSong = (song: Song) => {
    if (selectedSongs.length < 3) {
      setSelectedSongs([...selectedSongs, song]);
      setSearchQuery("");
      setShowResults(false);
    }
  };

  const handleRemoveSong = (songId: string) => {
    setSelectedSongs(selectedSongs.filter(s => s.id !== songId));
    setRecommendation(null);
  };

  const generateRecommendation = async () => {
    if (selectedSongs.length === 0) return;
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedSongs }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setRecommendation(data);
        
        setTimeout(() => {
          if (recommendationRef.current) {
            gsap.fromTo(
              recommendationRef.current,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
          }
        }, 100);
      } else {
        console.error('Recommendation error:', data.error);
        alert('Failed to generate recommendation. Please try again.');
      }
    } catch (error) {
      console.error('Recommendation error:', error);
      alert('Failed to generate recommendation. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-[#eee] selection:bg-[#eee] selection:text-[#0a0a0a]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap');
        
        :root {
          --black: #0a0a0a;
          --white: #eee;
          --gray-light: #bbb;
          --gray: #999;
          --gray-mid: #777;
          --gray-dark: #555;
          --border: #333;
          --border-light: #444;
        }

        body {
          background: var(--black);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          letter-spacing: 0.01em;
          -webkit-font-smoothing: antialiased;
        }

        .serif {
          font-family: 'Instrument Serif', serif;
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--black);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--border-light);
        }

        .noise {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          opacity: 0.02;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          z-index: 1000;
        }

        a:focus-visible, button:focus-visible {
          outline: 2px solid #888;
          outline-offset: 2px;
        }

        input:focus {
          outline: none;
        }
      `}</style>

      <div className="noise" />

      {/* Header */}
      <header className="fade-in fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center border-b border-[#222] bg-[#0a0a0a]/90 backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-2 text-sm text-[#999] hover:text-[#eee] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          back
        </Link>
        <span className="text-sm tracking-wide">Spotify AI</span>
        <div className="w-16" />
      </header>

      {/* Hero */}
      <section ref={heroRef} className="px-6 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          <p className="fade-in text-sm text-[#888] mb-4 tracking-wide">
            AI-powered music discovery
          </p>
          <h1 className="hero-text serif text-[clamp(2.5rem,8vw,5rem)] leading-[0.95] tracking-tight font-normal text-[#fff]">
            Find your next<br />
            <span className="italic">favorite song</span>
          </h1>
          <p className="hero-text text-base text-[#999] mt-6 max-w-lg leading-relaxed">
            Select up to 3 songs you love. GPT-4 analyzes your taste and recommends the perfect track.
          </p>
        </div>
      </section>

      {/* Selection */}
      <section ref={selectionRef} className="px-6 py-16 border-t border-[#222]">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-baseline mb-8">
            <span className="text-sm text-[#888]">Select songs</span>
            <span className="text-sm text-[#666]">{selectedSongs.length}/3</span>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <div className="flex items-center border border-[#333] bg-[#111] focus-within:border-[#555] transition-colors">
              <Search className="w-5 h-5 text-[#666] ml-4" />
              <input
                type="text"
                placeholder="Search by song or artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={selectedSongs.length >= 3}
                className="w-full px-4 py-4 bg-transparent text-[#eee] placeholder-[#666] disabled:opacity-50"
              />
              {isSearching && (
                <Loader2 className="w-4 h-4 text-[#666] mr-4 animate-spin" />
              )}
            </div>

            {/* Search Results */}
            {showResults && filteredSongs.length > 0 && (
              <div className="absolute w-full mt-1 max-h-80 overflow-y-auto z-20 border border-[#333] bg-[#111]">
                {filteredSongs.map((song) => (
                  <button
                    key={song.id}
                    onClick={() => handleSelectSong(song)}
                    className="w-full text-left p-4 hover:bg-[#1a1a1a] transition-colors flex gap-4 items-center border-b border-[#222] last:border-0"
                  >
                    {song.image ? (
                      <img 
                        src={song.image} 
                        alt={song.title}
                        className="w-12 h-12 object-cover grayscale hover:grayscale-0 transition-all"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#222] flex items-center justify-center">
                        <Music className="w-5 h-5 text-[#555]" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#eee] truncate">{song.title}</div>
                      <div className="text-sm text-[#888] truncate">
                        {song.artist}{song.year && ` · ${song.year}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected Songs */}
          {selectedSongs.length > 0 && (
            <div className="space-y-2 mb-8">
              {selectedSongs.map((song, idx) => (
                <div 
                  key={song.id} 
                  className="flex items-center gap-4 p-4 border border-[#333] bg-[#111]"
                >
                  <span className="text-sm text-[#666] w-6">{idx + 1}</span>
                  {song.image ? (
                    <img 
                      src={song.image} 
                      alt={song.title}
                      className="w-12 h-12 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-[#222] flex items-center justify-center">
                      <Music className="w-5 h-5 text-[#555]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[#eee] truncate">{song.title}</div>
                    <div className="text-sm text-[#888] truncate">{song.artist}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveSong(song.id)}
                    className="p-2 text-[#666] hover:text-[#eee] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Generate Button */}
          <button 
            onClick={generateRecommendation}
            disabled={selectedSongs.length === 0 || isGenerating}
            className="w-full py-4 border border-[#333] bg-[#111] text-[#eee] hover:bg-[#1a1a1a] hover:border-[#555] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm tracking-wide"
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Generate recommendation"
            )}
          </button>
        </div>
      </section>

      {/* Recommendation */}
      {recommendation && (
        <section className="px-6 py-16 border-t border-[#222]">
          <div ref={recommendationRef} className="max-w-3xl mx-auto">
            <span className="text-sm text-[#888] mb-8 block">Your recommendation</span>
            
            <div className="border border-[#333] bg-[#111] p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Album Art */}
                {recommendation.image ? (
                  <img 
                    src={recommendation.image} 
                    alt={recommendation.title}
                    className="w-full md:w-48 h-auto md:h-48 object-cover"
                  />
                ) : (
                  <div className="w-full md:w-48 h-48 bg-[#222] flex items-center justify-center">
                    <Music className="w-12 h-12 text-[#444]" />
                  </div>
                )}
                
                {/* Details */}
                <div className="flex-1">
                  <h2 className="serif text-2xl md:text-3xl italic text-[#fff] mb-1">
                    {recommendation.title}
                  </h2>
                  <p className="text-base text-[#999] mb-4">{recommendation.artist}</p>
                  
                  <div className="flex flex-wrap gap-3 mb-6">
                    {recommendation.genre && (
                      <span className="text-xs text-[#888] px-2 py-1 border border-[#333]">
                        {recommendation.genre}
                      </span>
                    )}
                    {recommendation.year && (
                      <span className="text-xs text-[#888] px-2 py-1 border border-[#333]">
                        {recommendation.year}
                      </span>
                    )}
                    <span className="text-xs text-[#888] px-2 py-1 border border-[#333]">
                      {recommendation.confidence}% match
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {recommendation.spotify_url && (
                      <a 
                        href={recommendation.spotify_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-[#000] text-sm hover:bg-[#1ed760] transition-colors"
                      >
                        <Play className="w-4 h-4" />
                        Open in Spotify
                      </a>
                    )}
                    {recommendation.preview_url && (
                      <a 
                        href={recommendation.preview_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-[#333] text-[#999] text-sm hover:border-[#555] hover:text-[#eee] transition-colors"
                      >
                        Preview
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="mt-8 pt-6 border-t border-[#222]">
                <span className="text-xs text-[#666] tracking-wide uppercase mb-3 block">AI Reasoning</span>
                <p className="text-base text-[#999] leading-relaxed">
                  {recommendation.reasoning}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="px-6 py-16 border-t border-[#222]">
        <div className="max-w-3xl mx-auto">
          <span className="text-sm text-[#888] mb-8 block">How it works</span>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Search", desc: "Find songs from Spotify's catalog" },
              { step: "02", title: "Analyze", desc: "GPT-4 decodes your taste" },
              { step: "03", title: "Discover", desc: "Get a personalized recommendation" },
            ].map((item) => (
              <div key={item.step}>
                <span className="text-xs text-[#666] mb-2 block">{item.step}</span>
                <h3 className="text-base text-[#eee] mb-2">{item.title}</h3>
                <p className="text-sm text-[#888]">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-[#222]">
            <div className="flex flex-wrap gap-4">
              {["Spotify API", "OpenAI GPT-4", "Next.js", "TypeScript"].map((tech) => (
                <span key={tech} className="text-sm text-[#666]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-[#222]">
        <div className="max-w-3xl mx-auto flex justify-between items-center text-sm text-[#666]">
          <Link href="/" className="hover:text-[#999] transition-colors">
            ← Back to portfolio
          </Link>
          <span>NYC</span>
        </div>
      </footer>
    </div>
  );
}