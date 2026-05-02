"use client";

import { motion } from "framer-motion";
import { WELCOME_SUGGESTIONS, CHAT_MODES } from "@/lib/models";
import { useAppStore } from "@/lib/store";
import { Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (prompt: string) => void;
}

export default function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  const { selectedMode, setSelectedMode } = useAppStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="relative">
          {/* Glow behind */}
          <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/10 rounded-full blur-2xl" />
          <svg viewBox="0 0 120 120" className="w-20 h-20 relative drop-shadow-[0_0_30px_rgba(167,139,250,0.4)]" fill="none">
            <defs>
              <linearGradient id="wGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#A78BFA" />
                <stop offset="100%" stopColor="#E879F9" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="45" stroke="url(#wGrad)" strokeWidth="1.5" opacity="0.4" fill="none" />
            <path d="M42 40 L42 62 C42 74 50 82 60 82 C70 82 78 74 78 62 L78 40" stroke="url(#wGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="60" cy="25" r="3" fill="#67E8F9" opacity="0.9" />
            <circle cx="85" cy="45" r="2.5" fill="#E879F9" opacity="0.7" />
          </svg>
        </div>
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold mb-2 text-center"
      >
        Welcome to <span className="gradient-text">UNIVAE</span>
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-text-muted text-sm mb-8 text-center max-w-md"
      >
        Your cosmic AI companion. Ask anything, create anything, explore
        anything — across infinite dimensions.
      </motion.p>

      {/* Chat Modes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-2 mb-10"
      >
        {CHAT_MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedMode === mode.id
                ? "bg-accent-purple/15 border border-accent-purple/25 text-accent-purple"
                : "glass text-text-muted hover:text-white hover:bg-purple-500/5"
            }`}
          >
            <span>{mode.icon}</span>
            <span>{mode.name}</span>
          </button>
        ))}
      </motion.div>

      {/* Suggestion Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl"
      >
        {WELCOME_SUGGESTIONS.map((s, i) => (
          <motion.button
            key={s.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.06 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestionClick(s.prompt)}
            className="glass-card rounded-xl p-4 text-left group cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <span className="text-lg">{s.icon}</span>
              <div>
                <h4 className="text-sm font-medium text-white group-hover:text-accent-purple transition-colors">
                  {s.title}
                </h4>
                <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                  {s.prompt}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
