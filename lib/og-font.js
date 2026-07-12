// শেয়ার-প্রিভিউ ছবির জন্য বাংলা ফন্ট লোড করে। ব্যর্থ হলে এরর না ছুঁড়ে null রিটার্ন করে,
// যাতে ছবি বানানোর পুরো প্রক্রিয়া ৫০০ এরর না দিয়ে বরং একটা ফলব্যাক ছবি দেখাতে পারে।
export async function loadBengaliFont(text) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@700&text=${encodeURIComponent(
      text
    )}`;
    const cssRes = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
      },
    });
    if (!cssRes.ok) return null;
    const css = await cssRes.text();

    const match =
      css.match(/src: url\(([^)]+)\) format\('(opentype|truetype)'\)/) ||
      css.match(/url\((https:[^)]+\.ttf)\)/);
    if (!match) return null;

    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch (e) {
    return null;
  }
}