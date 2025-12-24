import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MoreHorizontal,
  Heart,
  MessageSquare,
  Share2,
  Zap,
  Flame,
  Award,
} from "lucide-react";
import { LevelBadge } from "./LevelBadge";

export function PostCard({ post, onCommentClick }) {
  const [liked, setLiked] = useState(post.is_liked);
  const [likesCount, setLikesCount] = useState(
    Math.max(0, parseInt(post.likes_count) || 0),
  );
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => Math.max(0, newLiked ? prev + 1 : prev - 1));

    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
      // Ensure count is synced with server if possible, but optimistic is usually fine
    } catch (error) {
      // Rollback on error
      setLiked(!newLiked);
      setLikesCount((prev) => Math.max(0, !newLiked ? prev + 1 : prev - 1));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => onCommentClick(post)}
      className="group relative border-b border-gray-100 bg-white p-6 transition-all hover:bg-gray-50/50 cursor-pointer"
    >
      <div className="flex gap-4">
        <div className="relative h-12 w-12 flex-shrink-0">
          {post.profile_image ? (
            <img
              src={post.profile_image}
              className="h-full w-full rounded-full object-cover shadow-md"
              alt={post.username}
            />
          ) : (
            <div className="h-full w-full rounded-full bg-gradient-to-br from-[#00008B] to-indigo-700 flex items-center justify-center text-white font-black text-lg shadow-md">
              {post.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#00008B]">
                @{post.username}
              </span>

              {/* Level Animation */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="flex items-center"
              >
                <LevelBadge level={post.level} />
              </motion.div>

              {/* Recent Badge Animation */}
              {post.recent_badge_icon && (
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="text-lg"
                  title="Recent Achievement"
                >
                  {post.recent_badge_icon}
                </motion.div>
              )}

              {/* Streak Animation */}
              {post.streak > 10 && (
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                    filter: [
                      "brightness(1)",
                      "brightness(1.2)",
                      "brightness(1)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100 shadow-sm"
                >
                  <Flame
                    size={12}
                    className="text-orange-500"
                    fill="currentColor"
                  />
                  <span className="text-[10px] font-black text-orange-700">
                    {post.streak}d
                  </span>
                </motion.div>
              )}

              <span className="text-xs text-gray-300">•</span>
              <span className="text-xs font-bold text-gray-400">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
            </div>
            <button
              className="text-gray-300 hover:text-gray-600"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          <p className="text-gray-800 leading-relaxed mb-4 font-medium whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Top Comment Preview */}
          {post.top_comment && (
            <div className="mb-4 rounded-xl bg-gray-50 p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-[#00008B]">
                  @{post.top_comment.username}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(post.top_comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {post.top_comment.content}
              </p>
            </div>
          )}

          <div className="flex items-center gap-8">
            <button
              onClick={handleLike}
              disabled={isLiking}
              className={`flex items-center gap-2 text-sm font-bold transition-all ${liked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
            >
              <motion.div
                animate={
                  liked
                    ? {
                        scale: [1, 1.5, 1],
                        rotate: [0, 20, -20, 0],
                        filter: [
                          "drop-shadow(0 0 0px rgba(239,68,68,0))",
                          "drop-shadow(0 0 8px rgba(239,68,68,0.6))",
                          "drop-shadow(0 0 4px rgba(239,68,68,0.4))",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                <Heart
                  size={18}
                  fill={liked ? "currentColor" : "none"}
                  className={liked ? "text-red-500" : ""}
                />
              </motion.div>
              {likesCount}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCommentClick(post);
              }}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-blue-500 transition-colors"
            >
              <MessageSquare size={18} />
              {post.comments_count || 0}
            </button>
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-500 transition-colors"
            >
              <Share2 size={18} />
            </button>
            <div className="ml-auto flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              <Zap size={10} fill="currentColor" />+{post.xp_earned || 50} XP
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
