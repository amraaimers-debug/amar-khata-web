import { ImageResponse } from "next/og";
import { loadBengaliFont } from "../../../lib/og-font";
import { supabase } from "../../../lib/supabase";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { data: post } = await supabase
    .from("posts")
    .select("title,type,author_name")
    .eq("id", params.id)
    .single();

  const title = post?.title || "আমার খাতা";
  const author = post?.author_name || "";
  const type = post?.type || "কবিতা";
  const bg =
    type === "কবিতা"
      ? "linear-gradient(155deg, #7C2233, #2A0E14)"
      : "linear-gradient(155deg, #2F5D50, #12211D)";

  const fontData = await loadBengaliFont(title + author + type + "আমার খাতা");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: bg,
          color: "#F7F1E2",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.75, marginBottom: 22 }}>{type} · আমার খাতা</div>
        <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.2 }}>{title}</div>
        <div style={{ fontSize: 28, opacity: 0.8, marginTop: 32 }}>{author}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Noto Sans Bengali", data: fontData, style: "normal", weight: 700 }] }
  );
}