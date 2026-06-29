"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import PromptCard from "../../components/PromptCard";
import { SAMPLE_PROMPTS, Prompt } from "../prompt";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem("devault_prompts");
    try {
      const parsed = saved ? JSON.parse(saved) : null;
      const promptsList: Prompt[] = (Array.isArray(parsed) && parsed.length > 0) ? parsed : SAMPLE_PROMPTS;
      const found = promptsList.find((p) => p.id === id) || null;
      setPrompt(found);
    } catch (e) {
      setPrompt(SAMPLE_PROMPTS.find((p) => p.id === id) || null);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-page px-6 py-6 md:px-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-xs font-semibold text-text-secondary animate-pulse">Loading prompt data...</span>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-bg-page px-6 py-6 md:px-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border-secondary/60 rounded-3xl bg-bg-primary gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-light text-[var(--accent)]">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Prompt not found</h3>
            <p className="text-xs text-text-secondary mt-1">
              The requested prompt could not be found. It may have been removed.
            </p>
          </div>
          <Link
            href="/"
            className="mt-2 px-4 py-2 bg-[var(--accent)] hover:bg-accent-strong text-white text-xs font-semibold rounded-xl shadow-md transition cursor-pointer active:scale-95"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page px-6 py-6 md:px-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      <Navbar />

      <main className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors duration-200 self-start group"
        >
          <svg 
            className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all prompts
        </Link>

        {/* Isolated target PromptCard */}
        <PromptCard prompt={prompt} defaultExpanded={true} isDetailPage={true} />
      </main>
    </div>
  );
}
