export const metadata = { title: "যোগাযোগ" };

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-4xl mb-6">যোগাযোগ</h1>
      <div className="font-serif text-lg leading-loose" style={{ color: "var(--ink)" }}>
        <p className="mb-4">
          কোনো লেখা সম্পর্কে মতামত জানাতে চাইলে সরাসরি সেই লেখার নিচে মন্তব্য করতে পারেন — সেটাই
          সবচেয়ে সহজ ও দ্রুত উপায়।
        </p>
        <p className="mb-4">
          অন্য যেকোনো প্রয়োজনে ইমেইল করতে পারেন:
          <br />
          <a href="mailto:contact@amarkhata.example.com" className="underline" style={{ color: "var(--maroon)" }}>
            contact@amarkhata.example.com
          </a>
        </p>
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          (এই ইমেইল ঠিকানাটি বসানোর জন্য একটা প্লেসহোল্ডার — আপনার আসল ইমেইল দিয়ে বদলে নিন)
        </p>
      </div>
    </div>
  );
}