import "./globals.css";
import { Suspense } from "react";
import ThemeToggle from "./ThemeToggle";
import HeaderSearch from "./HeaderSearch";

export const metadata = {
  metadataBase: new URL("https://amar-khata-web-iota.vercel.app"),
  title: {
    default: "আমার খাতা — কবিতা ও গল্পের ঘর",
    template: "%s · আমার খাতা",
  },
  description: "কবিতা ও গল্পের একটি ব্যক্তিগত সংকলন",
  openGraph: {
    title: "আমার খাতা — কবিতা ও গল্পের ঘর",
    description: "কবিতা ও গল্পের একটি ব্যক্তিগত সংকলন",
    siteName: "আমার খাতা",
    locale: "bn_BD",
    type: "website",
  },
  alternates: {
    types: { "application/rss+xml": "/rss.xml" },
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9723894248966490"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="font-sans">
        <header
          className="sm:sticky sm:top-0 z-20"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--line)" }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <a href="/" className="flex items-center gap-2.5 min-w-0">
                <svg viewBox="0 0 40 40" width="32" height="32" fill="none" className="flex-none">
                  <rect x="1" y="1" width="38" height="38" rx="6" stroke="var(--maroon)" strokeWidth="1.4" />
                  <path
                    d="M20 12c-2.5-2.2-6-2.8-9-1.6v15.4c3-1.2 6.5-.6 9 1.6 2.5-2.2 6-2.8 9-1.6V10.4c-3-1.2-6.5-.6-9 1.6Z"
                    stroke="var(--gold)" strokeWidth="1.6"
                  />
                  <path d="M20 12v15.4" stroke="var(--gold)" strokeWidth="1.6" />
                </svg>
                <div className="min-w-0">
                  <div className="rgb-text font-display text-xl leading-snug">আমার খাতা</div>
                  <div className="text-[11px]" style={{ color: "var(--muted)" }}>সাহিত্য পোর্টাল</div>
                </div>
              </a>

              <div className="flex items-center gap-2 sm:gap-3 flex-none">
                <div className="hidden md:block">
                  <Suspense fallback={<div className="w-36 h-8" />}>
                    <HeaderSearch />
                  </Suspense>
                </div>
                <ThemeToggle />
                <a
                  href="/settings"
                  className="hidden sm:inline text-sm font-semibold hover:text-[var(--maroon)]"
                  title="প্রোফাইল ছবি বদলান"
                >
                  প্রোফাইল
                </a>
                <a
                  href="/publish"
                  className="rgb-glow text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 rounded whitespace-nowrap"
                  style={{ background: "var(--maroon)", color: "#fff" }}
                >
                  লেখক লগইন
                </a>
              </div>
            </div>

            <div className="md:hidden mt-3 [&_input]:w-full [&>div]:w-full">
              <Suspense fallback={<div className="h-9" />}>
                <HeaderSearch />
              </Suspense>
            </div>

            <nav className="no-scrollbar mt-3 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-5 text-sm font-semibold overflow-x-auto whitespace-nowrap">
              <a href="/" className="py-1.5 hover:text-[var(--maroon)]">হোম</a>
              <a href="/?type=কবিতা" className="py-1.5 hover:text-[var(--maroon)]">কবিতা</a>
              <a href="/?type=গল্প" className="py-1.5 hover:text-[var(--maroon)]">গল্প</a>
              <a href="/?type=দর্শন" className="py-1.5 hover:text-[var(--maroon)]">দর্শন</a>
              <a href="/?type=শায়েরি" className="py-1.5 hover:text-[var(--maroon)]">শায়েরি</a>
              <a href="/random" className="py-1.5 hover:text-[var(--maroon)]" title="এলোমেলো একটা লেখা পড়ুন">এলোমেলো লেখা</a>
              <a href="/settings" className="py-1.5 sm:hidden hover:text-[var(--maroon)]">প্রোফাইল</a>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>

        <footer style={{ borderTop: "1px solid var(--line)", background: "var(--surface)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-3 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-xs font-semibold">
            <a href="/about" className="hover:text-[var(--maroon)]" style={{ color: "var(--muted)" }}>সম্পর্কে</a>
            <a href="/privacy" className="hover:text-[var(--maroon)]" style={{ color: "var(--muted)" }}>প্রাইভেসি পলিসি</a>
            <a href="/contact" className="hover:text-[var(--maroon)]" style={{ color: "var(--muted)" }}>যোগাযোগ</a>
            <a href="/rss.xml" className="hover:text-[var(--maroon)]" style={{ color: "var(--muted)" }}>RSS ফিড</a>
          </div>
          <div
            className="max-w-5xl mx-auto px-4 sm:px-6 pb-6 text-center text-xs"
            style={{ color: "var(--muted)" }}
          >
            আমার খাতা © {new Date().getFullYear()} · সর্বস্বত্ব সংরক্ষিত। এখানে প্রকাশিত প্রতিটি লেখার অধিকার তার নিজ নিজ লেখকের।
          </div>
        </footer>
      </body>
    </html>
  );
}
