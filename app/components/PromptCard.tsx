"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Prompt } from "../prompt/prompt";

interface PromptCardProps {
  prompt: Prompt;
  defaultExpanded?: boolean;
  isDetailPage?: boolean;
}

export default function PromptCard({ 
  prompt, 
  defaultExpanded = false, 
  isDetailPage = false 
}: PromptCardProps) {
  const [likesCount, setLikesCount] = useState(prompt.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Parse variables formatted as {{variableName}}
  const variables = useMemo(() => {
    const matches = prompt.content.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    return Array.from(
      new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim()))
    );
  }, [prompt.content]);

  // Initial state for variables
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      variables.forEach((v) => {
        initial[v] = "";
      });
      return initial;
    }
  );

  // Generate compiled prompt
  const compiledPrompt = useMemo(() => {
    let result = prompt.content;
    Object.entries(variableValues).forEach(([key, val]) => {
      if (val.trim() !== "") {
        // Replace all instances of {{key}} (allowing flexible spacing inside braces)
        const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "g");
        result = result.replace(regex, val);
      }
    });
    return result;
  }, [prompt.content, variableValues]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked) {
      setLikesCount((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikesCount((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  const handleCopy = async (e: React.MouseEvent, textToCopy: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const getCategoryStyles = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("code") || cat.includes("dev")) {
      return {
        badge: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50",
        avatarBg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
      };
    }
    if (cat.includes("writ") || cat.includes("creative")) {
      return {
        badge: "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50",
        avatarBg: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
      };
    }
    if (cat.includes("market") || cat.includes("biz")) {
      return {
        badge: "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
        avatarBg: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
      };
    }
    // Default / Productivity
    return {
      badge: "bg-[#E1F5EE] text-[#0F6E56] dark:bg-[#1A3B30] dark:text-[#9FE1CB] border border-[#C9D3CC]/30 dark:border-[#2E5A48]",
      avatarBg: "bg-[#E1F5EE] text-[#0F6E56] dark:bg-[#1A3B30] dark:text-[#9FE1CB]",
    };
  };

  const catStyles = getCategoryStyles(prompt.category);

  return (
    <div 
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 bg-bg-primary border-border-tertiary ${
        isExpanded 
          ? "ring-1 ring-[var(--accent)] border-[var(--accent)] shadow-lg shadow-[var(--accent)]/5 col-span-full" 
          : "hover:translate-y-[-2px] hover:border-border-secondary hover:shadow-md hover:shadow-accent-light/5"
      }`}
    >
      <div className="p-6">
        {/* Header - Author & Category */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {prompt.author.avatarUrl ? (
              <img 
                src={prompt.author.avatarUrl} 
                alt={prompt.author.name}
                className="h-8 w-8 rounded-full border border-border-tertiary object-cover" 
              />
            ) : (
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${catStyles.avatarBg}`}>
                {prompt.author.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-text-primary leading-tight">{prompt.author.name}</span>
              <span className="text-[11px] text-text-tertiary">@{prompt.author.username}</span>
            </div>
          </div>

          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${catStyles.badge}`}>
            {prompt.category}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="mt-4 text-base font-bold text-text-primary line-clamp-1 group-hover:text-[var(--accent)] transition-colors duration-200">
          {prompt.title}
        </h3>
        <p className="mt-1 text-xs text-text-secondary line-clamp-2 min-h-[32px]">
          {prompt.description}
        </p>

        {/* Template Prompt Preview Box */}
        <div className="mt-4 relative overflow-hidden rounded-xl border border-border-tertiary bg-bg-secondary p-3.5">
          <div className="font-mono text-[11px] leading-relaxed text-text-secondary select-all whitespace-pre-wrap break-words max-h-[96px] overflow-hidden">
            {isExpanded ? prompt.content : `${prompt.content.slice(0, 140)}${prompt.content.length > 140 ? "..." : ""}`}
          </div>
          {!isExpanded && prompt.content.length > 140 && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-bg-secondary to-transparent" />
          )}
        </div>

        {/* Expanded Area: Dynamic Template Compiler */}
        {isExpanded && (
          <div className="mt-6 border-t border-border-tertiary pt-5 space-y-5 animate-fadeIn">
            {variables.length > 0 ? (
              <div>
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Customize Parameters
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {variables.map((variable) => (
                    <div key={variable} className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold text-text-secondary">
                        {variable.charAt(0).toUpperCase() + variable.slice(1)}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter ${variable}...`}
                        value={variableValues[variable] || ""}
                        onChange={(e) =>
                          setVariableValues((prev) => ({
                            ...prev,
                            [variable]: e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-border-secondary bg-bg-primary px-3 py-1.5 text-xs text-text-primary placeholder-text-tertiary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-text-tertiary">This prompt has no dynamic variables.</p>
            )}

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Compiled Prompt Preview
                </h4>
                {variables.length > 0 && (
                  <button 
                    onClick={() => {
                      const cleared: Record<string, string> = {};
                      variables.forEach(v => cleared[v] = "");
                      setVariableValues(cleared);
                    }}
                    className="text-[10px] font-semibold text-[var(--accent)] hover:text-accent-strong transition-colors cursor-pointer"
                  >
                    Reset Variables
                  </button>
                )}
              </div>
              <div className="rounded-xl border border-border-tertiary overflow-hidden">
                {/* Editor Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-bg-secondary border-b border-border-tertiary">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-text-secondary tracking-wider uppercase">Compiled Prompt</span>
                  </div>
                  <button
                    onClick={(e) => handleCopy(e, compiledPrompt)}
                    className="flex items-center gap-1.5 rounded-lg bg-[var(--accent)] hover:bg-accent-strong text-white text-[11px] font-semibold px-3 py-1.5 shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <svg className="h-3 w-3 animate-ping" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <span>Copy Compiled</span>
                      </>
                    )}
                  </button>
                </div>
                {/* Editor Body */}
                <div className="bg-bg-secondary/30 p-4">
                  <pre className="font-mono text-xs leading-relaxed text-text-primary whitespace-pre-wrap break-all max-h-[200px] overflow-y-auto">
                    {compiledPrompt}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between border-t border-border-tertiary bg-bg-secondary/40 px-6 py-4">
        <div className="flex items-center gap-4">
          {/* Likes count */}
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-medium transition-all duration-200 active:scale-75 ${
              hasLiked ? "text-red-500 font-semibold" : "text-text-secondary hover:text-red-500"
            }`}
          >
            <svg 
              className={`h-4 w-4 transition-transform duration-300 ${hasLiked ? "fill-current scale-110" : "fill-none"}`} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={hasLiked ? 1.5 : 2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likesCount}</span>
          </button>

          {/* Copies count */}
          <div className="flex items-center gap-1.5 text-xs text-text-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>{prompt.copies + (copied && !isExpanded ? 1 : 0)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Copy (only if not expanded) */}
          {!isExpanded && (
            <button
              onClick={(e) => handleCopy(e, compiledPrompt)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-tertiary bg-bg-primary hover:border-border-secondary hover:text-[var(--accent)] transition-all duration-200 cursor-pointer active:scale-95"
              title="Quick copy prompt"
            >
              {copied ? (
                <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-text-secondary group-hover:text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )}
            </button>
          )}

          {/* Action button: Collapse toggle on detail page, route link on grid page */}
          {isDetailPage ? (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-semibold border transition-all duration-200 cursor-pointer active:scale-95 ${
                isExpanded 
                  ? "bg-bg-primary border-border-secondary text-text-primary hover:bg-bg-secondary" 
                  : "bg-[var(--accent)] border-[var(--accent)] text-white hover:bg-accent-strong shadow-sm"
              }`}
            >
              <span>{isExpanded ? "Collapse" : "Expand"}</span>
              <svg 
                className={`h-3 w-3 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          ) : (
            <Link href={`/prompt/${prompt.id}`} className="inline-flex">
              <button
                className="flex items-center gap-1 h-8 px-3 rounded-lg text-xs font-semibold border bg-[var(--accent)] border-[var(--accent)] text-white hover:bg-accent-strong shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>Use Prompt</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}