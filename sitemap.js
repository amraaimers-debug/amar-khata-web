import { supabase } from "../lib/supabase";

const baseUrl = "https://amar-khata-web-iota.vercel.app";

export default async function sitemap() {
  const { data: posts } = await supabase.from("posts").select("id, created_at");

  const postUrls = (posts || []).map((p) => ({
    url: `${baseUrl}/post/${p.id}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const staticUrls = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  return [...staticUrls, ...postUrls];
}
