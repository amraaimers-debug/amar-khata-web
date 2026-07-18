"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, getVisitorId } from "../lib/supabase";
import ShareButton from "./ShareButton";
import { typeColorVar, ALL_TYPES } from "./typeColors";
import { stripMarkdown } from "./MarkdownText";

const avatarColors = ["#7C2233", "#2F5D50", "#B4872E", "#5A4A6B"];
function avatarColor(name) {
  let h = 0;
  for (const c of name || "?") h = (h * 31 + c.charCodeAt(0)) % avatarColors.length;
  return avatarColors[h];
}

export default function HomeClient({ initialPosts, recentComments, avatarUrl }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [posts, setPosts] = useState(initialPosts);
  const [view, setView] = useState("home"); // home | saved
  const [typeFilter, setTypeFilter] = useState(searchParams.get("type") || "সব");
  const [tag, setTag] = useState(null);
  const [saved, setSaved] = useState([]);
  const [likedIds, setLikedIds] = useState([]);

  useEffect(() => {
    setTypeFilter(searchParams.get("type") || "সব");
  }, [searchParams]);

  useEffect(() => {
    setSaved(JSON.parse(localStorage.getItem("amarkhata_saved") || "[]"));
    setLikedIds(JSON.parse(localStorage.getItem("amarkhata_liked") || "[]"));
  }, []);

  function toggleSave(id) {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("amarkhata_saved", JSON.stringify(next));
      return next;
    });
  }

  async function toggleLike(id) {
    const visitorId = getVisitorId();
    const isLiked = likedIds.includes(id);
    if (isLiked) {
      await supabase.from("likes").delete().eq("post_id", id).eq("visitor_id", visitorId);
      setLikedIds((p) => p.filter((x) => x !== id));
      setPosts((p) => p.map((x) => (x.id === id ? { ...x, likes_count: x.likes_count - 1 } : x)));
    } else {
      await supabase.from("likes").insert({ post_id: id, visitor_id: visitorId });
      setLikedIds((p) => {
        const next = [...p, id];
        localStorage.setItem("amarkhata_liked", JSON.stringify(next));
        return next;
      });
      setPosts((p) => p.map((x) => (x.id === id ? { ...x, likes_count: x.likes_count + 1 } : x)));
    }
  }

  const allTags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags || []))], [posts]);

  const visible = useMemo(() => {
    let arr = posts;
    if (view === "saved") arr = arr.filter((p) => saved.includes(p.id));
    if (typeFilter !== "সব") arr = arr.filter((p) => p.type === typeFilter);
    if (tag) arr = arr.filter((p) => (p.tags || []).includes(tag));
    if (query.trim()) arr = arr.filter((p) => p.title.toLowerCase().includes(query.trim().toLowerCase()));
    return arr;
  }, [posts, view, typeFilter, tag, query, saved]);

  const heroPost = [...posts].sort((a, b) => b.likes_count - a.likes_count)[0];
  const popular = [...posts].sort((a, b) => b.likes_count - a.likes_count).slice(0, 3);
  const totalLikes = posts.reduce((s, p) => s + (p.likes_count || 0), 0);
  const totalComments = recentComments ? undefined : 0;

  return (
    <div>
      {heroPost && view === "home" && !tag && typeFilter === "সব" && !query && (
        <div
          className="flex rounded-lg overflow-hidden mb-8"
          style={{ border: "1px solid var(--line)", background: "var(--surface)" }}
        >
          <div
            className="w-[190px] flex-none hidden sm:flex items-center justify-center"
            style={{ background: "linear-gradient(155deg, var(--maroon), #4a1420 75%)" }}
          >
            <svg viewBox="0 0 24 24" width="60" height="60" fill="none" stroke="#fff" strokeWidth="1.3">
              <path d="M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.4V19h8.6z" />
              <line x1="16" y1="8" x2="3" y2="21" /><line x1="17" y1="15" x2="9.5" y2="15" />
            </svg>
          </div>
          <div className="p-7">
            <div className="flex items-center gap-2 text-xs font-bold mb-3" style={{ color: "var(--maroon)" }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              সবচেয়ে ভালোবাসা পাওয়া লেখা
            </div>
            <a href={`/post/${heroPost.id}`} className="font-display text-3xl block mb-3 hover:text-[var(--maroon)]">
              {heroPost.title}
            </a>
            <p className="font-serif mb-3" style={{ color: "var(--ink)", opacity: 0.85 }}>
              {stripMarkdown((heroPost.content || "").split("\n")[0])}
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted)" }}>
              <span>{heroPost.author_name}</span><span>·</span>
              <span>❤ {heroPost.likes_count}</span>
            </div>
          </div>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold" style={{ color: "var(--muted)" }}>ট্যাগ:</span>
          {allTags.map((t) => (
            <button
              key={t}
              onClick={() => setTag(tag === t ? null : t)}
              className="text-xs px-3 py-1 rounded-full border"
              style={{
                borderColor: "var(--line)",
                background: tag === t ? "var(--gold)" : "var(--surface)",
                color: tag === t ? "#231A05" : "var(--ink)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-8 items-start flex-col md:flex-row">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <h2 className="font-display text-xl">
              {view === "saved" ? "সংরক্ষিত লেখা" : "সাম্প্রতিক লেখা"}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex flex-wrap rounded-full overflow-hidden border" style={{ borderColor: "var(--line)" }}>
                {["সব", ...ALL_TYPES].map((f) => (
                  <button
                    key={f}
                    onClick={() => setTypeFilter(f)}
                    className="text-xs font-semibold px-3 py-1.5"
                    style={{
                      background: typeFilter === f ? "var(--maroon)" : "transparent",
                      color: typeFilter === f ? "#fff" : "var(--muted)",
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setView(view === "saved" ? "home" : "saved")}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ borderColor: "var(--line)", color: "var(--muted)" }}
              >
                {view === "saved" ? "সব লেখা দেখুন" : `সংরক্ষিত (${saved.length})`}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {visible.length === 0 && (
              <div className="text-center py-14 rounded-lg border border-dashed" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
                কোনো লেখা পাওয়া যায়নি।
              </div>
            )}
            {visible.map((p) => {
              const catColor = typeColorVar(p.type);
              const isLiked = likedIds.includes(p.id);
              const isSaved = saved.includes(p.id);
              return (
                <article key={p.id} className="flex rounded-lg overflow-hidden shadow-sm" style={{ border: "1px solid var(--line)", background: "var(--surface)" }}>
                  <div className="w-1.5 flex-none" style={{ background: catColor }}></div>
                  <div className="p-5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs mb-2 flex-wrap" style={{ color: "var(--muted)" }}>
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={p.author_name} className="w-6 h-6 rounded-full object-cover flex-none" />
                      ) : (
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: avatarColor(p.author_name) }}>
                          {(p.author_name || "?")[0]}
                        </span>
                      )}
                      <span style={{ color: "var(--ink)" }}>{p.author_name}</span><span>·</span>
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `color-mix(in srgb, ${catColor} 16%, transparent)`, color: catColor }}
                      >
                        {p.type}
                      </span>
                    </div>
                    <a href={`/post/${p.id}`} className="font-display text-xl block mb-2 hover:text-[var(--maroon)]">{p.title}</a>
                    <p className="font-serif mb-3 whitespace-pre-line" style={{ color: "var(--ink)", opacity: 0.85 }}>
                      {stripMarkdown((p.content || "").split("\n").slice(0, 2).join("\n"))}
                    </p>
                    {p.tags?.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mb-3">
                        {p.tags.map((t) => (
                          <button key={t} onClick={() => setTag(t)} className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>#{t}</button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1 pt-3 border-t border-dashed" style={{ borderColor: "var(--line)" }}>
                      <button onClick={() => toggleLike(p.id)} className="text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5" style={{ color: isLiked ? "var(--maroon)" : "var(--muted)" }}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"><path d="M12 21s-7.5-4.6-10.2-9.1C.1 8.7 1.6 5 5.2 4.3c2.1-.4 4 .6 6.8 3.2 2.8-2.6 4.7-3.6 6.8-3.2 3.6.7 5.1 4.4 3.4 7.6C19.5 16.4 12 21 12 21Z"/></svg>
                        {p.likes_count}
                      </button>
                      <a href={`/post/${p.id}`} className="text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5" style={{ color: "var(--muted)" }}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                        মন্তব্য করুন
                      </a>
                      <button onClick={() => toggleSave(p.id)} className="text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5" style={{ color: isSaved ? "var(--gold)" : "var(--muted)" }}>
                        <svg viewBox="0 0 24 24" width="15" height="15" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7"><path d="M19 21 12 16l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                        {isSaved ? "সংরক্ষিত" : "সংরক্ষণ"}
                      </button>
                      <ShareButton
                        title={p.title}
                        url={typeof window !== "undefined" ? `${window.location.origin}/post/${p.id}` : undefined}
                        className="text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5"
                        style={{ color: "var(--muted)" }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="w-full md:w-[270px] flex-none flex flex-col gap-5">
          <div className="rounded-lg p-5" style={{ border: "1px solid var(--line)", background: "var(--surface)" }}>
            <div className="text-xs font-bold uppercase mb-3" style={{ color: "var(--muted)" }}>জনপ্রিয় লেখা</div>
            {popular.map((p, i) => (
              <a key={p.id} href={`/post/${p.id}`} className="flex items-baseline gap-2 py-2 border-b border-dotted last:border-none" style={{ borderColor: "var(--line)" }}>
                <span className="font-display text-lg" style={{ color: "var(--gold)" }}>{i + 1}</span>
                <span className="text-sm flex-1 hover:text-[var(--maroon)]">{p.title}</span>
                <span className="text-[11px]" style={{ color: "var(--muted)" }}>❤{p.likes_count}</span>
              </a>
            ))}
          </div>

          <div className="rounded-lg p-5" style={{ border: "1px solid var(--line)", background: "var(--surface)" }}>
            <div className="text-xs font-bold uppercase mb-3" style={{ color: "var(--muted)" }}>সাম্প্রতিক মন্তব্য</div>
            {(!recentComments || recentComments.length === 0) && (
              <p className="text-xs" style={{ color: "var(--muted)" }}>এখনো কোনো মন্তব্য নেই।</p>
            )}
            {recentComments?.map((c) => (
              <div key={c.id} className="text-sm py-2 border-b border-dotted last:border-none" style={{ borderColor: "var(--line)" }}>
                <b style={{ color: "var(--maroon)" }}>{c.name}</b>: {c.text}
                <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>"{c.posts?.title}"-এ</div>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-5 text-sm" style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--muted)" }}>
            মোট {posts.length}টি লেখা · {totalLikes} জনের ভালোবাসা
          </div>
        </aside>
      </div>
    </div>
  );
}