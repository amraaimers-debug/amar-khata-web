"use client";
import { useState } from "react";

export default function ShareButton({ title, url, className, style }) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareUrl = url || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: title || "আমার খাতা", url: shareUrl });
      } catch (e) {
        // ব্যবহারকারী শেয়ার বাতিল করলে কিছু করার দরকার নেই
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      prompt("লিংকটি কপি করুন:", shareUrl);
    }
  }

  return (
    <button onClick={handleShare} className={className} style={style}>
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
      </svg>
      {copied ? "লিংক কপি হয়েছে!" : "শেয়ার"}
    </button>
  );
}