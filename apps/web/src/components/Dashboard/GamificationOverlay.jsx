import { motion, AnimatePresence } from "motion/react";
import { Zap, Award, Flame, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export function GamificationOverlay({ event, onComplete }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onComplete, 500);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Confetti Simulation */}
      <AnimatePresence>
        {show && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 1000,
                  y: (Math.random() - 0.5) * 1000,
                  scale: [0, 1, 0],
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 2, ease: "easeOut" }}
                className={`absolute h-4 w-4 rounded-sm ${
                  [
                    "bg-blue-500",
                    "bg-yellow-500",
                    "bg-purple-500",
                    "bg-red-500",
                  ][Math.floor(Math.random() * 4)]
                }`}
              />
            ))}

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="relative flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute -inset-8 opacity-20"
                >
                  <Sparkles size={120} className="text-yellow-400" />
                </motion.div>
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-2xl border-4 border-blue-50">
                  <Zap size={64} className="text-[#00008B]" fill="#00008B" />
                </div>
              </div>

              <div className="mt-8 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-black uppercase tracking-tighter text-[#00008B]"
                >
                  +{event.xpEarned} XP
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 text-lg font-bold text-gray-500"
                >
                  You showed up today. Keep building.
                </motion.p>

                <div className="mt-6 flex gap-4">
                  <div className="flex items-center gap-2 rounded-2xl bg-orange-50 px-4 py-2 border border-orange-100">
                    <Flame
                      size={20}
                      className="text-orange-500"
                      fill="currentColor"
                    />
                    <span className="text-sm font-black text-orange-700">
                      {event.newStreak} DAY STREAK
                    </span>
                  </div>
                  {event.badgeUnlocked && (
                    <div className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-2 border border-blue-100">
                      <Award size={20} className="text-blue-600" />
                      <span className="text-sm font-black text-blue-700">
                        NEW BADGE!
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
