"use client";

import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";

import { useState } from "react";

interface UserSetupModalProps {
  onClose?: () => void;
}

export default function UserSetupModal({ onClose }: UserSetupModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (res?.error) {
          setError("Invalid email or password");
        } else {
          onClose?.();
          window.location.reload(); // Refresh to load session
        }
      } else {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json();
          setError(data.message || "Registration failed");
        } else {
          // Auto login after registration
          await signIn("credentials", {
            redirect: false,
            email,
            password,
          });
          onClose?.();
          window.location.reload();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(3, 2, 10, 0.85)", backdropFilter: "blur(20px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose?.()}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="w-full max-w-md rounded-3xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(18, 15, 42, 0.98) 0%, rgba(8, 6, 26, 0.98) 100%)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            boxShadow: "0 0 60px rgba(139, 92, 246, 0.15), 0 0 120px rgba(232, 121, 249, 0.05)",
          }}
        >
          <div className="relative px-8 pt-10 pb-10">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome to UNIVAE</h2>
            <p className="text-sm text-text-muted mb-8 text-center">
              {isLogin ? "Sign in to sync your cosmic journey." : "Create an account to begin."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-xs text-text-dim mb-1">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-accent-purple/50 transition-all"
                    placeholder="Cosmic Explorer"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-xs text-text-dim mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-accent-purple/50 transition-all"
                  placeholder="you@universe.com"
                />
              </div>

              <div>
                <label className="block text-xs text-text-dim mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-accent-purple/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && <p className="text-red-400 text-xs text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-fuchsia text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
              >
                {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-xs text-text-dim hover:text-white transition-colors block w-full"
              >
                {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
              </button>

              <button
                onClick={onClose}
                className="text-xs text-text-dim hover:text-white transition-colors block w-full"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
