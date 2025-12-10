"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Loader2, Terminal } from "lucide-react";

interface StatusDisplayProps {
    logs: string[];
    currentStep?: string;
}

export default function StatusDisplay({ logs, currentStep }: StatusDisplayProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const logsRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logsRef.current) {
            logsRef.current.scrollTop = logsRef.current.scrollHeight;
        }
    }, [logs]);

    // Entry animation
    useEffect(() => {
        gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col items-center justify-center mt-12 gap-6 w-full max-w-md">
            {/* Spinner & Main Step */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-xl opacity-20 animate-pulse rounded-full"></div>
                    <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
                </div>
                <div className="text-gray-300 font-mono text-lg font-medium animate-pulse">
                    {currentStep || "Thinking..."}
                </div>
            </div>

            {/* Terminal / Logs View */}
            <div className="w-full bg-black/80 border border-white/10 rounded-lg p-4 font-mono text-xs text-gray-400 h-40 overflow-hidden shadow-inner flex flex-col gap-2 relative">
                <div className="flex items-center gap-2 text-gray-500 border-b border-white/5 pb-2 mb-1">
                    <Terminal className="w-3 h-3" />
                    <span>sys_logs</span>
                </div>
                <div ref={logsRef} className="flex-1 overflow-y-auto flex flex-col gap-1 custom-scrollbar">
                    {logs.length === 0 && <span className="opacity-50">Waiting for backend...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="break-words">
                            <span className="text-green-500/50 mr-2">{">"}</span>
                            {log}
                        </div>
                    ))}
                </div>
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-scan pointer-events-none opacity-20"></div>
            </div>
        </div>
    );
}
