// প্রতিটা জনরার জন্য একটা রঙ — নতুন জনরা যোগ করলে শুধু এখানে একটা লাইন বাড়ালেই হবে
export function typeColorVar(type) {
  switch (type) {
    case "কবিতা":
      return "var(--maroon)";
    case "গল্প":
      return "var(--forest)";
    case "দর্শন":
      return "var(--indigo)";
    case "শায়েরি":
      return "var(--gold)";
    default:
      return "var(--maroon)";
  }
}

// প্রতিটা জনরার জন্য একটা ছোট আইকন (শুধু রঙ না, আকৃতি দিয়েও আলাদা বোঝানোর জন্য)
export function typeIconPath(type) {
  switch (type) {
    case "কবিতা": // পালক/কলম
      return "M20.2 12.2a6 6 0 0 0-8.5-8.5L5 10.4V19h8.6z M16 8 3 21 M17 15 9.5 15";
    case "গল্প": // খোলা বই
      return "M4 6c3-2 7-2 8 0 1-2 5-2 8 0v13c-3-2-7-2-8 0-1-2-5-2-8 0Z M12 6v13";
    case "দর্শন": // বাতি/উপলব্ধি
      return "M12 3a6 6 0 0 0-3.6 10.8c.5.4.8 1 .8 1.7v1h5.6v-1c0-.7.3-1.3.8-1.7A6 6 0 0 0 12 3Z M10 19.5h4 M10.5 21.5h3";
    case "শায়েরি": // অর্ধচন্দ্র
      return "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z";
    default:
      return "M12 2 14.5 9 22 9 16 13.5 18 21 12 16.5 6 21 8 13.5 2 9 9.5 9 Z";
  }
}

export const ALL_TYPES = ["কবিতা", "গল্প", "দর্শন", "শায়েরি"];
