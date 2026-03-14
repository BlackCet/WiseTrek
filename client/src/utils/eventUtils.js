export const classifyEvent = (event) => {
  const text = `${event.title} ${event.category || ""}`.toLowerCase();
  if (text.includes("music") || text.includes("concert") || text.includes("dj") || text.includes("live")) return "concert";
  if (text.includes("match") || text.includes("cricket") || text.includes("football") || text.includes("sports") || text.includes("cup") || text.includes("race")) return "sports";
  if (text.includes("food") || text.includes("feast") || text.includes("dining") || text.includes("culinary") || text.includes("drink") || text.includes("restaurant")) return "food";
  if (text.includes("fest") || text.includes("carnival") || text.includes("fair") || text.includes("gala") || text.includes("celebration")) return "festival";
  return "culture";
};

export const getCategoryStyles = (cat) => {
  const styles = {
    festival: { color: "from-pink-500 to-rose-500", emoji: "🎪" },
    concert: { color: "from-purple-500 to-indigo-500", emoji: "🎵" },
    sports: { color: "from-orange-500 to-red-500", emoji: "⚽" },
    culture: { color: "from-blue-500 to-cyan-500", emoji: "🎭" },
    food: { color: "from-green-500 to-emerald-500", emoji: "🍽️" },
  };
  return styles[cat] || { color: "from-gray-500 to-gray-600", emoji: "🎉" };
};