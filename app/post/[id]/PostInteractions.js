"use client";
import { useState } from "react";
import { supabase, getVisitorId } from "../../../lib/supabase";

export default function PostInteractions({ post, initialComments }) {
  const [likes, setLikes] = useState(post.likes_count);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  async function toggleLike() {
    const visitorId = getVisitorId();
    if (!liked) {
      await supabase.from("likes").insert({ post_id: post.id, visitor_id: visitorId });
      setLikes((l) => l + 1);
      setLiked(true);
    } else {
      await supabase.from("likes").delete().eq("post_id", post.id).eq("visitor_id", visitorId);
      setLikes((l) => l - 1);
      setLiked(false);
    }
  }

  async function submitComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const finalName = name.trim() || "অতিথি পাঠক";
    const { data } = await supabase
      .from("comments")
      .insert({ post_id: post.id, name: finalName, text: text.trim() })
      .select()
      .single();
    if (data) setComments([data, ...comments]);
    setText("");
  }

  return (
    <div>
      <div className="flex items-center gap-3 pt-5 mb-8 border-t border-dashed" style={{ borderColor: "var(--line)" }}>
        <button
          onClick={toggleLike}
          className="px-4 py-2 rounded-full border text-sm font-semibold"
          style={
            liked
              ? { background: "var(--maroon)", color: "#fff", borderColor: "var(--maroon)" }
              : { borderColor: "var(--line)", color: "var(--ink)" }
          }
        >
          ♥ লাইক ({likes})
        </button>
      </div>

      <h3 className="font-display text-xl mb-4">মন্তব্য ({comments.length})</h3>
      <form onSubmit={submitComment} className="flex flex-col gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="আপনার নাম (না দিলে 'অতিথি পাঠক' দেখাবে)"
          className="rounded-md px-3 py-2 text-sm"
          style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
        />
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="আপনার মন্তব্য লিখুন..."
            className="flex-1 rounded-md px-3 py-2 text-sm"
            style={{ border: "1px solid var(--line)", background: "var(--surface)", color: "var(--ink)" }}
          />
          <button className="px-4 rounded-md text-sm font-semibold" style={{ background: "var(--ink)", color: "var(--paper)" }}>
            পাঠান
          </button>
        </div>
      </form>

      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-md px-3 py-2 text-sm" style={{ background: "var(--paper)" }}>
            <b style={{ color: "var(--maroon)" }}>{c.name}:</b> {c.text}
          </div>
        ))}
      </div>
    </div>
  );
}
