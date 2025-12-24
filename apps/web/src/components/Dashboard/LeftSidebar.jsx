import {
  Home,
  Hash,
  Bell,
  Mail,
  TrendingUp,
  Brain,
  Gamepad2,
  Award,
  Settings,
  LogOut,
  Flame,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";

export function LeftSidebar({ profile, onShowWrapped }) {
  const menuItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Hash, label: "Explore" },
    { icon: Bell, label: "Notifications" },
    { icon: Mail, label: "Messages" },
    { icon: TrendingUp, label: "Trending" },
    { icon: Brain, label: "Brain Teasers" },
    { icon: Gamepad2, label: "Games" },
    { icon: Award, label: "Levels & XP" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <aside className="fixed h-[calc(100vh-80px)] w-64 overflow-y-auto px-4 py-6 hidden lg:block">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-lg font-bold transition-all hover:bg-gray-100 ${
              item.active ? "text-[#00008B]" : "text-gray-500"
            }`}
          >
            <item.icon size={24} strokeWidth={item.active ? 3 : 2} />
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-to-br from-[#00008B] to-indigo-900 p-6 text-white shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="text-orange-400" size={20} />
            <span className="font-black uppercase tracking-tighter">
              {profile.streak} DAY STREAK
            </span>
          </div>
        </div>
        <div className="mb-2 flex items-center justify-between text-xs font-bold opacity-80">
          <span>LEVEL {profile.level}</span>
          <span>{profile.xp % 100}/100 XP</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${profile.xp % 100}%` }}
            className="h-full bg-yellow-400"
          />
        </div>
        <button
          onClick={onShowWrapped}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2 text-sm font-black uppercase text-[#00008B] transition-transform hover:scale-105"
        >
          <Sparkles size={16} />
          View Wrapped
        </button>
      </div>

      <div className="mt-auto pt-8">
        <div className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-black text-[#00008B]">
            {profile.name?.[0]}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="truncate font-black text-sm">{profile.name}</div>
            <div className="truncate text-xs font-bold text-gray-400">
              @{profile.username}
            </div>
          </div>
          <LogOut size={18} className="text-gray-400" />
        </div>
      </div>
    </aside>
  );
}
