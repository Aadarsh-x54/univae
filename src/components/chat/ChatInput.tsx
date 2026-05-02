"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Square, Mic, MicOff, Paperclip, Globe, Download, ChevronDown } from "lucide-react";
import { useVoiceInput } from "@/hooks/useVoiceInput";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  stop: () => void;
  onExportMarkdown?: () => void;
  onExportPDF?: () => void;
  hasMessages?: boolean;
}

export default function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  stop,
  onExportMarkdown,
  onExportPDF,
  hasMessages = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isListening, transcript, startListening, stopListening, error } = useVoiceInput();
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Auto-resize
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  }, [input]);

  // Voice transcript → input
  useEffect(() => {
    if (transcript) {
      const event = {
        target: { value: input + transcript },
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleInputChange(event);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex-shrink-0 px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative glass-strong rounded-2xl p-1.5 transition-all focus-within:border-accent-purple/30 focus-within:shadow-[0_0_30px_rgba(139,92,246,0.08)]">
            {/* Top action row */}
            <div className="flex items-center gap-1 px-2.5 pb-1">
              <button
                type="button"
                className="p-1.5 rounded-lg text-text-dim hover:text-text-muted hover:bg-purple-500/5 transition-all"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg text-text-dim hover:text-text-muted hover:bg-purple-500/5 transition-all"
                title="Web search"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Export button — only shown when there are messages */}
              {hasMessages && (
                <div className="relative ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="flex items-center gap-1 p-1.5 rounded-lg text-text-dim hover:text-accent-purple hover:bg-purple-500/5 transition-all text-xs"
                    title="Export conversation"
                    id="export-button"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <ChevronDown className={`w-3 h-3 transition-transform ${showExportMenu ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showExportMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-2 w-44 rounded-xl overflow-hidden z-20"
                        style={{
                          background: "rgba(18, 15, 42, 0.98)",
                          border: "1px solid rgba(139, 92, 246, 0.15)",
                          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => { onExportMarkdown?.(); setShowExportMenu(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-muted hover:text-white hover:bg-purple-500/8 transition-all flex items-center gap-2"
                          id="export-markdown-button"
                        >
                          <span className="text-base">📝</span>
                          Export Markdown
                        </button>
                        <button
                          type="button"
                          onClick={() => { onExportPDF?.(); setShowExportMenu(false); }}
                          className="w-full text-left px-4 py-2.5 text-sm text-text-muted hover:text-white hover:bg-purple-500/8 transition-all flex items-center gap-2"
                          id="export-pdf-button"
                        >
                          <span className="text-base">📄</span>
                          Export PDF
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="flex items-end gap-2 px-2.5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask UNIVAE anything across the cosmos..."
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-text-dim text-sm leading-relaxed resize-none outline-none py-2 max-h-[200px] scrollbar-thin"
                disabled={isLoading}
                id="chat-input"
              />

              {/* Voice */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                  isListening
                    ? "bg-red-500/15 text-red-400 border border-red-500/20 animate-pulse"
                    : "text-text-dim hover:text-text-muted hover:bg-purple-500/5"
                }`}
                title={isListening ? "Stop listening" : "Voice input"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send / Stop */}
              {isLoading ? (
                <motion.button
                  type="button"
                  onClick={stop}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-all flex-shrink-0"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4" />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={!input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-xl transition-all flex-shrink-0 ${
                    input.trim()
                      ? "bg-gradient-to-br from-purple-500 to-fuchsia-500 text-white shadow-[0_0_15px_rgba(167,139,250,0.3)] hover:shadow-[0_0_25px_rgba(167,139,250,0.5)]"
                      : "bg-purple-500/5 text-text-dim cursor-not-allowed"
                  }`}
                  title="Send message"
                  id="send-button"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </form>

        {/* Voice error */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-red-400 mt-2 px-2"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <p className="text-xs text-text-dim text-center mt-2.5 opacity-60">
          UNIVAE can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
