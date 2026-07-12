"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthorControls({ postId }) {
  const [session, setSession] = useState(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  if (!session) return null; // পাঠক হিসেবে দেখলে কিছু দেখাবে না

  async function handleDelete() {
    if (!confirm("লেখাটি স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) { alert("মুছতে সমস্যা হয়েছে: " + error.message); return; }
    router.push("/");
  }

  return (
    <div className="flex items-center gap-3 mb-6 text-sm">
      <a
        href={`/publish?edit=${postId}`}
        className="px-3 py-1.5 rounded-full border font-semibold"
        style={{ borderColor: "var(--line)", color: "var(--ink)" }}
      >
        ✎ এডিট করুন
      </a>
      <button
        onClick={handleDelete}
        className="px-3 py-1.5 rounded-full border font-semibold"
        style={{ borderColor: "var(--maroon)", color: "var(--maroon)" }}
      >
        🗑 মুছে ফেলুন
      </button>
    </div>
  );
}
