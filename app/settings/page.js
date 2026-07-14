"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SettingsPage() {
  const [session, setSession] = useState(undefined);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

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

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setStatus("আপলোড হচ্ছে...");

    const fileExt = file.name.split(".").pop();
    const filePath = `avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, {
      upsert: true,
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
    setStatus("সফলভাবে আপডেট হয়েছে! হোমপেজে গিয়ে দেখুন।");
    setUploading(false);
  }

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
        style={{ background: "var(--maroon)", color: "#fff", opacity: uploading ? 0.6 : 1 }}
      >
        {uploading ? "আপলোড হচ্ছে..." : "নতুন ছবি বাছাই করুন"}
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
      </label>

      {status && <p className="text-sm mt-4" style={{ color: "var(--muted)" }}>{status}</p>}
    </div>
  );
}