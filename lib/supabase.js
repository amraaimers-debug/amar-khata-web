import { createClient } from "@supabase/supabase-js";

// এই দুটো ভ্যালু .env.local ফাইলে বসবে (README দেখুন)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// প্রতিটা ব্রাউজারের জন্য একটা র‍্যান্ডম আইডি — লাইক ডুপ্লিকেট ঠেকাতে ব্যবহার হয়
export function getVisitorId() {
  if (typeof window === "undefined") return "server";
  let id = localStorage.getItem("amarkhata_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("amarkhata_visitor_id", id);
  }
  return id;
}
