"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("লগইন ব্যর্থ হয়েছে। ইমেইল/পাসওয়ার্ড ঠিক আছে কিনা দেখুন।");
      return;
    }
    router.push("/publish");
  }

  return (
    <div className="max-w-sm mx-auto text-center">
      <h1 className="font-display text-3xl mb-2">লেখক লগইন</h1>
      <p className="text-sm text-black/60 mb-6">
        শুধু সাইটের মালিক হিসেবে আপনি এখান থেকে লগইন করে নতুন লেখা প্রকাশ করতে পারবেন।
      </p>
      <form onSubmit={handleLogin} className="flex flex-col gap-3 text-left">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ইমেইল"
          className="border border-black/20 rounded-md px-3 py-2"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="পাসওয়ার্ড"
          className="border border-black/20 rounded-md px-3 py-2"
        />
        {error && <p className="text-red-700 text-sm">{error}</p>}
        <button className="bg-maroon text-white rounded-md py-2 font-semibold">লগইন করুন</button>
      </form>
    </div>
  );
}