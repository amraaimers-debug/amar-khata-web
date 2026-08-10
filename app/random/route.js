import { supabase } from "../../lib/supabase";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { data: posts } = await supabase.from("posts").select("id");

  if (!posts || posts.length === 0) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const randomPost = posts[Math.floor(Math.random() * posts.length)];
  return NextResponse.redirect(new URL(`/post/${randomPost.id}`, request.url));
}