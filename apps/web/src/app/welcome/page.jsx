"use client";

import { motion } from "motion/react";
import { Zap } from "lucide-react";

export default function WelcomePage() {
  const handleContinue = () => {
    window.location.href = "/onboarding";
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#00008B] font-sans selection:bg-[#FFD600] selection:text-[#00008B] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 inline-flex h-32 w-32 items-center justify-center bg-[#00008B] border-8 border-[#00008B] text-white shadow-[16px_16px_0px_#FFD600]"
        >
          <Zap size={64} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 leading-none"
        >
          Welcome to <br />
          <span className="text-[#FF4B4B]">VentureLync</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold mb-12 max-w-xl mx-auto"
        >
          You’re officially inside a private builder network.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={handleContinue}
          className="group relative bg-[#00008B] px-12 py-6 text-2xl font-black uppercase text-white transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#00C853]"
        >
          👉 Set up your profile
          <span className="block text-sm font-bold opacity-60 mt-1">
            (takes 2 minutes)
          </span>
        </motion.button>
      </div>
    </div>
  );
}
