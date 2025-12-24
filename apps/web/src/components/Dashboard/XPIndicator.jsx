import { motion } from "motion/react";

export function XPIndicator({ amount }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ opacity: 1, y: -40, scale: 1.2 }}
      exit={{ opacity: 0 }}
      className="absolute -top-8 right-0 font-black text-yellow-500 pointer-events-none z-50"
    >
      +{amount} XP
    </motion.div>
  );
}
