"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setValue(searchParams.get("q") || "");
  }, [searchParams]);

  function handleChange(e) {
    const v = e.target.value;
    setValue(v);
    const params = new URLSearchParams(searchParams.toString());
    if (v) params.set("q", v); else params.delete("q");
    router.push(`/?${params.toString()}`, { scroll: false });
  }

  return (
    <div
      className="flex items-center gap-2 rounded-full border px-3 py-1.5"
      style={{ borderColor: "var(--line)", background: "var(--paper)" }}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--muted)" strokeWidth="2">
        <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
      </svg>
      <input
        value={value}
        onChange={handleChange}
        placeholder="শিরোনাম খুঁজুন..."
        className="text-sm outline-none bg-transparent w-36"
        style={{ color: "var(--ink)" }}
      />
    </div>
  );
}
