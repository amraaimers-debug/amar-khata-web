export const metadata = { title: "প্রাইভেসি পলিসি" };

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-display text-4xl mb-6">প্রাইভেসি পলিসি</h1>
      <div className="font-serif text-lg leading-loose" style={{ color: "var(--ink)" }}>
        <p className="mb-4">
          আমরা আমাদের পাঠকদের গোপনীয়তাকে গুরুত্ব দিই। এই পাতায় বলা হয়েছে এই সাইটে কী ধরনের তথ্য
          সংগ্রহ করা হয় এবং কীভাবে ব্যবহৃত হয়।
        </p>

        <h2 className="font-display text-2xl mt-6 mb-2">যা সংগ্রহ করা হয়</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>মন্তব্য করলে আপনার দেওয়া নাম ও মন্তব্যের লেখা সংরক্ষিত হয়।</li>
          <li>লাইক দিলে আপনার ব্রাউজারের জন্য তৈরি একটি বেনামী শনাক্তকারী (visitor ID) সংরক্ষিত হয়, যাতে একই লেখায় বারবার লাইক গোনা না হয়। এটি কোনো ব্যক্তিগত পরিচয় প্রকাশ করে না।</li>
          <li>থিম (লাইট/ডার্ক মোড) ও সংরক্ষিত লেখার তালিকা শুধু আপনার ব্রাউজারে (localStorage) থাকে, আমাদের সার্ভারে যায় না।</li>
        </ul>

        <h2 className="font-display text-2xl mt-6 mb-2">বিজ্ঞাপন ও কুকি</h2>
        <p className="mb-4">
          এই সাইটে Google AdSense-এর মাধ্যমে বিজ্ঞাপন দেখানো হতে পারে। Google এবং তার অংশীদাররা
          কুকি ব্যবহার করে আপনার আগ্রহ অনুযায়ী বিজ্ঞাপন দেখাতে পারে, যা আপনার এই ও অন্যান্য
          ওয়েবসাইট পরিদর্শনের ভিত্তিতে নির্ধারিত হয়। আপনি{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "var(--maroon)" }}
          >
            Google Ads Settings
          </a>{" "}
          পাতায় গিয়ে ব্যক্তিগতকৃত বিজ্ঞাপন বন্ধ করতে পারেন।
        </p>

        <h2 className="font-display text-2xl mt-6 mb-2">শিশুদের গোপনীয়তা</h2>
        <p className="mb-4">
          এই সাইট বিশেষভাবে শিশুদের জন্য তৈরি নয় এবং সচেতনভাবে ১৩ বছরের কম বয়সী কারও ব্যক্তিগত
          তথ্য সংগ্রহ করে না।
        </p>

        <h2 className="font-display text-2xl mt-6 mb-2">যোগাযোগ</h2>
        <p>
          এই নীতিমালা নিয়ে কোনো প্রশ্ন থাকলে{" "}
          <a href="/contact" className="underline" style={{ color: "var(--maroon)" }}>
            যোগাযোগ পাতা
          </a>{" "}
          দেখুন।
        </p>
      </div>
    </div>
  );
}