import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, TrendingUp, Flame, Zap, Share2, ArrowUpRight } from "lucide-react";
import { WrappedSlide } from "./WrappedSlide";

export function WrappedModal({ show, onClose, profile, posts }) {
  const [wrappedStep, setWrappedStep] = useState(0);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <button
        onClick={() => {
          onClose();
          setWrappedStep(0);
        }}
        className="absolute right-8 top-8 z-[60] text-white/60 hover:text-white"
      >
        <X size={32} />
      </button>

      <div className="relative h-full w-full max-w-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {wrappedStep === 0 && (
            <WrappedSlide
              key="s1"
              title="Your Month in Signal"
              value={posts.length}
              icon={TrendingUp}
              color="bg-gradient-to-br from-purple-600 to-blue-700"
              description="You logged reality more than 90% of founders this month. Pure signal."
            />
          )}
          {wrappedStep === 1 && (
            <WrappedSlide
              key="s2"
              title="Momentum King"
              value={`${profile.streak} Days`}
              icon={Flame}
              color="bg-gradient-to-br from-orange-500 to-red-600"
              description="Your consistency is becoming your competitive advantage. Don't stop."
            />
          )}
          {wrappedStep === 2 && (
            <WrappedSlide
              key="s3"
              title="XP Gained"
              value={`+${profile.xp} XP`}
              icon={Zap}
              color="bg-gradient-to-br from-yellow-400 to-orange-500"
              description="You leveled up twice this month. Your builder profile is glowing."
            />
          )}
          {wrappedStep === 3 && (
            <motion.div
              key="s4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-full flex-col items-center justify-center bg-white p-12 text-center"
            >
              <div className="mb-8 h-32 w-32 rounded-full bg-[#00008B] flex items-center justify-center text-white font-black text-4xl">
                {profile.name?.[0]}
              </div>
              <h2 className="mb-2 text-4xl font-black uppercase tracking-tighter text-[#00008B]">
                Ready to Share?
              </h2>
              <p className="mb-12 font-bold text-gray-400">
                Your monthly signal is ready for the world.
              </p>
              <div className="grid w-full gap-4">
                <button className="flex items-center justify-center gap-3 rounded-2xl bg-[#00008B] py-4 font-black uppercase text-white transition-transform hover:scale-105">
                  <Share2 size={20} /> Share to LinkedIn
                </button>
                <button className="flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 py-4 font-black uppercase text-gray-900 transition-transform hover:scale-105">
                  <ArrowUpRight size={20} /> Share to X
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bars */}
        <div className="absolute top-12 left-0 right-0 flex gap-1 px-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width:
                    wrappedStep === i
                      ? "100%"
                      : wrappedStep > i
                        ? "100%"
                        : "0%",
                }}
                transition={{ duration: wrappedStep === i ? 5 : 0.3 }}
                onAnimationComplete={() => {
                  if (wrappedStep === i && wrappedStep < 3)
                    setWrappedStep(i + 1);
                }}
                className="h-full bg-white"
              />
            </div>
          ))}
        </div>

        {/* Navigation Areas */}
        <div className="absolute inset-0 flex">
          <div
            className="h-full w-1/2 cursor-pointer"
            onClick={() => setWrappedStep(Math.max(0, wrappedStep - 1))}
          />
          <div
            className="h-full w-1/2 cursor-pointer"
            onClick={() => setWrappedStep(Math.min(3, wrappedStep + 1))}
          />
        </div>
      </div>
    </div>
  );
}
