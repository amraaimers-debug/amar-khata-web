export const metadata = { title: "সম্পর্কে" };

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-4xl mb-6">সম্পর্কে</h1>
      <div className="font-serif text-lg leading-loose" style={{ color: "var(--ink)" }}>
        <p className="mb-4">
          <strong>আমার খাতা</strong> একটি ব্যক্তিগত সাহিত্য সংকলন — কবিতা, গল্প, দর্শন ও শায়েরির একটি
          ছোট্ট ঘর। এখানে যা কিছু প্রকাশিত হয়, তার সবটাই একজন ব্যক্তির নিজের লেখা, ফেসবুকের ভিড়
          থেকে সরিয়ে এনে একটা স্থায়ী ঠিকানায় রাখার চেষ্টা।
        </p>
        <p className="mb-4">
          পাঠকরা এখানে লেখা পড়তে, ভালো লাগলে লাইক দিতে এবং মন্তব্যের মাধ্যমে মতামত জানাতে পারেন।
          নতুন লেখা প্রকাশের অধিকার শুধু সাইটের লেখকের কাছেই সংরক্ষিত।
        </p>
        <p>
          কোনো লেখা নিয়ে মন্তব্য, পরামর্শ বা প্রশ্ন থাকলে <a href="/contact" className="underline" style={{ color: "var(--maroon)" }}>যোগাযোগ পাতা</a>-য় গিয়ে জানাতে পারেন।
        </p>
      </div>
    </div>
  );
}
