"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UIMessage } from "ai";
import { ModelConfig } from "@/lib/types";
import { Copy, Check, Volume2, RotateCcw, ThumbsUp, ThumbsDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import "katex/dist/katex.min.css";

interface MessageBubbleProps {
  message: UIMessage;
  isLast: boolean;
  model: ModelConfig;
}

// Helper to extract text content from UIMessage parts
function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-text-muted hover:text-white"
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ children, className }: { children: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const lang = className?.replace("language-", "") || "text";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-white/6 bg-black/40">
      {/* Code header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/3 border-b border-white/5">
        <span className="text-xs text-text-muted font-mono">{lang}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors px-2 py-0.5 rounded-md hover:bg-white/10"
        >
          {copied ? (
            <><Check className="w-3 h-3 text-green-400" /> Copied!</>
          ) : (
            <><Copy className="w-3 h-3" /> Copy</>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 text-sm">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}

function speakText(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const stripped = text.replace(/[#*`_~\[\]()>]/g, "").trim();
  const utterance = new SpeechSynthesisUtterance(stripped);
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

export default function MessageBubble({ message, isLast, model }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const [liked, setLiked] = useState<null | "up" | "down">(null);
  const textContent = getMessageText(message);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`flex gap-3 mb-6 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold bg-gradient-to-br from-accent-purple to-accent-magenta text-white">
          U
        </div>
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold bg-gradient-to-br from-accent-indigo to-accent-purple text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
        >
          {model.icon}
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Model label */}
        {!isUser && (
          <span className="text-xs text-text-dim mb-1.5 px-1">{model.name}</span>
        )}

        {/* Bubble */}
        {isUser ? (
          <div className="bg-gradient-to-br from-accent-indigo to-accent-purple text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            {textContent}
          </div>
        ) : (
          <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 border border-white/6">
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex, rehypeHighlight]}
                components={{
                  code({ className, children, ...props }) {
                    const isBlock = className?.startsWith("language-");
                    if (isBlock) {
                      return (
                        <CodeBlock className={className}>
                          {String(children).replace(/\n$/, "")}
                        </CodeBlock>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                  pre({ children }) {
                    return <>{children}</>;
                  },
                }}
              >
                {textContent}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Action buttons (AI messages only) */}
        {!isUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-0.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <CopyButton text={textContent} />
            <button
              onClick={() => speakText(textContent)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-text-muted hover:text-white"
              title="Read aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              className="p-1.5 rounded-lg hover:bg-white/10 transition-all text-text-muted hover:text-white"
              title="Regenerate"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={() => setLiked("up")}
              className={`p-1.5 rounded-lg transition-all ${
                liked === "up" ? "text-green-400" : "text-text-muted hover:text-white hover:bg-white/10"
              }`}
              title="Helpful"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLiked("down")}
              className={`p-1.5 rounded-lg transition-all ${
                liked === "down" ? "text-red-400" : "text-text-muted hover:text-white hover:bg-white/10"
              }`}
              title="Not helpful"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
