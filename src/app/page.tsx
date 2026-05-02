"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Brain,
  Zap,
  Globe,
  Shield,
  ArrowRight,
  Star,
  Check,
} from "lucide-react";
import Link from "next/link";

// ============================================
// Canvas Starfield — 200 stars + shooting stars
// ============================================
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Star colors matching UNIVAE palette
    const COLORS = [
      "rgba(167,139,250,", // purple
      "rgba(232,121,249,", // magenta
      "rgba(103,232,249,", // cyan
      "rgba(251,191,36,",  // saffron
      "rgba(255,255,255,", // white
    ];

    type Star = {
      x: number; y: number; r: number;
      speed: number; phase: number;
      color: string; twinkleSpeed: number;
    };

    type Shooter = {
      x: number; y: number; len: number;
      speed: number; angle: number; alpha: number; active: boolean;
    };

    const stars: Star[] = Array.from({ length: 200 }, () => ({
      x: Math.random() * (canvas.width || 1920),
      y: Math.random() * (canvas.height || 1080),
      r: Math.random() * 1.6 + 0.3,
      speed: Math.random() * 0.003 + 0.001,
      phase: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkleSpeed: Math.random() * 0.02 + 0.008,
    }));

    const shooter: Shooter = {
      x: 0, y: 0, len: 0,
      speed: 0, angle: 0, alpha: 0, active: false,
    };

    let frame = 0;
    let raf: number;

    const spawnShooter = () => {
      shooter.x = Math.random() * canvas.width * 0.7;
      shooter.y = Math.random() * canvas.height * 0.4;
      shooter.len = Math.random() * 180 + 80;
      shooter.speed = Math.random() * 12 + 8;
      shooter.angle = (Math.random() * 30 + 20) * (Math.PI / 180);
      shooter.alpha = 1;
      shooter.active = true;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      // Twinkling stars
      stars.forEach((s) => {
        const opacity = 0.3 + 0.7 * Math.abs(Math.sin(frame * s.twinkleSpeed + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color + opacity.toFixed(2) + ")";
        ctx.fill();
      });

      // Shooting star
      if (shooter.active) {
        const dx = Math.cos(shooter.angle) * shooter.len;
        const dy = Math.sin(shooter.angle) * shooter.len;
        const grad = ctx.createLinearGradient(
          shooter.x, shooter.y,
          shooter.x + dx, shooter.y + dy
        );
        grad.addColorStop(0, `rgba(255,255,255,${shooter.alpha})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.moveTo(shooter.x, shooter.y);
        ctx.lineTo(shooter.x + dx, shooter.y + dy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        shooter.x += Math.cos(shooter.angle) * shooter.speed;
        shooter.y += Math.sin(shooter.angle) * shooter.speed;
        shooter.alpha -= 0.018;
        if (shooter.alpha <= 0) shooter.active = false;
      } else if (frame % 240 === 0) {
        spawnShooter();
      }

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}

// ============================================
// UNIVAE Cosmic Logo SVG
// ============================================
function UnivaeLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cosmicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="35%" stopColor="#A78BFA" />
          <stop offset="65%" stopColor="#E879F9" />
          <stop offset="100%" stopColor="#67E8F9" />
        </linearGradient>
        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E879F9" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
        </radialGradient>
        <filter id="cosmicBlur">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      {/* Outer cosmic ring */}
      <circle cx="60" cy="60" r="45" stroke="url(#cosmicGrad)" strokeWidth="1.5" opacity="0.4" fill="none" />
      <circle cx="60" cy="60" r="38" stroke="url(#cosmicGrad)" strokeWidth="0.8" opacity="0.2" fill="none" />
      {/* Core glow */}
      <circle cx="60" cy="60" r="25" fill="url(#coreGlow)" />
      {/* Central U shape — representing the Universe */}
      <path
        d="M42 40 L42 62 C42 74 50 82 60 82 C70 82 78 74 78 62 L78 40"
        stroke="url(#cosmicGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
        filter="url(#cosmicBlur)"
      />
      {/* Orbital dots */}
      <circle cx="60" cy="25" r="3" fill="#67E8F9" opacity="0.9" />
      <circle cx="85" cy="45" r="2.5" fill="#E879F9" opacity="0.7" />
      <circle cx="35" cy="45" r="2" fill="#A78BFA" opacity="0.8" />
      {/* Star accent at top */}
      <path
        d="M60 12 L61.5 16 L66 16 L62.5 18.5 L63.5 23 L60 20.5 L56.5 23 L57.5 18.5 L54 16 L58.5 16 Z"
        fill="#FBBF24"
        opacity="0.9"
      />
    </svg>
  );
}

// ============================================
// Hero Section — Cosmic
// ============================================
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08061a] via-[#03020a] to-[#03020a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(232,121,249,0.06)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(103,232,249,0.04)_0%,transparent_40%)]" />
      <Starfield />

      {/* Nebula orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[150px]"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-fuchsia-500/5 blur-[150px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-400/3 blur-[120px]"
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <UnivaeLogo className="w-28 h-28 mx-auto drop-shadow-[0_0_40px_rgba(167,139,250,0.5)]" />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-8 border border-purple-500/20"
        >
          <Sparkles className="w-4 h-4 text-accent-saffron" />
          <span className="text-sm text-text-secondary">
            Powered by GPT-4o · Gemini 2.5 · Claude Sonnet 4 · Grok 3
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6"
        >
          <span className="gradient-text">UNIVAE</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-text-secondary font-light mb-4 leading-relaxed"
        >
          Beyond the Universe
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-base sm:text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The cosmic intelligence that transcends boundaries. Chat with the most
          powerful AI models, generate stellar visuals & cinematic videos — all in
          one infinite, galactic experience.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/chat"
            className="group btn-primary inline-flex items-center gap-2 text-lg px-8 py-3.5"
          >
            Enter the Cosmos
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href="#features"
            className="btn-secondary inline-flex items-center gap-2 text-lg px-8 py-3.5"
          >
            Explore the Galaxy
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "6+", label: "AI Models" },
            { value: "∞", label: "Possibilities" },
            { value: "0", label: "Cost to Start" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </div>
              <div className="text-sm text-text-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-purple-400/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-accent-purple"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ============================================
// Features Section — Cosmic
// ============================================
const FEATURES = [
  {
    icon: MessageSquare,
    title: "Multi-Model Chat",
    description: "Switch between GPT-4o, Gemini, Claude, and Grok in real-time. Streaming responses with full context memory.",
    color: "text-accent-indigo",
    glow: "group-hover:shadow-[0_0_30px_rgba(129,140,248,0.15)]",
  },
  {
    icon: ImageIcon,
    title: "Stellar Image Gen",
    description: "Create stunning cosmic visuals with DALL·E 3, Stable Diffusion, and more. Text-to-image across galaxies.",
    color: "text-accent-purple",
    glow: "group-hover:shadow-[0_0_30px_rgba(167,139,250,0.15)]",
  },
  {
    icon: Video,
    title: "Cinematic Videos",
    description: "Transform text into cinematic video clips with Runway, Kling, and Veo. Reality from imagination.",
    color: "text-accent-magenta",
    glow: "group-hover:shadow-[0_0_30px_rgba(232,121,249,0.15)]",
  },
  {
    icon: Brain,
    title: "Deep Reasoning",
    description: "Advanced math, coding, science, and analysis. Multi-step reasoning with chain-of-thought cognition.",
    color: "text-accent-cyan",
    glow: "group-hover:shadow-[0_0_30px_rgba(103,232,249,0.15)]",
  },
  {
    icon: Zap,
    title: "Warp Speed",
    description: "Optimized streaming, intelligent model routing, and edge-deployed infrastructure for instant responses.",
    color: "text-accent-saffron",
    glow: "group-hover:shadow-[0_0_30px_rgba(251,191,36,0.15)]",
  },
  {
    icon: Globe,
    title: "Web Search & Tools",
    description: "Real-time web search, code execution, file analysis, and agentic tool use — built into the cosmos.",
    color: "text-accent-stellar",
    glow: "group-hover:shadow-[0_0_30px_rgba(56,189,248,0.15)]",
  },
  {
    icon: Shield,
    title: "Privacy Nebula",
    description: "Your conversations are encrypted in the void. Optional memory features you control. No data sold, ever.",
    color: "text-accent-aurora",
    glow: "group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)]",
  },
  {
    icon: Sparkles,
    title: "Custom Dimensions",
    description: "General, Creative, Coding, Academic, Fun — each mode tunes the AI for your specific cosmic journey.",
    color: "text-accent-nebula",
    glow: "group-hover:shadow-[0_0_30px_rgba(192,132,252,0.15)]",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Everything in the <span className="gradient-text">Cosmos</span>
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            One platform. Multiple AI models. Unlimited creative and analytical power
            across infinite dimensions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group glass-card rounded-2xl p-6 cursor-default ${feature.glow}`}
            >
              <feature.icon
                className={`w-10 h-10 ${feature.color} mb-4 transition-transform group-hover:scale-110`}
              />
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Pricing Section — Cosmic
// ============================================
const PLANS = [
  {
    name: "Explorer",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring the cosmos",
    features: [
      "50 messages/day",
      "GPT-4o Mini & Gemini Flash",
      "Basic image generation",
      "Conversation history (7 days)",
      "Standard speed",
    ],
    cta: "Start Exploring",
    popular: false,
  },
  {
    name: "Voyager",
    price: "$20",
    period: "/month",
    description: "For those who demand infinite power",
    features: [
      "Unlimited messages",
      "All models (GPT-4o, Claude, Grok 3)",
      "HD image & video generation",
      "Unlimited conversation history",
      "Warp speed & priority access",
      "File analysis & web search",
      "Custom instructions & memory",
      "API access",
    ],
    cta: "Become a Voyager",
    popular: true,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(232,121,249,0.04)_0%,transparent_70%)]" />
      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Simple, <span className="gradient-text">Cosmic</span> Pricing
          </h2>
          <p className="text-text-muted text-lg">
            Start free. Ascend when you need more power.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "glass-strong gradient-border glow-purple"
                  : "glass-card"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-xs font-semibold text-white flex items-center gap-1">
                  <Star className="w-3 h-3" /> Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
              <p className="text-text-muted text-sm mb-4">{plan.description}</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold gradient-text">{plan.price}</span>
                <span className="text-text-muted">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-accent-purple flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/chat"
                className={`block text-center w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================
// Footer — Cosmic
// ============================================
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-purple-500/5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <UnivaeLogo className="w-8 h-8" />
          <span className="text-lg font-bold gradient-text">UNIVAE</span>
        </div>
        <p className="text-text-muted text-sm">
          © {new Date().getFullYear()} UNIVAE. Crafted beyond the cosmos ✦
        </p>
        <div className="flex items-center gap-6">
          <Link href="/chat" className="text-sm text-text-muted hover:text-white transition-colors">
            Chat
          </Link>
          <a href="#features" className="text-sm text-text-muted hover:text-white transition-colors">
            Features
          </a>
          <a href="#pricing" className="text-sm text-text-muted hover:text-white transition-colors">
            Pricing
          </a>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Landing Page
// ============================================
export default function LandingPage() {
  return (
    <main className="bg-background min-h-screen">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </main>
  );
}
