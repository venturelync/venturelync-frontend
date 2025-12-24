import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Send, User, Heart, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export function PostDetailModal({ post, onClose, currentUser }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?post_id=${post.id}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.id,
          content: newComment,
        }),
      });

      if (res.ok) {
        setNewComment("");
        fetchComments();
        toast.success("Comment added");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[32px] bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
              {post.name?.[0]}
            </div>
            <div>
              <h3 className="text-sm font-black">{post.name}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                @{post.username}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="text-lg font-medium text-gray-800 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          {/* Comments Section */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <MessageSquare size={14} />
              Comments ({comments.length})
            </h4>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
              </div>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-400">
                      <User size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black">
                          {comment.user_name || comment.username}
                        </span>
                        <span className="text-[10px] font-bold text-gray-300">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
                {comments.length === 0 && (
                  <p className="text-center py-8 text-sm font-bold text-gray-300 italic">
                    No comments yet. Be the first to spark a conversation!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer / Input */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <form onSubmit={handleAddComment} className="flex gap-3">
            <div className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center text-blue-600">
              <User size={20} />
            </div>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a thoughtful comment..."
                className="w-full h-10 pl-4 pr-12 rounded-xl bg-white border border-gray-200 text-sm font-medium outline-none focus:border-blue-600 transition-colors"
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all disabled:opacity-30"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
