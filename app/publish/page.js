"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../lib/supabase";

function PublishForm() {
  const [session, setSession] = useState(undefined); // undefined = লোড হচ্ছে
  const [type, setType] = useState("কবিতা");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [penName, setPenName] = useState("");
  const [status, setStatus] = useState("");
  const [loadingPost, setLoadingPost] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    if (editId) {
      setLoadingPost(true);
      supabase.from("posts").select("*").eq("id", editId).single().then(({ data }) => {
        if (data) {
          setType(data.type);
          setTitle(data.title);
          setTags((data.tags || []).join(", "));
          setContent(data.content);
          setPenName(data.author_name);
        }
        setLoadingPost(false);
      });
    } else {
      const saved = localStorage.getItem("amarkhata_pen_name");
      setPenName(saved || session.user.email.split("@")[0]);
    }
  }, [session, editId]);

  if (session === undefined) return <p>লোড হচ্ছে...</p>;

  if (!session) {
    return (
      <div className="text-center">
        <p className="mb-4">লেখা প্রকাশ করতে হলে আগে লগইন করতে হবে।</p>
        <a href="/login" className="bg-maroon text-white px-5 py-2 rounded-md font-semibold">
          লগইন করুন
        </a>
      </div>
    );
  }

  async function handlePublish(e) {
    e.preventDefault();
    setStatus(editId ? "সংরক্ষণ করা হচ্ছে..." : "প্রকাশ করা হচ্ছে...");
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    const finalName = penName.trim() || session.user.email.split("@")[0];
    localStorage.setItem("amarkhata_pen_name", finalName);

    if (editId) {
      const { error } = await supabase
        .from("posts")
        .update({ title, type, content, tags: tagList, author_name: finalName })
        .eq("id", editId);
      if (error) { setStatus("সমস্যা হয়েছে: " + error.message); return; }
      router.push(`/post/${editId}`);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      title, type, content, tags: tagList, author_name: finalName,
    });
    if (error) { setStatus("সমস্যা হয়েছে: " + error.message); return; }
    setStatus("প্রকাশিত হয়েছে!");
    setTitle(""); setTags(""); setContent("");
    router.push("/");
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">{editId ? "লেখা এডিট করুন" : "নতুন লেখা প্রকাশ করুন"}</h1>
        <button onClick={() => supabase.auth.signOut()} className="text-sm text-black/50 underline">
          লগআউট
        </button>
      </div>
      {loadingPost ? (
        <p>লেখা লোড হচ্ছে...</p>
      ) : (
        <form onSubmit={handlePublish} className="flex flex-col gap-4">
          <input
            required value={penName} onChange={(e) => setPenName(e.target.value)}
            placeholder="আপনার নাম/ছদ্মনাম (লেখায় এটাই দেখানো হবে)" className="border border-black/20 rounded-md px-3 py-2"
          />
          <select value={type} onChange={(e) => setType(e.target.value)} className="border border-black/20 rounded-md px-3 py-2">
            <option value="কবিতা">কবিতা</option>
            <option value="গল্প">গল্প</option>
          </select>
          <input
            required value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="শিরোনাম" className="border border-black/20 rounded-md px-3 py-2"
          />
          <input
            value={tags} onChange={(e) => setTags(e.target.value)}
            placeholder="ট্যাগ (কমা দিয়ে আলাদা)" className="border border-black/20 rounded-md px-3 py-2"
          />
          <textarea
            required value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="লেখা..." rows={10}
            className="border border-black/20 rounded-md px-3 py-2 font-serif"
          />
          <div className="flex items-center gap-3">
            <button className="bg-maroon text-white rounded-md py-2 px-5 font-semibold">
              {editId ? "সংরক্ষণ করুন" : "প্রকাশ করুন"}
            </button>
            {editId && <a href={`/post/${editId}`} className="text-sm underline">বাতিল করুন</a>}
          </div>
          {status && <p className="text-sm text-black/60">{status}</p>}
        </form>
      )}
    </div>
  );
}

export default function PublishPage() {
  return (
    <Suspense fallback={<p>লোড হচ্ছে...</p>}>
      <PublishForm />
    </Suspense>
  );
}
