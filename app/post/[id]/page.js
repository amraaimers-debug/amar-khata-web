import { supabase } from "../../../lib/supabase";
import PostInteractions from "./PostInteractions";
import AuthorControls from "./AuthorControls";
import ReadingControls from "./ReadingControls";
import ShareButton from "../../ShareButton";
import { typeColorVar } from "../../typeColors";

export async function generateMetadata({ params }) {
  const { data: post } = await supabase
    .from("posts")
    .select("title, content, author_name")
    .eq("id", params.id)
    .single();

  if (!post) return { title: "লেখা পাওয়া যায়নি" };

  const description = (post.content || "").split("\n")[0].slice(0, 150);
  return {
    title: post.title,
    description,
    openGraph: { title: post.title, description },
  };
}

export default async function PostPage({ params }) {
  const { data: post } = await supabase.from("posts").select("*").eq("id", params.id).single();
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", params.id)
    .order("created_at", { ascending: false });

  if (!post) return <p>লেখাটি পাওয়া যায়নি।</p>;

  const { data: related } = await supabase
    .from("posts")
    .select("id,title,type,author_name")
    .eq("type", post.type)
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const catColor = typeColorVar(post.type);

  return (
    <article className="max-w-2xl mx-auto">
      <div
        className="text-xs font-bold inline-block px-2.5 py-1 rounded-full mb-4"
        style={{ background: `color-mix(in srgb, ${catColor} 16%, transparent)`, color: catColor }}
      >
        {post.type}
      </div>
      <h1 className="font-display text-4xl mb-2">{post.title}</h1>
      <div className="text-sm mb-8" style={{ color: "var(--muted)" }}>{post.author_name}</div>

      <ReadingControls content={post.content} />

      <div className="flex items-center gap-3 mb-2">
        <ShareButton
          title={post.title}
          className="px-3 py-1.5 rounded-full border font-semibold text-sm flex items-center gap-1.5"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        />
      </div>
      <AuthorControls postId={post.id} />
      <PostInteractions post={post} initialComments={comments || []} />

      {related && related.length > 0 && (
        <div className="mt-14 pt-8" style={{ borderTop: "1px solid var(--line)" }}>
          <h3 className="font-display text-2xl mb-4">সম্পর্কিত লেখা</h3>
          <div className="flex flex-col gap-3">
            {related.map((r) => (
              <a
                key={r.id}
                href={`/post/${r.id}`}
                className="block p-4 rounded-lg hover:opacity-80"
                style={{ border: "1px solid var(--line)", background: "var(--surface)" }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{r.type} · {r.author_name}</div>
                <div className="font-display text-lg">{r.title}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}