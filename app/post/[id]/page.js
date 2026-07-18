import { supabase } from "../../../lib/supabase";
import PostInteractions from "./PostInteractions";
import AuthorControls from "./AuthorControls";
import ShareButton from "../../ShareButton";
import MarkdownText from "../../MarkdownText";
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
      <MarkdownText
        text={post.content}
        className="font-serif text-lg leading-loose mb-10"
        style={{ color: "var(--ink)" }}
      />
      <div className="flex items-center gap-3 mb-2">
        <ShareButton
          title={post.title}
          className="px-3 py-1.5 rounded-full border font-semibold text-sm flex items-center gap-1.5"
          style={{ borderColor: "var(--line)", color: "var(--ink)" }}
        />
      </div>
      <AuthorControls postId={post.id} />
      <PostInteractions post={post} initialComments={comments || []} />
    </article>
  );
}