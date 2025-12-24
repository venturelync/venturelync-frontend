import { motion } from "motion/react";
import {
  User,
  Zap,
  Flame,
  Home,
  Search,
  Users,
  Settings,
  LogOut,
  Compass,
  Award,
  ChevronRight,
  Linkedin,
  Twitter,
  Globe,
} from "lucide-react";

export function LeftPanel({ profile }) {
  const nextLevelXp = profile.level * 100;
  const xpProgress = profile.xp % 100;

  // Era Logic
  const getEra = (xp) => {
    if (xp < 1000)
      return {
        name: "Idea Era",
        color: "bg-blue-500",
        progress: (xp / 1000) * 100,
      };
    if (xp < 5000)
      return {
        name: "Build Era",
        color: "bg-purple-500",
        progress: ((xp - 1000) / 4000) * 100,
      };
    if (xp < 15000)
      return {
        name: "Launch Era",
        color: "bg-orange-500",
        progress: ((xp - 5000) / 10000) * 100,
      };
    return { name: "Scale Era", color: "bg-green-500", progress: 100 };
  };

  const era = getEra(profile.xp);

  // Determine current page
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const navItems = [
    {
      icon: Home,
      label: "Home",
      active: currentPath === "/dashboard",
      href: "/dashboard",
    },
    {
      icon: User,
      label: "Profile",
      active: currentPath === "/profile",
      href: "/profile",
    },
    { icon: Search, label: "Search", active: false, href: "/dashboard" },
    { icon: Compass, label: "Connect", active: false, href: "/dashboard" },
    { icon: Users, label: "Groups", active: false, href: "/dashboard" },
    { icon: Settings, label: "Settings", active: false, href: "/dashboard" },
  ];

  return (
    <div className="space-y-6">
      {/* User Identity Card */}
      <div className="overflow-hidden rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 overflow-hidden rounded-2xl bg-gray-100 border-2 border-white shadow-sm">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600">
                <User size={32} />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight">
              {profile.name}
            </h2>
            <p className="text-sm font-bold text-gray-400">
              @{profile.username}
            </p>
          </div>
        </div>

        {/* Social Links */}
        {(profile.linkedin_url ||
          profile.twitter_url ||
          profile.website_url) && (
          <div className="flex gap-3 mb-6">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-blue-50 text-[#0077B5] hover:bg-blue-100 transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            {profile.twitter_url && (
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-gray-50 text-black hover:bg-gray-100 transition-colors"
              >
                <Twitter size={18} />
              </a>
            )}
            {profile.website_url && (
              <a
                href={profile.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                <Globe size={18} />
              </a>
            )}
          </div>
        )}

        <div className="space-y-4">
          {/* Level & XP */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Level {profile.level}
              </span>
              <span className="text-xs font-bold text-blue-600">
                {xpProgress}/100 XP
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                className="h-full bg-[#00008B]"
              />
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center justify-between rounded-2xl bg-orange-50 p-3">
            <div className="flex items-center gap-2">
              <Flame
                size={20}
                className="text-orange-500"
                fill="currentColor"
              />
              <span className="text-sm font-black text-orange-700 uppercase">
                Streak
              </span>
            </div>
            <span className="text-lg font-black text-orange-700">
              {profile.streak} Days
            </span>
          </div>

          {/* Era Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                {era.name}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${era.progress}%` }}
                className={`h-full ${era.color}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Badges */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-gray-400">
          Recent Badges
        </h3>
        <div className="flex gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <Award size={24} className="text-blue-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => item.href && (window.location.href = item.href)}
            className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 transition-all ${
              item.active
                ? "bg-white text-[#00008B] shadow-sm border border-gray-100"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} strokeWidth={item.active ? 3 : 2} />
              <span
                className={`text-sm font-bold ${item.active ? "font-black" : ""}`}
              >
                {item.label}
              </span>
            </div>
            {item.active && <ChevronRight size={16} />}
          </button>
        ))}
        <button
          onClick={() => (window.location.href = "/account/logout")}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold">Logout</span>
        </button>
      </nav>
    </div>
  );
}
