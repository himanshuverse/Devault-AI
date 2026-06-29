"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Sync component state with the document attribute after mounting
  useEffect(() => {
    const activeTheme = (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    setTheme(activeTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <div className="overflow-hidden rounded-[14px] border border-border-tertiary bg-bg-primary">
      <div className="flex items-center justify-between border-b border-border-tertiary bg-bg-secondary px-5 py-3.5">
        <Link href="/">
          <div className="text-[15px] font-black text-text-primary tracking-tight cursor-pointer">
            devault-ai
          </div>
        </Link>

        <div className="flex items-center gap-5">
          <Link href="/">
            <span className="cursor-pointer text-[13px] font-semibold text-text-secondary transition-colors duration-150 hover:text-text-primary">
              Browse
            </span>
          </Link>

          <Link href="/submit">
            <span className="cursor-pointer text-[13px] font-semibold text-text-secondary transition-colors duration-150 hover:text-text-primary">
              Submit
            </span>
          </Link>

          {/* Premium theme toggle switch */}
          <button
            onClick={toggleTheme}
            aria-label="toggle dark mode"
            className={`flex h-6 w-11 shrink-0 items-center rounded-full p-[3px] transition-colors duration-300 focus:outline-none cursor-pointer ${
              theme === "dark" ? "bg-[var(--accent)]" : "bg-gray-300"
            }`}
          >
            <span
              className={`flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-md transition-transform duration-300 ${
                theme === "dark" ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {theme === "dark" ? (
                // Moon SVG
                <svg className="h-2.5 w-2.5 text-[#0F6E56]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.5-.1 1 .2 1.1.7.2.5-.1 1.1-.6 1.3-3.6 1.4-5.7 5.1-5.7 9 0 4.4 3.6 8 8 8 3.9 0 7.6-2.1 9-5.7.2-.5.8-.8 1.3-.6.5.2.8.7.7 1.1-.9 4.7-5 8.2-9.8 8.2z" />
                </svg>
              ) : (
                // Sun SVG
                <svg className="h-2.5 w-2.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm-1.06-10.9c-.39-.39-.39-1.03 0-1.41a.996.996 0 001.41 0l1.06 1.06c.39.39.39 1.03 0 1.41a.996.996 0 00-1.41 0l-1.06-1.06zM5.64 18.01a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06z" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
