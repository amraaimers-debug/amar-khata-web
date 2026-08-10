import { supabase } from "../../lib/supabase";

const SITE_URL = "https://amar-khata-web-iota.vercel.app";

function escapeXml(str) {
  return (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const { data: posts } = await supabase
    .from("posts")
    .select("id,title,content,author_name,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (posts || [])
    .map((p) => {
      const link = `${SITE_URL}/post/${p.id}`;
      const desc = (p.content || "").split("\n")[0].slice(0, 200);
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
      <description><![CDATA[${desc}]]></description>
      <author>${escapeXml(p.author_name)}</author>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>আমার খাতা — কবিতা ও গল্পের ঘর</title>
    <link>${SITE_URL}</link>
    <description>কবিতা ও গল্পের একটি ব্যক্তিগত সংকলন</description>
    <language>bn</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}