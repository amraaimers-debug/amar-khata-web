import { supabase } from "../lib/supabase";
import { Suspense } from "react";
import HomeClient from "./HomeClient";

export const revalidate = 0;

export default async function HomePage() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: recentComments } = await supabase
    .from("comments")
    .select("*, posts(title)")
    .order("created_at", { ascending: false })
    .limit(4);

  const { data: settings } = await supabase.from("site_settings").select("avatar_url").eq("id", 1).single();

  if (error) {
    return (
      <p className="text-red-700">
        ডেটাবেজ থেকে লেখা আনতে সমস্যা হয়েছে। .env.local / Vercel Environment Variables ঠিকমতো বসানো
        আছে কিনা, আর supabase-schema.sql চালানো হয়েছে কিনা যাচাই করুন। ({error.message})
      </p>
    );
  }

  return (
    <Suspense fallback={<p style={{ color: "var(--muted)" }}>লোড হচ্ছে...</p>}>
      <HomeClient initialPosts={posts || []} recentComments={recentComments || []} avatarUrl={settings?.avatar_url || null} />
    </Suspense>
  );
}