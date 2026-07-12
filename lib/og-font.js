// শেয়ার-প্রিভিউ ছবির জন্য বাংলা ফন্ট লোড করে (শুধু দরকারি অক্ষরগুলোই, দ্রুত হওয়ার জন্য)
export async function loadBengaliFont(text) {
  const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@700&text=${encodeURIComponent(
    text
  )}`;
  const css = await (
    await fetch(url, {
      headers: {
        // পুরনো ব্রাউজার সাজিয়ে পাঠালে Google .ttf ফাইল দেয় (নতুন ব্রাউজারে .woff2 দেয়, যেটা এখানে কাজ করে না)
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
      },
    })
  ).text();

  const match = css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error("ফন্ট খুঁজে পাওয়া যায়নি");

  const res = await fetch(match[1]);
  return await res.arrayBuffer();
}