import { ImageResponse } from "next/og";
import { loadBengaliFont } from "../lib/og-font";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const alt = "আমার খাতা — কবিতা ও গল্পের ঘর";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const title = "আমার খাতা";
  const subtitle = "কবিতা ও গল্পের একটি ব্যক্তিগত সংকলন";
  const fontData = await loadBengaliFont(title + subtitle);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(155deg, #7C2233, #2A0E14)",
          color: "#F7F1E2",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, marginBottom: 22 }}>{title}</div>
        <div style={{ fontSize: 32, opacity: 0.85 }}>{subtitle}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Noto Sans Bengali", data: fontData, style: "normal", weight: 700 }] }
  );
}