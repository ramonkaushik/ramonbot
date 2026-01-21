'use client';

import { useRef, useState, useEffect, useCallback } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [bassIntensity, setBassIntensity] = useState(0);

  // Initialize Web Audio API
  const initAudioAnalyzer = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    
    // FFT size determines frequency resolution - smaller = faster, less precise
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.3; // Lower = snappier transient response

    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;
  }, []);

  // Animation loop to extract bass frequencies
  const updateBassIntensity = useCallback(() => {
    if (!analyserRef.current || !isPlaying) {
      setBassIntensity(0);
      return;
    }

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let lastKickValue = 0;
    let currentPump = 0;
    
    const tick = () => {
      if (!isPlaying) {
        setBassIntensity(0);
        return;
      }

      analyser.getByteFrequencyData(dataArray);

      // Get the kick frequency bin (roughly 60-100Hz)
      const kickBin = dataArray[0];
      
      // Detect kick by looking for sudden increase (transient)
      const kickThreshold = 130;
      const isKick = kickBin > kickThreshold && kickBin > lastKickValue + 47;
      
      if (isKick) {
        // Kick detected - pump up
        currentPump = 1;
      } else {
        // Decay back to 0
        currentPump *= 0.85;
        if (currentPump < 0.01) currentPump = 0;
      }
      
      lastKickValue = kickBin;
      setBassIntensity(currentPump);
      animationFrameRef.current = requestAnimationFrame(tick);
    };

    tick();
  }, [isPlaying]);

  // Start/stop the animation loop based on playing state
  useEffect(() => {
    if (isPlaying) {
      updateBassIntensity();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setBassIntensity(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, updateBassIntensity]);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    // Initialize analyzer on first play
    if (!audioContextRef.current) {
      initAudioAnalyzer();
    }

    // Resume audio context if suspended (browser autoplay policy)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    if (isPlaying) {
      // Fade out over 0.5s then pause
      const fadeOut = setInterval(() => {
        if (audioRef.current && audioRef.current.volume > 0.05) {
          audioRef.current.volume = Math.max(0, audioRef.current.volume - 0.05);
        } else {
          clearInterval(fadeOut);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.volume = 0;
          }
        }
      }, 50);
    } else {
      // Start at 50s, fade in over 5s
      audioRef.current.currentTime = 50;
      audioRef.current.volume = 0;
      audioRef.current.play();

      const targetVolume = 0.3;
      const fadeInDuration = 5000; // 5 seconds
      const steps = 50;
      const volumeStep = targetVolume / steps;
      const intervalTime = fadeInDuration / steps;

      const fadeIn = setInterval(() => {
        if (audioRef.current && audioRef.current.volume < targetVolume - volumeStep) {
          audioRef.current.volume = Math.min(targetVolume, audioRef.current.volume + volumeStep);
        } else {
          if (audioRef.current) audioRef.current.volume = targetVolume;
          clearInterval(fadeIn);
        }
      }, intervalTime);
    }
    setIsPlaying(!isPlaying);
  };

  // Track if mounted to avoid hydration mismatch
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // CSS custom property for bass intensity - only apply after mount to avoid hydration mismatch
  const bassStyle = isMounted ? {
    '--bass-pump': `${bassIntensity * 6}px`,
  } as React.CSSProperties : undefined;

  return (
    <html lang="en" className="dark">
      <head>
        <title>Ramon Kaushik</title>
        <meta name="description" content="Senior System Engineer, New York" />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={bassStyle}
      >
        {/* Persistent audio element */}
        <audio ref={audioRef} src="/audio/ambient.mp3" loop preload="auto" crossOrigin="anonymous" />

        {/* Global music toggle button */}
        <button
          className={`music-toggle ${isPlaying ? 'playing' : ''}`}
          onClick={toggleAudio}
          aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
        >
          <span className="music-note">♪</span>
          <span className="mute-slash" />
        </button>

        {children}

        <style jsx global>{`
          /* Bass-reactive elements - clean vertical pump */
          .bass-reactive {
            transform: translateY(var(--bass-pump, 0px));
            transition: transform 0.06s ease-out;
            will-change: transform;
          }

          /* Subtler pump for smaller elements */
          .bass-reactive-subtle {
            transform: translateY(calc(var(--bass-pump, 0px) * 0.4));
            transition: transform 0.06s ease-out;
          }

          .music-toggle {
            position: fixed;
            top: 12.5px;
            right: 350px;
            z-index: 1000;
            background: transparent;
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px 8px;
            font-size: 18px;
            color: #999;
            mix-blend-mode: difference;
            transition: color 0.3s ease;
          }

          .music-toggle:hover {
            color: #eee;
          }

          .music-toggle .music-note {
            transition: opacity 0.3s ease, transform 0.3s ease;
          }

          .music-toggle .mute-slash {
            position: absolute;
            width: 18px;
            height: 1px;
            background: #666;
            transform: rotate(-45deg);
            transition: opacity 0.3s ease, background 0.3s ease;
          }

          .music-toggle:hover .mute-slash {
            background: #999;
          }

          .music-toggle.playing .mute-slash {
            opacity: 0;
          }

          .music-toggle.playing .music-note {
            animation: bounce 0.6s ease-in-out infinite;
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-2px);
            }
          }
        `}</style>
      </body>
    </html>
  );
}