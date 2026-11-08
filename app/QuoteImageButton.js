"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { stripMarkdown } from "./MarkdownText";

// ছবির মাপ: ১০৮০×১৩৫০ (ইনস্টাগ্রাম/ফেসবুকের জন্য ৪:৫ পোর্ট্রেট)
const W = 1080;
const H = 1350;
const PAD_X = 110;
const SITE_NAME = "আমার খাতা";
const SITE_HOST = "amar-khata-web-iota.vercel.app";

const TITLE_FONT = '"Tiro Bangla", "Noto Serif Bengali", serif';
const BODY_FONT = '"Noto Serif Bengali", "Tiro Bangla", serif';
const UI_FONT = '"Hind Siliguri", "Noto Serif Bengali", sans-serif';

const THEMES = {
  gold: { label: "রাতের সোনা", text: "#F3E8D6", muted: "#B9AC90", accent: "#D9A94E" },
  maroon: { label: "মেরুন", text: "#FBF1E3", muted: "#E3C7C0", accent: "#E8C27A" },
  cream: { label: "ক্রিম", text: "#241F18", muted: "#786F5E", accent: "#7C2233" },
  neon: { label: "নিয়ন", text: "#FFFFFF", muted: "#9FB2C8", accent: "#00D4FF" },
};

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function radial(ctx, cx, cy, r, color) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  g.addColorStop(0, color);
  g.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function paintBackground(ctx, key) {
  if (key === "maroon") {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#8A2539");
    g.addColorStop(1, "#2A0E14");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    radial(ctx, W / 2, 0, 900, "rgba(232,194,122,0.18)");
  } else if (key === "cream") {
    ctx.fillStyle = "#F7F1E2";
    ctx.fillRect(0, 0, W, H);
    radial(ctx, W / 2, 0, 950, "rgba(180,135,46,0.18)");
  } else if (key === "neon") {
    ctx.fillStyle = "#0A0A12";
    ctx.fillRect(0, 0, W, H);
    radial(ctx, 180, 150, 800, "rgba(122,0,255,0.30)");
    radial(ctx, W - 120, H - 120, 700, "rgba(0,212,255,0.18)");
  } else {
    ctx.fillStyle = "#15110D";
    ctx.fillRect(0, 0, W, H);
    radial(ctx, 220, 200, 900, "rgba(217,169,78,0.30)");
    radial(ctx, W - 100, H - 80, 700, "rgba(193,89,74,0.18)");
  }
}

function paintFrame(ctx, key, t) {
  const inset = 44;
  ctx.save();
  if (key === "neon") {
    const g = ctx.createLinearGradient(0, 0, W, H);
    ["#ff0040", "#ff8a00", "#ffe600", "#00ff6a", "#00d4ff", "#7a00ff", "#ff00c8"].forEach((c, i, a) =>
      g.addColorStop(i / (a.length - 1), c)
    );
    ctx.strokeStyle = g;
    ctx.lineWidth = 8;
    ctx.shadowColor = "rgba(0,212,255,0.8)";
    ctx.shadowBlur = 26;
    roundRectPath(ctx, inset, inset, W - inset * 2, H - inset * 2, 34);
    ctx.stroke();
  } else {
    ctx.strokeStyle = t.accent;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    roundRectPath(ctx, inset, inset, W - inset * 2, H - inset * 2, 6);
    ctx.stroke();
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    roundRectPath(ctx, inset + 18, inset + 18, W - (inset + 18) * 2, H - (inset + 18) * 2, 4);
    ctx.stroke();
  }
  ctx.restore();
}

// শব্দ ধরে লাইন ভাঙা; ফাঁকা লাইন = স্তবকের বিরতি
function wrapLines(ctx, text, maxWidth) {
  const out = [];
  for (const para of (text || "").split("\n")) {
    if (!para.trim()) {
      if (out.length && out[out.length - 1] !== "") out.push("");
      continue;
    }
    const words = para.trim().split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (!line || ctx.measureText(test).width <= maxWidth) line = test;
      else {
        out.push(line);
        line = w;
      }
    }
    if (line) out.push(line);
  }
  while (out.length && out[out.length - 1] === "") out.pop();
  while (out.length && out[0] === "") out.shift();
  return out;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function ensureFonts(sample) {
  if (typeof document === "undefined" || !document.fonts) return;
  const s = (sample || "").slice(0, 300);
  try {
    await Promise.all([
      document.fonts.load('400 40px "Noto Serif Bengali"', s),
      document.fonts.load('400 40px "Tiro Bangla"', s),
      document.fonts.load('600 40px "Hind Siliguri"', s),
    ]);
  } catch (e) {
    // ফন্ট না এলেও ফলব্যাক ফন্টে আঁকা চলবে
  }
}

