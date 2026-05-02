"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImageIcon,
  Wand2,
  Download,
  RefreshCw,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

const STYLE_PRESETS = [
  "Photorealistic",
  "Digital Art",
  "Anime",
  "Oil Painting",
  "Cinematic",
  "Cyberpunk",
  "Fantasy",
  "Minimalist",
];

const ASPECT_RATIOS = [
  { label: "1:1", value: "1024x1024" },
  { label: "16:9", value: "1792x1024" },
  { label: "9:16", value: "1024x1792" },
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [aspectRatio, setAspectRatio] = useState("1024x1024");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `${prompt}, ${style} style`, size: aspectRatio }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await response.json();
      setGeneratedImages((prev) => [data.url, ...prev].slice(0, 8));
      setSelectedImage(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (url: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = `univae-${Date.now()}.png`;
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
              <div className="p-2 rounded-xl bg-accent-purple/20 border border-accent-purple/30">
                <ImageIcon className="w-5 h-5 text-accent-purple" />
              </div>
              <h2 className="text-2xl font-bold text-white">Image Generator</h2>
            </div>
            <p className="text-text-muted text-sm">
              Transform your ideas into stunning visuals using DALL·E 3 and other AI models.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Controls */}
            <div className="space-y-5">
              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Describe your image
                </label>
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A majestic eagle soaring over neon-lit cyberpunk city at dusk, highly detailed, cinematic lighting..."
                    rows={4}
                    className="w-full glass rounded-xl border border-white/8 text-white placeholder-text-dim resize-none outline-none p-4 text-sm leading-relaxed focus:border-accent-purple/50 focus:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all"
                  />
                </div>
              </div>

              {/* Style presets */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">Style</label>
                <div className="flex flex-wrap gap-2">
                  {STYLE_PRESETS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        style === s
                          ? "bg-accent-purple/20 border-accent-purple/40 text-accent-purple"
                          : "bg-white/3 border-white/8 text-text-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect ratio */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Aspect Ratio
                </label>
                <div className="flex gap-2">
                  {ASPECT_RATIOS.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => setAspectRatio(r.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        aspectRatio === r.value
                          ? "bg-accent-purple/20 border-accent-purple/40 text-accent-purple"
                          : "bg-white/3 border-white/8 text-text-muted hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
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
                    ? "bg-gradient-to-r from-accent-purple to-accent-magenta text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
                    : "bg-white/5 text-text-dim cursor-not-allowed"
                }`}
                id="generate-image-button"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Generate Image
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Right: Preview */}
            <div className="space-y-4">
              {/* Main preview */}
              <div className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/8">
                {isGenerating ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 rounded-full border-2 border-accent-purple border-t-transparent"
                    />
                    <p className="text-sm text-text-muted">Crafting your vision...</p>
                  </div>
                ) : selectedImage ? (
                  <>
                    <Image
                      src={selectedImage}
                      alt="Generated image"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                    />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <button
                        onClick={() => handleDownload(selectedImage)}
                        className="p-2 rounded-lg glass border border-white/10 text-white hover:bg-white/20 transition-all"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-dim">
                    <ImageIcon className="w-16 h-16 opacity-20" />
                    <p className="text-sm">Your generated image will appear here</p>
                  </div>
                )}
              </div>

              {/* Gallery */}
              {generatedImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {generatedImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-lg overflow-hidden border transition-all ${
                        selectedImage === img
                          ? "border-accent-purple/60 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                          : "border-white/8 hover:border-white/20"
                      }`}
                    >
                      <div className="relative w-full h-full">
                        <Image src={img} alt={`Generated ${i + 1}`} fill className="object-cover" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
