"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";
import PromptCard from "../components/PromptCard";
import { SAMPLE_PROMPTS, Prompt } from "../prompt/prompt";

const CATEGORIES = ["Development", "Creative Writing", "Marketing"];

export default function SubmitPromptPage() {
  const router = useRouter();

  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Development");
  const [authorName, setAuthorName] = useState("");
  const [authorUsername, setAuthorUsername] = useState("");

  // UI Status State
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Live variables detector
  const detectedVariables = useMemo(() => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    if (!matches) return [];
    return Array.from(new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, "").trim())));
  }, [content]);

  // Dynamic Prompt Mockup for Real-Time Card Preview
  const previewPrompt: Prompt = useMemo(() => {
    return {
      id: "preview",
      title: title.trim() || "Create React Component",
      description: description.trim() || "Generates tailored React component code blocks.",
      content: content || "Create a clean, responsive component for {{component_name}} using {{css_framework}}.",
      category: category,
      author: {
        name: authorName.trim() || "Developer Name",
        username: authorUsername.trim() || "devusername",
      },
      likes: 0,
      copies: 0,
    };
  }, [title, description, content, category, authorName, authorUsername]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple Form Validation
    if (!title.trim()) return setError("Please specify a prompt title.");
    if (!description.trim()) return setError("Please provide a short description.");
    if (!content.trim()) return setError("Please provide the prompt content.");
    if (!authorName.trim()) return setError("Author Name is required.");
    if (!authorUsername.trim()) return setError("Author Username is required.");

    setIsSubmitting(true);

    try {
      // Load current prompts list
      const saved = localStorage.getItem("devault_prompts");
      const currentList: Prompt[] = saved ? JSON.parse(saved) : SAMPLE_PROMPTS;

      // Construct new prompt model
      const newPrompt: Prompt = {
        id: Date.now().toString(), // unique numeric string ID
        title: title.trim(),
        description: description.trim(),
        content: content,
        category: category,
        author: {
          name: authorName.trim(),
          username: authorUsername.trim().replace(/^@/, ""), // remove prefix @ if present
        },
        likes: 0,
        copies: 0,
      };

      // Add to front of the array (top of the library list)
      const updatedList = [newPrompt, ...currentList];
      localStorage.setItem("devault_prompts", JSON.stringify(updatedList));

      setIsSuccess(true);
      // Short delay for visual confirmation before routing home
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (err) {
      setError("An error occurred during submission. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-page px-6 py-6 md:px-10 max-w-[1440px] mx-auto w-full flex flex-col gap-8">
      <Navbar />

      <main className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
        {/* Back navigation */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors duration-200 self-start group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
          {/* Submit form (left) */}
          <div className="lg:col-span-7 bg-bg-primary border border-border-tertiary rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-text-primary mb-1">Submit Prompt Template</h2>
            <p className="text-xs text-text-secondary mb-6">
              Share your favorite prompt templates with the developer community. Define placeholders in brackets like <code className="bg-bg-secondary px-1 py-0.5 rounded text-[var(--accent)] font-mono text-[10px]">&#123;&#123;variable&#125;&#125;</code> to make them interactive.
            </p>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/30 p-3.5 text-xs text-red-600 dark:text-red-400 flex gap-2">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {isSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-4 animate-fadeIn">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-50 text-green-500 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50">
                  <svg className="w-8 h-8 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Submission Successful!</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Your prompt was successfully registered. Redirecting to home...
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary">Prompt Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next.js Route Fetcher"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-border-tertiary bg-bg-page px-3.5 py-2.5 text-sm text-text-primary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary">Short Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Generates data fetching hooks for API endpoints"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-border-tertiary bg-bg-page px-3.5 py-2.5 text-sm text-text-primary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
                  />
                </div>

                {/* Category & Authors (Grid layout) */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-secondary">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-border-tertiary bg-bg-page px-3.5 py-2.5 text-sm text-text-primary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-secondary">Author Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full rounded-xl border border-border-tertiary bg-bg-page px-3.5 py-2.5 text-sm text-text-primary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary">Author Username</label>
                  <div className="relative flex items-center w-full">
                    <span className="absolute left-3.5 text-text-tertiary select-none text-sm font-medium">@</span>
                    <input
                      type="text"
                      required
                      placeholder="johndoe"
                      value={authorUsername}
                      onChange={(e) => {
                        const val = e.target.value;
                        const sanitized = val
                          .toLowerCase()
                          .replace(/[@\s]/g, "")
                          .replace(/[^a-z0-9_.-]/g, "");
                        setAuthorUsername(sanitized);
                      }}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-border-tertiary bg-bg-page text-sm text-text-primary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Prompt Template Content */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-secondary">Prompt Template Content</label>
                  <textarea
                    required
                    rows={6}
                    placeholder="e.g. Write a script in {{language}} to retrieve database listings matching a query related to {{search_topic}}..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full rounded-xl border border-border-tertiary bg-bg-page px-3.5 py-2.5 text-sm text-text-primary font-mono placeholder-text-tertiary focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all duration-200"
                  />
                  {/* Variables detection block */}
                  <div className="mt-1 flex flex-wrap gap-1.5 items-center min-h-[22px]">
                    <span className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider">Detected placeholders:</span>
                    {detectedVariables.length > 0 ? (
                      detectedVariables.map((variable) => (
                        <span
                          key={variable}
                          className="bg-accent-light text-[#0F6E56] dark:bg-accent-light/10 dark:text-[#9FE1CB] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border border-accent-light/20"
                        >
                          {variable}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-text-tertiary italic">None (Type double curly braces to add variable parameters)</span>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] hover:bg-accent-strong text-white text-sm font-semibold py-3 shadow-md shadow-[var(--accent)]/15 transition-all duration-200 cursor-pointer active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Submit Prompt</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Prompt card live preview (right) */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Card Preview
            </h4>
            <div className="border border-dashed border-border-secondary rounded-2xl p-4 bg-bg-secondary/20 min-h-[300px] flex items-center justify-center">
              <div className="w-full pointer-events-none opacity-85 select-none">
                <PromptCard prompt={previewPrompt} defaultExpanded={false} isDetailPage={false} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
