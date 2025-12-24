import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Linkedin, Twitter, Check } from "lucide-react";

export function PostModal({
  show,
  onClose,
  postContent,
  setPostContent,
  aiVersions,
  isGeneratingAi,
  onGenerateAi,
  onPost,
  isPosting,
  profile,
  // New props for redistribution
  redistributeLinkedIn,
  setRedistributeLinkedIn,
  redistributeTwitter,
  setRedistributeTwitter,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-black uppercase tracking-tighter">
            New Reality Log
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-8">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="What happened today? Be raw."
            className="mb-6 w-full resize-none text-2xl font-bold outline-none placeholder:text-gray-200"
            rows={4}
          />

          {!aiVersions ? (
            <button
              onClick={onGenerateAi}
              disabled={isGeneratingAi || !postContent.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-100 py-4 font-black uppercase text-gray-600 transition-all hover:bg-gray-200 disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles size={20} />
                </motion.div>
              ) : (
                <Sparkles size={20} />
              )}
              {isGeneratingAi
                ? "Generating Human Tone..."
                : "Generate Social Versions"}
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div
                onClick={() => setRedistributeLinkedIn(!redistributeLinkedIn)}
                className={`cursor-pointer rounded-2xl border-2 transition-all p-4 ${
                  redistributeLinkedIn
                    ? "border-[#0077B5] bg-[#0077B5]/5"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Linkedin
                      size={16}
                      className={
                        redistributeLinkedIn
                          ? "text-[#0077B5]"
                          : "text-gray-400"
                      }
                    />
                    <span
                      className={`text-xs font-black uppercase ${redistributeLinkedIn ? "text-[#0077B5]" : "text-gray-400"}`}
                    >
                      LinkedIn Version
                    </span>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      redistributeLinkedIn
                        ? "bg-[#0077B5] border-[#0077B5]"
                        : "border-gray-300"
                    }`}
                  >
                    {redistributeLinkedIn && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 italic">
                  "{aiVersions.linkedin}"
                </p>
              </div>

              <div
                onClick={() => setRedistributeTwitter(!redistributeTwitter)}
                className={`cursor-pointer rounded-2xl border-2 transition-all p-4 ${
                  redistributeTwitter
                    ? "border-black bg-black/5"
                    : "border-gray-100 bg-gray-50 opacity-60"
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Twitter
                      size={16}
                      className={
                        redistributeTwitter ? "text-black" : "text-gray-400"
                      }
                    />
                    <span
                      className={`text-xs font-black uppercase ${redistributeTwitter ? "text-black" : "text-gray-400"}`}
                    >
                      Twitter Version
                    </span>
                  </div>
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                      redistributeTwitter
                        ? "bg-black border-black"
                        : "border-gray-300"
                    }`}
                  >
                    {redistributeTwitter && (
                      <Check size={12} className="text-white" />
                    )}
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-700 italic">
                  "{aiVersions.twitter}"
                </p>
              </div>
            </motion.div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              onClick={onPost}
              disabled={isPosting || !postContent.trim()}
              className="flex-1 rounded-2xl bg-[#00008B] py-4 text-lg font-black uppercase text-white shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isPosting ? "Publishing..." : "Post to VentureLync"}
            </button>
          </div>
          <p className="mt-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
            Earn +50 XP and keep your {profile.streak} day streak alive
          </p>
        </div>
      </motion.div>
    </div>
  );
}
