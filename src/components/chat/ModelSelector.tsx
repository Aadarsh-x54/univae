"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MODELS } from "@/lib/models";
import { useAppStore } from "@/lib/store";
import { Check, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ModelSelectorProps {
  onClose: () => void;
}

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  google: "Google",
  anthropic: "Anthropic",
  xai: "xAI",
};

const PROVIDER_COLORS: Record<string, string> = {
  openai: "#10A37F",
  google: "#4285F4",
  anthropic: "#D97706",
  xai: "#1DA1F2",
};

export default function ModelSelector({ onClose }: ModelSelectorProps) {
  const { selectedModel, setSelectedModel } = useAppStore();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Group models by provider
  const grouped = MODELS.reduce<Record<string, typeof MODELS>>((acc, model) => {
    if (!acc[model.provider]) acc[model.provider] = [];
    acc[model.provider].push(model);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        ref={ref}
        className="absolute top-14 right-4 z-50 w-80 glass-strong rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Select Model</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors text-text-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-96 p-2">
          {Object.entries(grouped).map(([provider, models]) => (
            <div key={provider} className="mb-3">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: PROVIDER_COLORS[provider] }}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-text-dim">
                  {PROVIDER_LABELS[provider]}
                </span>
              </div>
              <div className="space-y-0.5">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model.id);
                      onClose();
                    }}
                    className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                      selectedModel === model.id
                        ? "bg-accent-indigo/10 border border-accent-indigo/20"
                        : "hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span className="text-lg mt-0.5">{model.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{model.name}</span>
                        {selectedModel === model.id && (
                          <Check className="w-4 h-4 text-accent-indigo flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">
                        {model.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
