import { Crown } from "lucide-react";

export function LevelBadge({ level }) {
  const getBadgeColor = (lvl) => {
    if (lvl >= 10) return "from-yellow-400 to-orange-500";
    if (lvl >= 5) return "from-purple-400 to-pink-500";
    return "from-blue-400 to-cyan-500";
  };

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${getBadgeColor(level)} px-2 py-0.5 text-[10px] font-black text-white shadow-sm`}
    >
      <Crown size={10} className="animate-bounce" />L{level}
    </div>
  );
}
