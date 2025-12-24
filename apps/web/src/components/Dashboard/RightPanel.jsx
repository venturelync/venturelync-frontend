import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Trophy,
  Users,
  TrendingUp,
  MapPin,
  Plus,
  ChevronRight,
  UserPlus,
  Filter,
  User,
} from "lucide-react";

export function RightPanel({
  leaderboard,
  suggestedUsers,
  trendingPosts,
  onFilterChange,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("global");

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    if (onFilterChange) onFilterChange(filter);
  };

  return (
    <div className="space-y-6">
      {/* Leaderboard */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
              Leaderboard
            </h3>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${showFilters ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50"}`}
          >
            <Filter size={16} />
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4 flex gap-2"
            >
              {["global", "local", "season", "community"].map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilter(f)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeFilter === f
                      ? "bg-[#00008B] text-white"
                      : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {leaderboard.slice(0, 5).map((user, i) => (
            <div
              key={user.user_id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-black ${i === 0 ? "text-yellow-500" : "text-gray-300"}`}
                >
                  #{i + 1}
                </span>
                <div className="h-8 w-8 rounded-lg bg-gray-100 overflow-hidden">
                  {user.profile_image ? (
                    <img
                      src={user.profile_image}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-600 text-[10px] font-black">
                      {user.name?.[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-black">{user.name}</p>
                  <p className="text-[10px] font-bold text-gray-400">
                    Level {user.level}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-blue-600">
                {user.core_xp || user.xp} XP
              </span>
            </div>
          ))}
        </div>
        <button className="mt-6 w-full rounded-xl bg-gray-50 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all">
          View Full Rankings
        </button>
      </div>

      {/* Suggested Users */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="mb-6 text-xs font-black uppercase tracking-widest text-gray-400">
          Founders to Follow
        </h3>
        <div className="space-y-4">
          {suggestedUsers.length > 0 ? (
            suggestedUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gray-100 overflow-hidden">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-50 text-blue-600">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-black">{user.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 truncate w-32">
                      {user.bio || "No bio yet"}
                    </p>
                  </div>
                </div>
                <button className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-all">
                  <UserPlus size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-xs font-bold text-gray-400 text-center py-4">
              No builders found yet.
            </p>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-blue-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
            Trending Logs
          </h3>
        </div>
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <p className="text-xs font-bold text-gray-800 group-hover:text-blue-600 transition-all line-clamp-2">
                "{post.content}"
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                {post.engagement} interactions
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
