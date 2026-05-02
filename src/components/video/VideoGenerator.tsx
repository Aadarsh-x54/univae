"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Wand2, Download, RefreshCw, AlertCircle, Clock, CheckCircle } from "lucide-react";

const VIDEO_MODELS = [
  { id: "runway", name: "Runway Gen-4.5", desc: "High quality, 10s clips" },
  { id: "kling", name: "Kling 3.0", desc: "Fast generation, great motion" },
  { id: "veo", name: "Google Veo 3.1", desc: "Photorealistic, long clips" },
];

const DURATION_OPTIONS = ["3s", "5s", "10s"];

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState("runway");
  const [duration, setDuration] = useState("5s");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [fallbackImage, setFallbackImage] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "generating" | "completed" | "failed">("idle");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setStatus("generating");
    setError(null);
    setProgress(0);
    setVideoUrl(null);
    setFallbackImage(null);

    // Simulate progress while generating
    const prog = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 1500);

    try {
      const response = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: selectedModel, duration }),
      });

      clearInterval(prog);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await response.json();
      setProgress(100);
      setVideoUrl(data.url);
      setFallbackImage(data.fallbackImage || null);
      setStatus("completed");
    } catch (err: any) {
      clearInterval(prog);
      setError(err.message);
      setStatus("failed");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `univae-video-${Date.now()}.mp4`;
    a.click();
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-accent-magenta/20 border border-accent-magenta/30">
                <Video className="w-5 h-5 text-accent-magenta" />
              </div>
              <h2 className="text-2xl font-bold text-white">Video Generator</h2>
              <span className="px-2 py-0.5 rounded-full text-xs bg-accent-saffron/20 border border-accent-saffron/30 text-accent-saffron font-medium">
                Beta
              </span>
            </div>
            <p className="text-text-muted text-sm">
              Generate cinematic video clips from text using Runway, Kling, and Google Veo models.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div className="space-y-5">
              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Describe your video
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A golden eagle soaring in slow motion over Himalayan peaks at sunrise, cinematic drone shot, breathtaking..."
                  rows={4}
                  className="w-full glass rounded-xl border border-white/8 text-white placeholder-text-dim resize-none outline-none p-4 text-sm leading-relaxed focus:border-accent-magenta/50 focus:shadow-[0_0_20px_rgba(192,38,211,0.15)] transition-all"
                />
              </div>

              {/* Model selector */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  AI Model
                </label>
                <div className="space-y-2">
                  {VIDEO_MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        selectedModel === m.id
                          ? "bg-accent-magenta/10 border-accent-magenta/30 text-white"
                          : "bg-white/3 border-white/8 text-text-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                        selectedModel === m.id
                          ? "border-accent-magenta bg-accent-magenta"
                          : "border-white/30"
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-text-dim mt-0.5">{m.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Duration
                </label>
                <div className="flex gap-2">
                  {DURATION_OPTIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        duration === d
                          ? "bg-accent-magenta/20 border-accent-magenta/40 text-accent-magenta"
                          : "bg-white/3 border-white/8 text-text-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note about API */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-accent-saffron/5 border border-accent-saffron/20">
                <Clock className="w-4 h-4 text-accent-saffron flex-shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted">
                  Video generation can take 30–120 seconds depending on the model and duration.
                  API keys required for live generation.
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Generate button */}
              <motion.button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                whileHover={{ scale: prompt.trim() && !isGenerating ? 1.02 : 1 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                  prompt.trim() && !isGenerating
                    ? "bg-gradient-to-r from-accent-magenta to-accent-purple text-white shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_30px_rgba(192,38,211,0.5)]"
                    : "bg-white/5 text-text-dim cursor-not-allowed"
                }`}
                id="generate-video-button"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Video
                  </>
                )}
              </motion.button>
            </div>

            {/* Preview panel */}
            <div>
              <div className="relative rounded-2xl overflow-hidden glass border border-white/8 aspect-video bg-black/40">
                {status === "generating" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-14 h-14 rounded-full border-2 border-accent-magenta border-t-transparent"
                    />
                    <div className="w-full max-w-xs">
                      <div className="flex justify-between text-xs text-text-muted mb-1.5">
                        <span>Generating...</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-accent-magenta to-accent-purple"
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-text-muted text-center">
                      Crafting your cinematic vision...
                    </p>
                  </div>
                )}

                {status === "completed" && videoUrl && (
                  <>
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      loop
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute bottom-3 right-3">
                      <button
                        onClick={handleDownload}
                        className="p-2 rounded-lg glass border border-white/10 text-white hover:bg-white/20 transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}

                {status === "completed" && !videoUrl && fallbackImage && (
                  <div className="relative w-full h-full overflow-hidden flex items-center justify-center bg-black">
                    <motion.img
                      src={fallbackImage}
                      alt={prompt}
                      className="min-w-[110%] min-h-[110%] object-cover opacity-90"
                      animate={{
                        scale: [1, 1.05, 1],
                        x: ["0%", "-2%", "2%", "0%"],
                        y: ["0%", "1%", "-1%", "0%"]
                      }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full text-xs text-white/80">
                      Simulated Video (No API Key)
                    </div>
                  </div>
                )}

                {status === "idle" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-dim">
                    <Video className="w-16 h-16 opacity-20" />
                    <p className="text-sm">Your generated video will appear here</p>
                  </div>
                )}

                {status === "failed" && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-red-400">
                    <AlertCircle className="w-12 h-12 opacity-50" />
                    <p className="text-sm">Generation failed. Please try again.</p>
                  </div>
                )}
              </div>

              {status === "completed" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-green-400"
                >
                  <CheckCircle className="w-4 h-4" />
                  Video generated successfully!
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
