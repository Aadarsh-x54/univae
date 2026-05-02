import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Conversation, ChatMode, User } from "./types";

interface AppState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conv: Conversation, userId?: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>, userId?: string) => void;
  deleteConversation: (id: string, userId?: string) => void;
  clearAllConversations: () => void;
  fetchConversations: (userId: string) => Promise<void>;

  // Model & Mode
  selectedModel: string;
  selectedMode: ChatMode;
  setSelectedModel: (model: string) => void;
  setSelectedMode: (mode: ChatMode) => void;

  // Active tab
  activeTab: "chat" | "image" | "video";
  setActiveTab: (tab: "chat" | "image" | "video") => void;

  // Settings
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  temperature: number;
  setTemperature: (t: number) => void;
  maxTokens: number;
  setMaxTokens: (n: number) => void;
  customSystemPrompt: string;
  setCustomSystemPrompt: (p: string) => void;

  // User (mock auth - kept for backward compatibility if needed)
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Conversations
      conversations: [],
      activeConversationId: null,
      setActiveConversation: (id) => set({ activeConversationId: id }),
      
      addConversation: async (conv, userId) => {
        set((s) => ({ conversations: [conv, ...s.conversations] }));
        if (userId) {
          try {
            await fetch("/api/conversations", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(conv),
            });
          } catch (e) {
            console.error("Local sync error:", e);
          }
        }
      },
      
      updateConversation: async (id, updates, userId) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
          ),
        }));
        if (userId) {
          try {
            const conv = get().conversations.find((c) => c.id === id);
            if (conv) {
              await fetch(`/api/conversations/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: conv.title,
                  messages: conv.messages,
                  updatedAt: conv.updatedAt,
                }),
              });
            }
          } catch (e) {
            console.error("Local sync error:", e);
          }
        }
      },
      
      deleteConversation: async (id, userId) => {
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId:
            s.activeConversationId === id ? null : s.activeConversationId,
        }));
        if (userId) {
          try {
            await fetch(`/api/conversations/${id}`, {
              method: "DELETE",
            });
          } catch (e) {
            console.error("Local sync error:", e);
          }
        }
      },
      
      clearAllConversations: () =>
        set({ conversations: [], activeConversationId: null }),

      fetchConversations: async (userId) => {
        if (!userId) return;
        try {
          const res = await fetch("/api/conversations");
          if (res.ok) {
            const data = await res.json();
            const mapped = data.map((d: any) => ({
              id: d.id,
              title: d.title,
              messages: typeof d.messages === "string" ? JSON.parse(d.messages) : d.messages || [],
              model: d.model,
              mode: d.mode,
              createdAt: new Date(d.createdAt),
              updatedAt: new Date(d.updatedAt),
            }));
            set({ conversations: mapped });
          }
        } catch (e) {
          console.error("Local fetch error:", e);
        }
      },

      // Model & Mode
      selectedModel: "gemini-2.5-flash",
      selectedMode: "general",
      setSelectedModel: (model) => set({ selectedModel: model }),
      setSelectedMode: (mode) => set({ selectedMode: mode }),

      // Active tab
      activeTab: "chat",
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Settings
      settingsOpen: false,
      setSettingsOpen: (open) => set({ settingsOpen: open }),
      temperature: 0.7,
      setTemperature: (t) => set({ temperature: t }),
      maxTokens: 4096,
      setMaxTokens: (n) => set({ maxTokens: n }),
      customSystemPrompt: "",
      setCustomSystemPrompt: (p) => set({ customSystemPrompt: p }),

      // User
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "univae-store",
      partialize: (state) => ({
        conversations: state.conversations,
        selectedModel: state.selectedModel,
        selectedMode: state.selectedMode,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        customSystemPrompt: state.customSystemPrompt,
        user: state.user,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
