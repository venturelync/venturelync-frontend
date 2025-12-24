import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { X, Send, Zap } from "lucide-react";
import { toast } from "sonner";

export function CommentSection({ postId, onClose, onCommentAdded }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (parentId = null) => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: newComment, parentId }),
      });
      if (res.ok) {
        setNewComment("");
        fetchComments();
        if (onCommentAdded) onCommentAdded();
        toast.success("Comment added! +10 XP");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const CommentItem = ({ comment, depth = 0 }) => (
    <div
      className={`mt-4 ${depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-4" : ""}`}
    >
      <div className="flex gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#00008B] to-indigo-700 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
          {comment.username?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-black text-[#00008B]">
              @{comment.username}
            </span>
            <span className="text-[10px] font-bold text-gray-400">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            {comment.content}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <button className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-[#00008B]">
              Like
            </button>
            <button className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-[#00008B]">
              Reply
            </button>
          </div>
          {comment.replies?.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-gray-100 bg-white shadow-2xl"
    >
      <div className="flex items-center justify-between border-b border-gray-100 p-6">
        <h2 className="text-lg font-black uppercase tracking-tighter">
          Discussions
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>
      <div className="h-[calc(100vh-180px)] overflow-y-auto p-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap size={24} className="text-gray-200" />
            </motion.div>
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
            {comments.length === 0 && (
              <p className="text-center text-sm font-bold text-gray-400 py-12">
                No discussions yet. Start the signal.
              </p>
            )}
          </div>
        )}
      </div>
      <div className="absolute bottom-0 w-full border-t border-gray-100 bg-white p-6">
        <div className="flex gap-2">
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add to the discussion..."
            className="flex-1 rounded-xl bg-gray-50 px-4 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-[#00008B]/10"
          />
          <button
            onClick={() => handleAddComment()}
            className="rounded-xl bg-[#00008B] p-2 text-white hover:scale-105 transition-transform"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
