"use client";
import { useEffect, useRef } from "react";

// AdSense অনুমোদন পাওয়ার পর ব্যবহারের জন্য প্রস্তুত করা কম্পোনেন্ট।
// Google-এর নীতিমালা মেনে: বিজ্ঞাপন স্পষ্টভাবে "বিজ্ঞাপন" লেবেল দেওয়া, বাটন/লিংকের
// থেকে পর্যাপ্ত দূরত্বে, নিজস্ব আলাদা বক্সে রাখা হয়েছে — যাতে ভুলবশত ক্লিক না হয়।
//
// ব্যবহার: <AdSlot slot="১২৩৪৫৬৭৮৯০" />
// slot না দিলে এটি কিছুই দেখাবে না (approval পাওয়ার আগে খালি বিজ্ঞাপন-বক্স
// দেখানো ভালো অভিজ্ঞতা না, তাই লুকানো থাকে)
export default function AdSlot({ slot, format = "auto" }) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // স্ক্রিপ্ট এখনো লোড না হলে চুপচাপ উপেক্ষা করা হচ্ছে
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className="my-2" style={{ minHeight: 100 }}>
      <div className="text-[10px] uppercase tracking-wide mb-1.5" style={{ color: "var(--muted)" }}>
        বিজ্ঞাপন
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9723894248966490"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
