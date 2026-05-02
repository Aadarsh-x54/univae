"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { Plus, Trash2, MessageSquare, Search, Settings, ChevronRight, User, LogOut } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import UserSetupModal from "@/components/auth/UserSetupModal";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

interface ChatSidebarProps {
  onNewChat: () => void;
}

function UnivaeLogo() {
  return (
    <svg viewBox="0 0 120 120" className="w-7 h-7" fill="none">
      <defs>
        <linearGradient id="sGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#E879F9" />
        </linearGradient>
      </defs>
      <circle cx="60" cy="60" r="45" stroke="url(#sGrad)" strokeWidth="1.5" opacity="0.4" fill="none" />
      <path d="M42 40 L42 62 C42 74 50 82 60 82 C70 82 78 74 78 62 L78 40" stroke="url(#sGrad)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="60" cy="25" r="3" fill="#67E8F9" opacity="0.9" />
      <circle cx="85" cy="45" r="2.5" fill="#E879F9" opacity="0.7" />
      <circle cx="35" cy="45" r="2" fill="#A78BFA" opacity="0.8" />
    </svg>
  );
}

export default function ChatSidebar({ onNewChat }: ChatSidebarProps) {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    deleteConversation,
    setSettingsOpen,
    settingsOpen,
  } = useAppStore();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {
    Today: filtered.filter((c) => {
      const d = new Date(c.updatedAt);
      return d.toDateString() === today.toDateString();
    }),
    Yesterday: filtered.filter((c) => {
      const d = new Date(c.updatedAt);
      return d.toDateString() === yesterday.toDateString();
    }),
    "Previous 7 Days": filtered.filter((c) => {
      const d = new Date(c.updatedAt);
      const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 1 && diff <= 7;
    }),
    Older: filtered.filter((c) => {
      const d = new Date(c.updatedAt);
      const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff > 7;
    }),
  };

  const userInitial = session?.user?.name?.charAt(0).toUpperCase() || "✦";
  const planColor = "from-blue-500 to-cyan-500";

  return (
    <>
      <div
        className="h-full flex flex-col overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #08061a 0%, #03020a 100%)",
          borderRight: "1px solid rgba(139, 92, 246, 0.08)",
          width: 300,
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center gap-2">
              <UnivaeLogo />
              <span className="font-bold text-sm gradient-text">UNIVAE</span>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent-purple/10 border border-accent-purple/20 text-accent-purple text-xs font-medium hover:bg-accent-purple/20 transition-all"
              id="new-chat-button"
            >
              <Plus className="w-3.5 h-3.5" />
              New Chat
            </motion.button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-dim" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-purple-500/3 border border-purple-500/8 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-text-dim outline-none focus:border-accent-purple/30 focus:bg-purple-500/5 transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-text-dim">
              <MessageSquare className="w-8 h-8 opacity-30" />
              <p className="text-xs text-center">
                {searchQuery ? "No chats found" : "No conversations yet.\nStart exploring!"}
              </p>
            </div>
          )}

          {Object.entries(groups).map(([label, convs]) => {
            if (convs.length === 0) return null;
            return (
              <div key={label} className="mb-4">
                <p className="text-xs font-medium text-text-dim px-3 mb-1.5 uppercase tracking-wider">
                  {label}
                </p>
                <div className="space-y-0.5">
                  <AnimatePresence>
                    {convs.map((conv) => (
                      <motion.div
                        key={conv.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative group"
                        onMouseEnter={() => setHoveredId(conv.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <button
                          onClick={() => setActiveConversation(conv.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                            activeConversationId === conv.id
                              ? "bg-accent-purple/10 border border-accent-purple/20 text-white"
                              : "text-text-muted hover:bg-purple-500/5 hover:text-white border border-transparent"
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60" />
                            <span className="line-clamp-1 text-xs leading-relaxed">{conv.title}</span>
                          </div>
                        </button>

                        {/* Delete button */}
                        <AnimatePresence>
                          {hoveredId === conv.id && (
                            <motion.button
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id, session?.user?.id);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-red-500/20 text-text-dim hover:text-red-400 transition-all"
                              title="Delete conversation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-3 border-t border-purple-500/5 space-y-1">
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-muted hover:text-white hover:bg-purple-500/5 transition-all"
            id="settings-button"
          >
            <Settings className="w-4 h-4" />
            <span className="text-xs">Settings</span>
            <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
          </button>

          {/* User profile */}
          {session ? (
            <div className="flex items-center gap-2">
              <button
                className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/5 transition-all cursor-pointer"
                id="user-profile-button"
              >
                {session.user?.image ? (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                    <Image src={session.user.image} alt={session.user.name || "User"} fill />
                  </div>
                ) : (
                  <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${planColor} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                    {userInitial}
                  </div>
                )}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-white truncate">{session.user?.name || "Cosmic Explorer"}</p>
                  <p className="text-xs text-text-dim">{session.user?.email || "Explorer"}</p>
                </div>
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-2 rounded-xl text-text-dim hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowUserModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-500/5 transition-all cursor-pointer"
              id="user-login-button"
            >
              <div className={`w-7 h-7 rounded-full bg-gradient-to-br from-purple-500/50 to-fuchsia-500/50 flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                ✦
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-medium text-white truncate">Guest Explorer</p>
                <p className="text-xs text-text-dim">Sign in to sync</p>
              </div>
              <User className="w-3 h-3 text-text-dim flex-shrink-0" />
            </button>
          )}
        </div>
      </div>

      {/* User Setup Modal */}
      <AnimatePresence>
        {showUserModal && (
          <UserSetupModal onClose={() => setShowUserModal(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
