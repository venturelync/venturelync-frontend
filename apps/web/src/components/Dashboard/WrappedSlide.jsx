import { motion } from "motion/react";

export function WrappedSlide({ title, value, icon: Icon, color, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className={`flex h-full flex-col items-center justify-center p-12 text-center text-white ${color}`}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8 rounded-full bg-white/20 p-6 backdrop-blur-md"
      >
        <Icon size={64} />
      </motion.div>
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-4 text-2xl font-black uppercase tracking-tighter"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.4 }}
        className="mb-6 text-7xl font-black"
      >
        {value}
      </motion.div>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-md text-xl font-bold opacity-90"
      >
        {description}
      </motion.p>
    </motion.div>
  );
}
