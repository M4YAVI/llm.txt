"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Copy, FileText, Download, Code } from "lucide-react";
import { gsap } from "gsap";

interface ResultProps {
    data: any;
}

export default function ResultDisplay({ data }: ResultProps) {
    const [activeTab, setActiveTab] = useState<"summary" | "full">("summary");
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Animate in
        gsap.fromTo(containerRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
    }, []);

    const handleCopy = () => {
        const text = activeTab === "summary" ? data.llms_txt : data.llms_full_txt;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const text = activeTab === "summary" ? data.llms_txt : data.llms_full_txt;
        const filename = activeTab === "summary" ? "llms.txt" : "llms-full.txt";
        const blob = new Blob([text], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div ref={containerRef} className="w-full max-w-4xl bg-black/50 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-2xl mt-10 animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveTab("summary")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "summary"
                                ? "bg-primary/20 text-primary border border-primary/30"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <FileText className="w-4 h-4" /> llms.txt
                    </button>
                    <button
                        onClick={() => setActiveTab("full")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "full"
                                ? "bg-secondary/20 text-secondary border border-secondary/30"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }`}
                    >
                        <Code className="w-4 h-4" /> llms-full.txt
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10"
                        title="Copy to Clipboard"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-md hover:bg-white/10"
                        title="Download File"
                    >
                        <Download className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="bg-black/80 p-6 overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {activeTab === "summary" ? data.llms_txt : data.llms_full_txt}
                </pre>
            </div>

            {/* Footer Stats */}
            <div className="px-6 py-3 bg-white/5 border-t border-white/10 text-xs text-gray-500 flex justify-between">
                <span>Generated for: {data.url}</span>
                <span>{activeTab === "summary" ? data.llms_txt.length : data.llms_full_txt.length} chars</span>
            </div>
        </div>
    );
}
