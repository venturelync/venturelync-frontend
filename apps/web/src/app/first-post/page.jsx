"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Flame, Zap, CheckCircle2, Linkedin, Twitter } from "lucide-react";
import useUser from "@/utils/useUser";

// Confetti Component
const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            top: -20,
            left: `${Math.random() * 100}%`,
            rotate: 0,
          }}
          animate={{
            top: "110%",
            rotate: 360,
            left: `${Math.random() * 100}%`,
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: 0,
            ease: "linear",
          }}
          className="absolute w-4 h-4"
          style={{
            backgroundColor: [
              "#FF4B4B",
              "#00C853",
              "#FFD600",
              "#AA00FF",
              "#00008B",
            ][Math.floor(Math.random() * 5)],
          }}
        />
      ))}
    </div>
  );
};

export default function FirstPostPage() {
  const { data: user, loading: userLoading, mutate: refreshUser } = useUser();

  const [view, setView] = useState("intro"); // intro, post, success
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpAdded, setXpAdded] = useState(0);

  useEffect(() => {
    if (!userLoading && !user) window.location.href = "/account/signin";
    if (user?.first_post_completed) window.location.href = "/dashboard";
  }, [user, userLoading]);

  const handlePublish = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          is_first_post: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to publish");

      setShowConfetti(true);
      setXpAdded(50);
      setView("success");
      await refreshUser();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) return null;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans selection:bg-[#FFD600] selection:text-[#00008B] p-6 flex items-center justify-center">
      {showConfetti && <Confetti />}

      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {view === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
                This is your <br />
                <span className="text-[#00C853]">builder log.</span>
              </h1>
              <p className="text-2xl font-bold mb-12 opacity-60">
                Every post compounds. Consistency is the only metric.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                <div className="border-4 border-[#00008B] p-6 bg-white shadow-[8px_8px_0px_#FFD600]">
                  <div className="flex items-center gap-2 font-black mb-2">
                    <Zap className="text-[#FFD600]" /> +50 XP
                  </div>
                  <p className="text-sm font-bold">
                    Earn XP for every update. Level up your builder status.
                  </p>
                </div>
                <div className="border-4 border-[#00008B] p-6 bg-white shadow-[8px_8px_0px_#FF4B4B]">
                  <div className="flex items-center gap-2 font-black mb-2">
                    <Flame className="text-[#FF4B4B]" /> STREAKS
                  </div>
                  <p className="text-sm font-bold">
                    Post daily to build a streak. Proof of work in real-time.
                  </p>
                </div>
                <div className="border-4 border-[#00008B] p-6 bg-white shadow-[8px_8px_0px_#00C853]">
                  <div className="flex items-center gap-2 font-black mb-2">
                    <CheckCircle2 className="text-[#00C853]" /> SIGNAL
                  </div>
                  <p className="text-sm font-bold">
                    No fluff. Just what moved, what broke, and what you learned.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setView("post")}
                className="bg-[#00008B] px-12 py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#FFD600]"
              >
                🔥 Post your first update
              </button>
            </motion.div>
          )}

          {view === "post" && (
            <motion.div
              key="post"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="border-8 border-[#00008B] bg-white p-8 md:p-12 shadow-[16px_16px_0px_#00008B]"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-black uppercase mb-2">
                  What did you work on today?
                </h2>
                <p className="font-bold opacity-60">
                  Wins, losses, learnings — all count.
                </p>
              </div>

              <div className="mb-8 space-y-4">
                <div className="bg-[#FDFCF8] border-4 border-[#00008B] p-6">
                  <textarea
                    autoFocus
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent font-bold text-xl outline-none min-h-[150px] resize-none"
                    placeholder="e.g. Shipped the landing page, talked to 3 users, and fixed that annoying auth bug."
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Shipped landing page",
                    "Talked to 3 users",
                    "Missed a deadline but learned why",
                  ].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setContent(ex)}
                      className="text-xs font-black uppercase border-2 border-[#00008B] px-3 py-1 hover:bg-[#FFD600] transition-all"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              <button
                disabled={loading || !content.trim()}
                onClick={handlePublish}
                className="w-full bg-[#00008B] py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#00C853] disabled:opacity-50"
              >
                {loading ? "Publishing..." : "👉 Publish first update"}
              </button>
            </motion.div>
          )}

          {view === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="mb-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="inline-flex h-32 w-32 items-center justify-center bg-[#00C853] border-8 border-[#00008B] text-white shadow-[16px_16px_0px_#00008B] mb-8"
                >
                  <CheckCircle2 size={64} />
                </motion.div>
                <h2 className="text-5xl font-black uppercase mb-4">
                  You've started something.
                </h2>
                <p className="text-2xl font-bold opacity-60">
                  Keep going tomorrow.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="border-4 border-[#00008B] bg-white p-8 shadow-[8px_8px_0px_#FFD600]">
                  <div className="text-4xl font-black text-[#00008B] mb-2">
                    +{xpAdded} XP
                  </div>
                  <div className="text-sm font-black uppercase opacity-60">
                    XP Earned
                  </div>
                </div>
                <div className="border-4 border-[#00008B] bg-white p-8 shadow-[8px_8px_0px_#FF4B4B]">
                  <div className="text-4xl font-black text-[#00008B] mb-2">
                    Day 1
                  </div>
                  <div className="text-sm font-black uppercase opacity-60">
                    Current Streak
                  </div>
                </div>
              </div>

              <div className="border-8 border-[#00008B] bg-white p-8 shadow-[16px_16px_0px_#AA00FF] mb-12">
                <h3 className="text-2xl font-black uppercase mb-6">
                  Want this update to work harder for you?
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="flex-1 bg-[#0077B5] text-white p-4 font-black uppercase flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_#00008B] transition-all">
                    <Linkedin size={20} /> Post to LinkedIn
                  </button>
                  <button className="flex-1 bg-black text-white p-4 font-black uppercase flex items-center justify-center gap-2 hover:shadow-[4px_4px_0px_#00008B] transition-all">
                    <Twitter size={20} /> Post to X
                  </button>
                </div>
                <button
                  onClick={() => (window.location.href = "/dashboard")}
                  className="mt-6 text-sm font-black uppercase opacity-40 hover:opacity-100 transition-all"
                >
                  Skip for now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
