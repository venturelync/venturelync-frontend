import { motion } from "motion/react";
import {
  X,
  Sparkles,
  Linkedin,
  Twitter,
  Check,
  ArrowRight,
} from "lucide-react";

export function RedistributionModal({
  show,
  onClose,
  aiVersions,
  isGeneratingAi,
  onGenerate,
  postContent,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl overflow-hidden rounded-[40px] bg-white shadow-2xl"
      >
        <div className="p-10">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Sparkles size={32} />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase">
              Make this update work harder
            </h2>
            <p className="mt-2 font-bold text-gray-400">
              Redistribute your progress to other platforms with AI
              optimization.
            </p>
          </div>

          {!aiVersions ? (
            <div className="space-y-6">
              <div className="rounded-3xl bg-gray-50 p-6 border border-gray-100">
                <p className="text-sm font-medium text-gray-500 italic line-clamp-3">
                  "{postContent}"
                </p>
              </div>
              <button
                onClick={onGenerate}
                disabled={isGeneratingAi}
                className="flex w-full items-center justify-center gap-3 rounded-3xl bg-[#00008B] py-5 text-lg font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
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
                    <Sparkles size={24} />
                  </motion.div>
                ) : (
                  <Sparkles size={24} />
                )}
                {isGeneratingAi
                  ? "Optimizing Tone..."
                  : "Generate Social Versions"}
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all"
              >
                Skip for now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="group relative cursor-pointer rounded-3xl border-2 border-gray-100 bg-gray-50 p-6 transition-all hover:border-[#0077B5] hover:bg-[#0077B5]/5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Linkedin size={20} className="text-[#0077B5]" />
                    <span className="text-xs font-black uppercase tracking-widest text-[#0077B5]">
                      LinkedIn Version
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-[#0077B5]"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {aiVersions.linkedin}
                </p>
              </div>

              <div className="group relative cursor-pointer rounded-3xl border-2 border-gray-100 bg-gray-50 p-6 transition-all hover:border-black hover:bg-black/5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Twitter size={20} className="text-black" />
                    <span className="text-xs font-black uppercase tracking-widest text-black">
                      X / Twitter Version
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-gray-300 group-hover:text-black"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700 leading-relaxed">
                  {aiVersions.twitter}
                </p>
              </div>

              <div className="pt-6">
                <button
                  onClick={onClose}
                  className="w-full rounded-3xl bg-gray-900 py-5 text-lg font-black uppercase tracking-widest text-white transition-all hover:bg-black"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
