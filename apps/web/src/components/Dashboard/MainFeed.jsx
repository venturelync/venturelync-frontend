import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Sparkles, Image as ImageIcon, User } from "lucide-react";
import { PostCard } from "./PostCard";
import { PostDetailModal } from "./PostDetailModal";

export function MainFeed({
  profile,
  posts,
  postContent,
  setPostContent,
  isPosting,
  onPost,
}) {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="space-y-6">
      {/* Create Post Module */}
      <div className="sticky top-0 z-20 rounded-3xl bg-white/80 p-6 shadow-sm border border-gray-100 backdrop-blur-xl">
        <div className="flex gap-4">
          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
            {profile.profile_image ? (
              <img
                src={profile.profile_image}
                alt={profile.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-blue-50 text-blue-600">
                <User size={24} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What did you build today? Wins, losses, learnings all count."
              className="w-full resize-none bg-transparent text-lg font-medium outline-none placeholder:text-gray-300"
              rows={3}
            />
            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex gap-2">
                <button className="rounded-xl p-2 text-gray-400 hover:bg-gray-50 hover:text-blue-600 transition-all">
                  <ImageIcon size={20} />
                </button>
                <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 hover:text-purple-600 transition-all">
                  <Sparkles size={16} />
                  AI Enhance
                </button>
              </div>
              <button
                onClick={onPost}
                disabled={isPosting || !postContent.trim()}
                className="flex items-center gap-2 rounded-2xl bg-[#00008B] px-6 py-2.5 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isPosting ? "Publishing..." : "Publish Log"}
                <Zap size={16} fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onCommentClick={(p) => setSelectedPost(p)}
          />
        ))}
      </div>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => setSelectedPost(null)}
            currentUser={profile}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
