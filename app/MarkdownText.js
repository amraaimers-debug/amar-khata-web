// খুব হালকা মার্কডাউন সাপোর্ট — # হেডিং, ** বোল্ড **, * ইটালিক *
// প্রকাশ করার পেজের টুলবার এই সিনট্যাক্স বসিয়ে দেয়, এখানে সেটাকেই সুন্দর করে দেখানো হয়।

function inlineParse(text, keyPrefix) {
  const tokens = [];
  let remaining = text;
  const regex = /(\*\*.+?\*\*|\*.+?\*)/;
  let key = 0;
  while (remaining.length) {
    const match = regex.exec(remaining);
    if (!match) {
      tokens.push(remaining);
      break;
    }
    if (match.index > 0) tokens.push(remaining.slice(0, match.index));
    const token = match[0];
    if (token.startsWith("**")) {
      tokens.push(<strong key={`${keyPrefix}-${key++}`}>{token.slice(2, -2)}</strong>);
    } else {
      tokens.push(<em key={`${keyPrefix}-${key++}`}>{token.slice(1, -1)}</em>);
    }
    remaining = remaining.slice(match.index + token.length);
  }
  return tokens;
}

export default function MarkdownText({ text, className, style }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className={className} style={style}>
      {lines.map((line, i) => {
        if (line.trim() === "") return <div key={i} style={{ height: "0.9em" }} />;

        const h3 = /^###\s+(.*)/.exec(line);
        const h2 = /^##\s+(.*)/.exec(line);
        const h1 = /^#\s+(.*)/.exec(line);

        let Tag = "p";
        let content = line;
        if (h3) { Tag = "h3"; content = h3[1]; }
        else if (h2) { Tag = "h2"; content = h2[1]; }
        else if (h1) { Tag = "h1"; content = h1[1]; }

        const sizeClass =
          Tag === "h1" ? "font-display text-3xl mt-6 mb-2" :
          Tag === "h2" ? "font-display text-2xl mt-5 mb-2" :
          Tag === "h3" ? "font-display text-xl mt-4 mb-2" : "";

        return (
          <Tag key={i} className={sizeClass}>
            {inlineParse(content, i)}
          </Tag>
        );
      })}
    </div>
  );
}

// কার্ডের সংক্ষিপ্ত অংশ/হিরো সেকশনে # ** এসব চিহ্ন না দেখিয়ে সাদামাটা লেখা দেখানোর জন্য
export function stripMarkdown(text) {
  if (!text) return "";
  return text
    .replace(/^#{1,3}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1");
}
