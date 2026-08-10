"use client";
import { useState } from "react";
import MarkdownText from "../../MarkdownText";

export default function ReadingControls({ content }) {
  const [fontSize, setFontSize] = useState(18);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs" style={{ color: "var(--muted)" }}>লেখার আকার:</span>
        <button
          onClick={() => setFontSize((s) => Math.max(14, s - 2))}
          className="w-7 h-7 rounded-full border text-xs font-bold flex items-center justify-center"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          aria-label="লেখা ছোট করুন"
        >
          অ-
        </button>
        <button
          onClick={() => setFontSize((s) => Math.min(28, s + 2))}
          className="w-7 h-7 rounded-full border text-sm font-bold flex items-center justify-center"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          aria-label="লেখা বড় করুন"
        >
          অ+
        </button>
      </div>
      <MarkdownText
        text={content}
        className="font-serif leading-loose mb-10"
        style={{ color: "var(--ink)", fontSize: `${fontSize}px`, transition: "font-size .15s ease" }}
      />
    </div>
  );
}