"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ArrowRight, Sparkles } from "lucide-react";

interface HeroProps {
  onSubmit: (url: str) => void;
  isLoading: boolean;
}

export default function Hero({ onSubmit, isLoading }: HeroProps) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Entry Animation
    const msg = gsap.context(() => {
        gsap.fromTo(".hero-element", 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
    }, containerRef);
    return () => msg.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !isLoading) {
      onSubmit(url);
    }
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative z-10">
      <div className="hero-element mb-6 relative">
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500 neon-text">
          LLM.txt
        </h1>
        <span className="absolute -bottom-2 -right-4 text-xs font-mono text-primary rotate-[-10deg] border border-primary/50 px-1 rounded bg-black/50">
          Generator
        </span>
      </div>

      <p className="hero-element text-lg text-gray-400 max-w-xl mb-10">
        Turn any documentation site into a perfectly formatted, context-rich text file for your LLMs and RAG pipelines.
      </p>

      <form onSubmit={handleSubmit} className="hero-element w-full max-w-lg relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex items-center bg-black rounded-lg p-1">
          <input
            ref={inputRef}
            type="url"
            placeholder="https://docs.example.com/"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-transparent text-white px-4 py-3 outline-none placeholder:text-gray-600 font-mono text-sm"
            required
          />
          <button
            ref={buttonRef}
            type="submit"
            disabled={isLoading}
            className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Sparkles className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <>
                Generate <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
