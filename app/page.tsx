"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "./components/Navbar";
import PromptCard from "./components/PromptCard";
import { SAMPLE_PROMPTS, Prompt } from "./prompt/prompt";

const CATEGORIES = ["All", "Development", "Creative Writing", "Marketing"];

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Sync prompts state with localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("devault_prompts");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPrompts(parsed);
        } else {
          setPrompts(SAMPLE_PROMPTS);
          localStorage.setItem("devault_prompts", JSON.stringify(SAMPLE_PROMPTS));
        }
      } catch (e) {
        setPrompts(SAMPLE_PROMPTS);
        localStorage.setItem("devault_prompts", JSON.stringify(SAMPLE_PROMPTS));
      }
    } else {
      setPrompts(SAMPLE_PROMPTS);
      localStorage.setItem("devault_prompts", JSON.stringify(SAMPLE_PROMPTS));
    }
    setMounted(true);
  }, []);

  // Filtered prompts list
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const matchesCategory =
        selectedCategory === "All" || prompt.category === selectedCategory;
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [prompts, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-bg-page px-6 py-6 md:px-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="flex flex-col items-center text-center mt-6 max-w-2xl mx-auto gap-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-light text-[#0F6E56] dark:bg-accent-light/10 dark:text-[#9FE1CB] border border-[#C9D3CC]/30 dark:border-[#2E5A48] animate-pulse">
          ⚡ Devault AI Prompts
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-primary">
          Discover, Customize & Deploy <span className="text-[var(--accent)] bg-gradient-to-r from-[var(--accent)] to-[#085041] dark:to-[#9FE1CB] bg-clip-text text-transparent">AI Prompts</span>
        </h1>
        <p className="text-sm md:text-base text-text-secondary">
          Explore premium, variable-powered prompts. Instantly customize template variables in real-time, test the compiled outputs, and copy code blocks directly into your developer workflows.
        </p>
      </header>

      {/* Filters and Search Bar Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-border-tertiary bg-bg-primary rounded-2xl p-5 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <svg className="w-4 h-4 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search prompts by title, content, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border-tertiary bg-bg-page text-sm text-text-primary placeholder-text-tertiary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-text-tertiary hover:text-text-primary cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer active:scale-95 ${
                selectedCategory === category
                  ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/15"
                  : "bg-bg-page border-border-tertiary text-text-secondary hover:border-border-secondary hover:text-text-primary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Grid of Prompts */}
      <main className="flex flex-col gap-6">
        {!mounted ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-bg-primary border border-border-tertiary h-[200px] rounded-2xl" />
            ))}
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border-secondary/60 rounded-3xl bg-bg-primary gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-light text-[var(--accent)]">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-text-primary">No prompts found</h3>
              <p className="text-xs text-text-secondary mt-1">
                We couldn't find any prompts matching your search parameters. Try resetting filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-2 px-4 py-2 bg-[var(--accent)] hover:bg-accent-strong text-white text-xs font-semibold rounded-xl shadow-md transition cursor-pointer active:scale-95"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-text-tertiary border-t border-border-tertiary pt-6 mb-6">
        <p>&copy; {new Date().getFullYear()} Devault AI. Powered by Next.js and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