function drawCard(canvas, o) {
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const t = THEMES[o.themeKey] || THEMES.gold;

  paintBackground(ctx, o.themeKey);
  paintFrame(ctx, o.themeKey, t);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // জনরার লেবেল
  const type = o.type || "";
  ctx.font = `600 30px ${UI_FONT}`;
  ctx.fillStyle = t.accent;
  ctx.fillText(type, W / 2, 150);
  const lw = ctx.measureText(type).width;
  ctx.save();
  ctx.strokeStyle = t.accent;
  ctx.globalAlpha = 0.6;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - lw / 2 - 90, 150);
  ctx.lineTo(W / 2 - lw / 2 - 26, 150);
  ctx.moveTo(W / 2 + lw / 2 + 26, 150);
  ctx.lineTo(W / 2 + lw / 2 + 90, 150);
  ctx.stroke();
  ctx.restore();

  // শিরোনাম (সর্বোচ্চ ২ লাইন)
  const maxW = W - PAD_X * 2;
  ctx.font = `400 58px ${TITLE_FONT}`;
  ctx.fillStyle = t.text;
  let tl = wrapLines(ctx, o.title || "", maxW);
  if (tl.length > 2) {
    tl = tl.slice(0, 2);
    tl[1] = tl[1] + " …";
  }
  tl.forEach((l, i) => ctx.fillText(l, W / 2, 235 + i * 78));
  const titleBottom = 235 + (Math.max(tl.length, 1) - 1) * 78 + 40;

  // ছোট অলংকরণ
  const oy = titleBottom + 36;
  ctx.save();
  ctx.strokeStyle = t.accent;
  ctx.fillStyle = t.accent;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 110, oy);
  ctx.lineTo(W / 2 - 18, oy);
  ctx.moveTo(W / 2 + 18, oy);
  ctx.lineTo(W / 2 + 110, oy);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2, oy - 8);
  ctx.lineTo(W / 2 + 8, oy);
  ctx.lineTo(W / 2, oy + 8);
  ctx.lineTo(W / 2 - 8, oy);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // মূল লেখা — জায়গা অনুযায়ী ফন্টের সাইজ নিজে থেকে ছোট-বড় হবে
  const bodyTop = oy + 50;
  const bodyBottom = 1068;
  const availH = bodyBottom - bodyTop;
  let chosen = null;
  const srcLineCount = (o.text || "").split("\n").filter((l) => l.trim()).length;
  for (let size = 66; size >= 38; size -= 2) {
    ctx.font = `400 ${size}px ${BODY_FONT}`;
    const lines = wrapLines(ctx, o.text, maxW);
    const lineH = size * 1.75;
    const blankH = size * 0.8;
    const total = lines.reduce((h, l) => h + (l === "" ? blankH : lineH), 0);
    const noWrap = lines.filter((l) => l !== "").length === srcLineCount;
    if (noWrap && total <= availH) {
      chosen = { size, lines, lineH, blankH, total };
      break;
    }
  }
  for (let size = 56; !chosen && size >= 30; size -= 2) {
    ctx.font = `400 ${size}px ${BODY_FONT}`;
    const lines = wrapLines(ctx, o.text, maxW);
    const lineH = size * 1.75;
    const blankH = size * 0.8;
    const total = lines.reduce((h, l) => h + (l === "" ? blankH : lineH), 0);
    if (total <= availH) {
      chosen = { size, lines, lineH, blankH, total };
      break;
    }
  }
  if (!chosen) {
    const size = 30;
    ctx.font = `400 ${size}px ${BODY_FONT}`;
    const lines = wrapLines(ctx, o.text, maxW);
    const lineH = size * 1.75;
    const blankH = size * 0.8;
    const calc = (ls) => ls.reduce((h, l) => h + (l === "" ? blankH : lineH), 0);
    while (lines.length > 1 && calc(lines) > availH) lines.pop();
    while (lines.length && lines[lines.length - 1] === "") lines.pop();
    if (lines.length) lines[lines.length - 1] = lines[lines.length - 1].replace(/[\s,।.!?]+$/, "") + " …";
    chosen = { size, lines, lineH, blankH, total: calc(lines) };
  }
  ctx.font = `400 ${chosen.size}px ${BODY_FONT}`;
  ctx.fillStyle = t.text;
  let y = bodyTop + (availH - chosen.total) / 2;
  for (const l of chosen.lines) {
    if (l === "") {
      y += chosen.blankH;
      continue;
    }
    ctx.fillText(l, W / 2, y + chosen.lineH / 2);
    y += chosen.lineH;
  }

  // বিভাজক রেখা
  ctx.save();
  ctx.strokeStyle = t.accent;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 160, 1100);
  ctx.lineTo(W / 2 + 160, 1100);
  ctx.stroke();
  ctx.restore();

  // লেখকের ছবি + নাম
  const AV = 108;
  const cy = 1186;
  const name = o.author || "";
  ctx.textAlign = "left";
  ctx.font = `600 40px ${UI_FONT}`;
  const nameW = ctx.measureText(name).width;
  ctx.font = `400 28px ${UI_FONT}`;
  const subW = ctx.measureText(SITE_NAME).width;
  const groupW = AV + 28 + Math.max(nameW, subW);
  const sx = (W - groupW) / 2;
  const cx = sx + AV / 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, AV / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if (o.avatarImg) {
    const iw = o.avatarImg.width;
    const ih = o.avatarImg.height;
    const s = Math.min(iw, ih);
    ctx.drawImage(o.avatarImg, (iw - s) / 2, (ih - s) / 2, s, s, cx - AV / 2, cy - AV / 2, AV, AV);
  } else {
    ctx.fillStyle = t.accent;
    ctx.fillRect(cx - AV / 2, cy - AV / 2, AV, AV);
    ctx.fillStyle = o.themeKey === "cream" ? "#FFFFFF" : "#15110D";
    ctx.textAlign = "center";
    ctx.font = `700 54px ${UI_FONT}`;
    ctx.fillText((name || "?")[0], cx, cy + 2);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = t.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, AV / 2, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  const tx = sx + AV + 28;
  ctx.textAlign = "left";
  ctx.fillStyle = t.text;
  ctx.font = `600 40px ${UI_FONT}`;
  ctx.fillText(name, tx, cy - 16);
  ctx.fillStyle = t.muted;
  ctx.font = `400 28px ${UI_FONT}`;
  ctx.fillText(SITE_NAME, tx, cy + 28);

  // সাইটের ঠিকানা
  ctx.textAlign = "center";
  ctx.save();
  ctx.globalAlpha = 0.8;
  ctx.fillStyle = t.muted;
  ctx.font = `400 22px ${UI_FONT}`;
  ctx.fillText(SITE_HOST, W / 2, 1264);
  ctx.restore();
}

