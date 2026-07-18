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

export const ALL_TYPES = ["কবিতা", "গল্প", "দর্শন", "শায়েরি"];