"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import ResultDisplay from "@/components/ResultDisplay";
import StatusDisplay from "@/components/StatusDisplay";

const API_BASE = "http://localhost:8000";

export default function Home() {
  const [status, setStatus] = useState<"idle" | "loading" | "completed" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("");

  const startGeneration = async (url: string) => {
    setStatus("loading");
    setError(null);
    setResult(null);
    setCurrentLogs([]);
    setCurrentStep("Initializing...");

    try {
      // 1. Trigger
      const startResp = await fetch(`${API_BASE}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!startResp.ok) {
        throw new Error("Failed to start generation");
      }

      // 2. Poll
      const pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/result?url=${encodeURIComponent(url)}`);
          if (res.ok) {
            const data = await res.json();

            if (data.logs) setCurrentLogs(data.logs);
            if (data.current_step) setCurrentStep(data.current_step);

            if (data.status === "completed") {
              clearInterval(pollInterval);
              setResult({ ...data, url });
              setStatus("completed");
            } else if (data.status === "failed") {
              clearInterval(pollInterval);
              setError(data.error || "Generation failed");
              setStatus("error");
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="gradient-bg">
        <div className="gradient-blob top-[20%] left-[30%] bg-primary/20 w-[400px] h-[400px] rounded-full"></div>
        <div className="gradient-blob top-[60%] right-[20%] bg-secondary/20 w-[300px] h-[300px] rounded-full animation-delay-2000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>

      <Hero onSubmit={startGeneration} isLoading={status === "loading"} />

      {status === "loading" && <StatusDisplay logs={currentLogs} currentStep={currentStep} />}

      {status === "error" && (
        <div className="mt-10 p-4 border border-red-500/50 bg-red-500/10 text-red-200 rounded-lg backdrop-blur-sm max-w-lg text-center animate-in fade-in slide-in-from-bottom-5">
          <p className="font-bold">Error Occurred</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      )}

      {status === "completed" && result && (
        <ResultDisplay data={result} />
      )}

      <div className="fixed bottom-0 w-full h-24 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </main>
  );
}