export default function QuoteImageButton({
  postId,
  title,
  author,
  type,
  content,
  avatarUrl,
  compact = false,
  className,
  style,
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [themeKey, setThemeKey] = useState("gold");
  const initialText = useMemo(
    () => stripMarkdown(content || "").replace(/\n{3,}/g, "\n\n").trim(),
    [content]
  );
  const [text, setText] = useState(initialText);
  const [imgUrl, setImgUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const canvasRef = useRef(null);
  const avatarRef = useRef(undefined); // undefined = এখনো চেষ্টা হয়নি, null = ছবি লোড হয়নি

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setBusy(true);
    setNote("");
    const timer = setTimeout(async () => {
      try {
        await ensureFonts(`${title} ${author} ${text}`);
        if (avatarRef.current === undefined) {
          avatarRef.current = avatarUrl ? await loadImage(avatarUrl) : null;
        }
        if (cancelled) return;
        if (!canvasRef.current) canvasRef.current = document.createElement("canvas");
        drawCard(canvasRef.current, {
          themeKey,
          title,
          author,
          type,
          text,
          avatarImg: avatarRef.current,
        });
        setImgUrl(canvasRef.current.toDataURL("image/png"));
      } catch (e) {
        setNote("ছবি বানাতে সমস্যা হয়েছে, আবার চেষ্টা করুন।");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, themeKey, text, title, author, type, avatarUrl]);

  function getBlob() {
    return new Promise((resolve) => canvasRef.current.toBlob(resolve, "image/png"));
  }

  async function handleDownload() {
    if (!canvasRef.current) return;
    const blob = await getBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `amar-khata-${postId}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    setNote("ছবিটা ডাউনলোড হয়েছে — গ্যালারি/ডাউনলোড ফোল্ডারে দেখুন।");
  }

  async function handleShare() {
    if (!canvasRef.current) return;
    const blob = await getBlob();
    const file = new File([blob], `amar-khata-${postId}.png`, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title });
      } catch (e) {
        // শেয়ার বাতিল করলে কিছু করার নেই
      }
    } else {
      await handleDownload();
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={() => setOpen(false)}
    >
      <div className="min-h-full flex items-center justify-center p-4">
        <div
          className="w-full max-w-4xl rounded-xl p-5 sm:p-6"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--ink)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className="font-display text-2xl">লেখাটির ছবি বানান</h3>
              <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                ছবিটা ফোনে সেভ করুন বা সরাসরি ফেসবুক/ইনস্টাগ্রামে শেয়ার করুন
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="বন্ধ করুন"
              className="w-9 h-9 rounded-full border flex items-center justify-center flex-none"
              style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            >
              ✕
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div
                className="flex items-center justify-center rounded-lg p-3"
                style={{ background: "var(--paper)", border: "1px solid var(--line)", minHeight: 240 }}
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt="লেখার ছবি"
                    style={{
                      maxHeight: "62vh",
                      maxWidth: "100%",
                      width: "auto",
                      height: "auto",
                      borderRadius: 6,
                      opacity: busy ? 0.5 : 1,
                      transition: "opacity .2s",
                    }}
                  />
                ) : (
                  <span className="text-sm" style={{ color: "var(--muted)" }}>ছবি তৈরি হচ্ছে…</span>
                )}
              </div>
              <p className="text-[11px] mt-2" style={{ color: "var(--muted)" }}>
                সেভ বাটন কাজ না করলে ছবিটা চেপে ধরে (long-press) “Save image / ছবি সংরক্ষণ” বেছে নিন।
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>ডিজাইন</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(THEMES).map(([key, th]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setThemeKey(key)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 border"
                      style={{
                        borderColor: themeKey === key ? "var(--gold)" : "var(--line)",
                        background: themeKey === key ? "color-mix(in srgb, var(--gold) 16%, transparent)" : "transparent",
                        color: "var(--ink)",
                      }}
                    >
                      <span className="w-3 h-3 rounded-full" style={{ background: th.accent }} />
                      {th.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold mb-2" style={{ color: "var(--muted)" }}>
                  ছবিতে যে অংশটুকু থাকবে (চাইলে বদলান বা ছোট করুন)
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="w-full rounded-md px-3 py-2 text-sm font-serif"
                  style={{ border: "1px solid var(--line)", background: "var(--paper)", color: "var(--ink)" }}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!imgUrl || busy}
                  className="px-5 py-2 rounded-md text-sm font-semibold"
                  style={{ background: "var(--maroon)", color: "#fff", opacity: !imgUrl || busy ? 0.6 : 1 }}
                >
                  ছবি সেভ করুন
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={!imgUrl || busy}
                  className="px-5 py-2 rounded-md text-sm font-semibold border"
                  style={{ borderColor: "var(--line)", color: "var(--ink)", opacity: !imgUrl || busy ? 0.6 : 1 }}
                >
                  শেয়ার করুন
                </button>
              </div>
              {note && <p className="text-xs" style={{ color: "var(--muted)" }}>{note}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
        style={style}
        title="লেখার ছবি বানান (ফোনে সেভ/শেয়ার)"
      >
        <svg
          viewBox="0 0 24 24"
          width={compact ? 14 : 15}
          height={compact ? 14 : 15}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        {!compact && "ছবি বানান"}
      </button>
      {open && mounted && createPortal(modal, document.body)}
    </>
  );
}
