"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabase";

const PREVIEW = 280; // ক্রপ প্রিভিউ বক্সের সাইজ (px)
const OUTPUT = 500; // চূড়ান্ত সংরক্ষিত ছবির সাইজ (px)

export default function SettingsPage() {
  const [session, setSession] = useState(undefined);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  // ক্রপার স্টেট
  const [pickedImage, setPickedImage] = useState(null); // HTMLImageElement
  const [baseScale, setBaseScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragState = useRef(null);
  const boxRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  useEffect(() => {
    supabase.from("site_settings").select("avatar_url").eq("id", 1).single().then(({ data }) => {
      if (data) setAvatarUrl(data.avatar_url);
    });
  }, []);

  if (session === undefined) return <p>লোড হচ্ছে...</p>;

  if (!session) {
    return (
      <div className="text-center">
        <p className="mb-4">এই পেজ দেখতে হলে আগে লগইন করতে হবে।</p>
        <a href="/login" className="bg-maroon text-white px-5 py-2 rounded-md font-semibold">
          লগইন করুন
        </a>
      </div>
    );
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const bs = Math.max(PREVIEW / img.width, PREVIEW / img.height);
      setBaseScale(bs);
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setPickedImage(img);
    };
    img.src = URL.createObjectURL(file);
  }

  function onPointerDown(e) {
    dragState.current = { startX: e.clientX, startY: e.clientY, origin: { ...offset } };
    boxRef.current?.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e) {
    if (!dragState.current) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    setOffset({ x: dragState.current.origin.x + dx, y: dragState.current.origin.y + dy });
  }
  function onPointerUp() {
    dragState.current = null;
  }

  function cancelCrop() {
    setPickedImage(null);
  }

  async function confirmCropAndUpload() {
    const img = pickedImage;
    if (!img) return;

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");

    const ratio = OUTPUT / PREVIEW;
    const drawScale = baseScale * zoom * ratio;
    const drawW = img.width * drawScale;
    const drawH = img.height * drawScale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(OUTPUT / 2, OUTPUT / 2, OUTPUT / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.translate(OUTPUT / 2 + offset.x * ratio, OUTPUT / 2 + offset.y * ratio);
    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    setUploading(true);
    setStatus("আপলোড হচ্ছে...");

    canvas.toBlob(async (blob) => {
      const filePath = `avatar-${Date.now()}.png`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, blob, {
        upsert: true,
        contentType: "image/png",
      });
      if (uploadError) {
        setStatus("আপলোডে সমস্যা হয়েছে: " + uploadError.message);
        setUploading(false);
        return;
      }
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      const { error: updateError } = await supabase
        .from("site_settings")
        .update({ avatar_url: publicUrl })
        .eq("id", 1);
      if (updateError) {
        setStatus("সংরক্ষণে সমস্যা হয়েছে: " + updateError.message);
        setUploading(false);
        return;
      }
      setAvatarUrl(publicUrl);
      setStatus("সফলভাবে আপডেট হয়েছে!");
      setUploading(false);
      setPickedImage(null);
    }, "image/png");
  }

  // --- ক্রপার UI ---
  if (pickedImage) {
    const drawW = pickedImage.width * baseScale * zoom;
    const drawH = pickedImage.height * baseScale * zoom;
    return (
      <div className="max-w-sm mx-auto text-center">
        <h1 className="font-display text-3xl mb-4">ছবি সমন্বয় করুন</h1>
        <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>
          টেনে (drag) ছবিটা সরান, নিচের স্লাইডার দিয়ে জুম করুন
        </p>
        <div
          ref={boxRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          style={{
            width: PREVIEW,
            height: PREVIEW,
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto",
            position: "relative",
            cursor: "grab",
            border: "2px solid var(--line)",
            touchAction: "none",
            background: "#00000010",
          }}
        >
          <img
            src={pickedImage.src}
            alt="ক্রপ প্রিভিউ"
            draggable={false}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: drawW,
              height: drawH,
              transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px)`,
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>

        <div className="flex items-center gap-3 mt-5 max-w-[240px] mx-auto">
          <span className="text-xs" style={{ color: "var(--muted)" }}>জুম</span>
          <input
            type="range" min="1" max="3" step="0.05" value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1"
          />
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={cancelCrop}
            className="px-5 py-2 rounded-md font-semibold border"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
          >
            বাতিল
          </button>
          <button
            onClick={confirmCropAndUpload}
            disabled={uploading}
            className="px-5 py-2 rounded-md font-semibold"
            style={{ background: "var(--maroon)", color: "#fff", opacity: uploading ? 0.6 : 1 }}
          >
            {uploading ? "আপলোড হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
        {status && <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>{status}</p>}
      </div>
    );
  }

  // --- সাধারণ প্রোফাইল ভিউ ---
  return (
    <div className="max-w-sm mx-auto text-center">
      <h1 className="font-display text-3xl mb-6">প্রোফাইল ছবি</h1>

      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="আপনার প্রোফাইল ছবি"
          className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border"
          style={{ borderColor: "var(--line)" }}
        />
      ) : (
        <div
          className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-display text-white"
          style={{ background: "var(--maroon)" }}
        >
          আ
        </div>
      )}

      <label
        className="inline-block px-5 py-2 rounded-md font-semibold cursor-pointer"
        style={{ background: "var(--maroon)", color: "#fff" }}
      >
        নতুন ছবি বাছাই করুন
        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      </label>

      {status && <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>{status}</p>}
    </div>
  );
}