import { supabase } from "../../../lib/supabase";
import PostInteractions from "./PostInteractions";
import AuthorControls from "./AuthorControls";

export default async function PostPage({ params }) {
  const { data: post } = await supabase.from("posts").select("*").eq("id", params.id).single();
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", params.id)
    .order("created_at", { ascending: false });

  if (!post) return <p>লেখাটি পাওয়া যায়নি।</p>;

  const catColor = post.type === "কবিতা" ? "var(--maroon)" : "var(--forest)";

  return (
    <article className="max-w-2xl mx-auto">
      <div
        className="text-xs font-bold inline-block px-2.5 py-1 rounded-full mb-4"
        style={{ background: `${catColor}1a`, color: catColor }}
      >
        {post.type}
      </div>
      <h1 className="font-display text-4xl mb-2">{post.title}</h1>
      <div className="text-sm mb-8" style={{ color: "var(--muted)" }}>{post.author_name}</div>
      <div
        className="font-serif text-lg leading-loose whitespace-pre-line mb-10"
        style={{ color: "var(--ink)" }}
      >
        {post.content}
      </div>
      <AuthorControls postId={post.id} />
      <PostInteractions post={post} initialComments={comments || []} />
    </article>
  );
}
