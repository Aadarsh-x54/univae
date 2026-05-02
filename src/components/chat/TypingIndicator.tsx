"use client";

import { motion } from "framer-motion";
import { ModelConfig } from "@/lib/types";

interface TypingIndicatorProps {
  model: ModelConfig;
}

export default function TypingIndicator({ model }: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 mb-6"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold bg-gradient-to-br from-accent-indigo to-accent-purple text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]">
        {model.icon}
      </div>

      {/* Dots */}
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-text-muted"
            animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
