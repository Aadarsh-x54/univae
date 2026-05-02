"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import {
  X,
  Thermometer,
  Hash,
  MessageSquare,
  Trash2,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const MODEL_OPTIONS = [
  { label: "Gemini 2.5 Flash", value: "gemini-2.5-flash", badge: "Free" },
  { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash", badge: "Free" },
  { label: "GPT-4o Mini", value: "gpt-4o-mini", badge: "OpenAI" },
  { label: "GPT-4o", value: "gpt-4o", badge: "OpenAI" },
  { label: "Claude 3.5 Haiku", value: "claude-3-5-haiku-20241022", badge: "Anthropic" },
  { label: "Grok Beta", value: "grok-beta", badge: "xAI" },
];

interface SettingsPanelProps {
  open: boolean;
}

export default function SettingsPanel({ open }: SettingsPanelProps) {
  const {
    setSettingsOpen,
    temperature,
    setTemperature,
    maxTokens,
    setMaxTokens,
    customSystemPrompt,
    setCustomSystemPrompt,
    selectedModel,
    setSelectedModel,
    clearAllConversations,
  } = useAppStore();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(3, 2, 10, 0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setSettingsOpen(false)}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm overflow-y-auto"
            style={{
              background: "linear-gradient(180deg, #0c0a1a 0%, #06041200 0%, #0c0a1a 100%)",
              borderLeft: "1px solid rgba(139, 92, 246, 0.15)",
              boxShadow: "-20px 0 60px rgba(139, 92, 246, 0.08)",
            }}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-purple-500/10"
              style={{ background: "rgba(12, 10, 26, 0.95)", backdropFilter: "blur(20px)" }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-purple" />
                <h2 className="font-semibold text-white text-sm">Settings</h2>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-purple-500/10 text-text-muted hover:text-white transition-all"
                id="close-settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">

              {/* Default Model */}
              <section>
                <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider mb-3">
                  Default Model
                </h3>
                <div className="space-y-1.5">
                  {MODEL_OPTIONS.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setSelectedModel(m.value)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-left transition-all ${
                        selectedModel === m.value
                          ? "bg-accent-purple/10 border border-accent-purple/25 text-white"
                          : "text-text-muted hover:bg-purple-500/5 hover:text-white border border-transparent"
                      }`}
                    >
                      <span>{m.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedModel === m.value
                          ? "bg-accent-purple/20 text-accent-purple"
                          : "bg-purple-500/8 text-text-dim"
                      }`}>
                        {m.badge}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Temperature */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5" />
                    Temperature
                  </h3>
                  <span className="text-sm font-mono text-accent-purple">{temperature.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #A78BFA ${temperature * 100}%, rgba(139, 92, 246, 0.15) ${temperature * 100}%)`,
                  }}
                  id="temperature-slider"
                />
                <div className="flex justify-between text-xs text-text-dim mt-1.5">
                  <span>Precise</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </section>

              {/* Max Tokens */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    Max Output Tokens
                  </h3>
                  <span className="text-sm font-mono text-accent-purple">{maxTokens.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="8192"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #A78BFA ${((maxTokens - 256) / (8192 - 256)) * 100}%, rgba(139, 92, 246, 0.15) ${((maxTokens - 256) / (8192 - 256)) * 100}%)`,
                  }}
                  id="max-tokens-slider"
                />
                <div className="flex justify-between text-xs text-text-dim mt-1.5">
                  <span>256</span>
                  <span>4096</span>
                  <span>8192</span>
                </div>
              </section>

              {/* Custom System Prompt */}
              <section>
                <h3 className="text-xs font-semibold text-text-dim uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Custom System Prompt
                </h3>
                <p className="text-xs text-text-dim mb-2">
                  Override the default UNIVAE persona. Leave blank for the default.
                </p>
                <textarea
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  placeholder="You are a helpful assistant..."
                  rows={4}
                  className="w-full bg-purple-500/5 border border-purple-500/12 rounded-xl px-3 py-2.5 text-sm text-white placeholder-text-dim outline-none focus:border-accent-purple/30 transition-all resize-none"
                  id="system-prompt-input"
                />
                {customSystemPrompt && (
                  <button
                    onClick={() => setCustomSystemPrompt("")}
                    className="flex items-center gap-1 text-xs text-text-dim hover:text-red-400 transition-all mt-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset to default
                  </button>
                )}
              </section>

              {/* Danger Zone */}
              <section>
                <h3 className="text-xs font-semibold text-red-400/70 uppercase tracking-wider mb-3">
                  Danger Zone
                </h3>
                <button
                  onClick={() => {
                    if (confirm("Delete all conversations? This cannot be undone.")) {
                      clearAllConversations();
                      setSettingsOpen(false);
                    }
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500/15 text-red-400/70 hover:bg-red-500/8 hover:border-red-500/25 hover:text-red-400 transition-all text-sm"
                  id="clear-history-button"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All Conversations
                </button>
              </section>

              {/* Version */}
              <div className="text-center pt-2">
                <p className="text-xs text-text-dim opacity-50">UNIVAE v2.0 — Cosmic Infinity</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
