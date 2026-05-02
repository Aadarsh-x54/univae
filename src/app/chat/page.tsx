"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useAppStore, generateId } from "@/lib/store";
import { MODE_SYSTEM_PROMPTS, MODELS } from "@/lib/models";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatInput from "@/components/chat/ChatInput";
import MessageBubble from "@/components/chat/MessageBubble";
import WelcomeScreen from "@/components/chat/WelcomeScreen";
import ModelSelector from "@/components/chat/ModelSelector";
import TypingIndicator from "@/components/chat/TypingIndicator";
import ImageGenerator from "@/components/image/ImageGenerator";
import VideoGenerator from "@/components/video/VideoGenerator";
import SettingsPanel from "@/components/settings/SettingsPanel";
import UserSetupModal from "@/components/auth/UserSetupModal";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  ImageIcon,
  Video,
  MessageSquare,
  Settings,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Conversation, SerializedMessage } from "@/lib/types";
import { exportAsMarkdown, exportAsPDF } from "@/lib/export";
import { useSession } from "next-auth/react";

export default function ChatPage() {
  const {
    sidebarOpen,
    toggleSidebar,
    selectedModel,
    selectedMode,
    activeTab,
    setActiveTab,
    conversations,
    activeConversationId,
    setActiveConversation,
    addConversation,
    updateConversation,
    settingsOpen,
    setSettingsOpen,
    temperature,
    maxTokens,
    customSystemPrompt,
    fetchConversations,
  } = useAppStore();

  const { data: session, status: sessionStatus } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [input, setInput] = useState("");
  const [showUserSetup, setShowUserSetup] = useState(false);

  // Show user setup on first visit if unauthenticated, otherwise fetch remote convos
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      const timer = setTimeout(() => setShowUserSetup(true), 800);
      return () => clearTimeout(timer);
    } else if (sessionStatus === "authenticated" && session?.user?.id) {
      fetchConversations(session.user.id);
    }
  }, [sessionStatus, session, fetchConversations]);

  const systemPrompt =
    customSystemPrompt ||
    MODE_SYSTEM_PROMPTS[selectedMode] ||
    MODE_SYSTEM_PROMPTS.general;

  const activeModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: {
          model: selectedModel,
          systemPrompt,
          temperature,
          maxTokens,
        },
      }),
    [selectedModel, systemPrompt, temperature, maxTokens]
  );

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport,
    onFinish: (message) => {
      // Save serialized conversation messages when AI finishes
      if (activeConversationId) {
        const serialized: SerializedMessage[] = messages
          .concat(message as any)
          .filter((m) => m.role === "user" || m.role === "assistant")
          .map((m) => ({
            id: m.id,
            role: m.role as "user" | "assistant",
            content: m.parts
              ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("") ?? "",
            createdAt: new Date().toISOString(),
          }));

        updateConversation(activeConversationId, {
          updatedAt: new Date(),
          messages: serialized,
        }, session?.user?.id);
      }
    },
  });

  const isLoading = status === "streaming" || status === "submitted";

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setActiveConversation(null);
    setInput("");
  }, [setMessages, setActiveConversation]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim() || isLoading) return;

      // If no active conversation, create one
      if (!activeConversationId && input.trim()) {
        const newConv: Conversation = {
          id: generateId(),
          title: input.trim().slice(0, 60) + (input.trim().length > 60 ? "..." : ""),
          messages: [],
          model: selectedModel,
          mode: selectedMode,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        addConversation(newConv, session?.user?.id);
        setActiveConversation(newConv.id);
      }

      sendMessage({ text: input.trim() });
      setInput("");
    },
    [input, isLoading, activeConversationId, selectedModel, selectedMode, addConversation, setActiveConversation, sendMessage, session]
  );

  const handleSuggestionClick = useCallback(
    (prompt: string) => {
      const newConv: Conversation = {
        id: generateId(),
        title: prompt.slice(0, 60) + (prompt.length > 60 ? "..." : ""),
        messages: [],
        model: selectedModel,
        mode: selectedMode,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      addConversation(newConv, session?.user?.id);
      setActiveConversation(newConv.id);
      sendMessage({ text: prompt });
    },
    [selectedModel, selectedMode, addConversation, setActiveConversation, sendMessage, session]
  );

  // Export handlers — build SerializedMessage array from current messages
  const getExportData = useCallback(() => {
    const activeConv = conversations.find((c) => c.id === activeConversationId);
    const serializedMsgs: SerializedMessage[] = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({
        id: m.id,
        role: m.role as "user" | "assistant",
        content: m.parts
          ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
          .map((p) => p.text)
          .join("") ?? "",
        createdAt: new Date().toISOString(),
      }));

    return {
      title: activeConv?.title || "UNIVAE Conversation",
      model: activeModel.name,
      mode: selectedMode,
      createdAt: activeConv?.createdAt ? new Date(activeConv.createdAt) : new Date(),
      messages: serializedMsgs,
    };
  }, [messages, conversations, activeConversationId, activeModel, selectedMode]);

  const handleExportMarkdown = useCallback(() => {
    exportAsMarkdown(getExportData());
  }, [getExportData]);

  const handleExportPDF = useCallback(() => {
    exportAsPDF(getExportData());
  }, [getExportData]);

  // Tab buttons for chat/image/video
  const tabs = [
    { id: "chat" as const, icon: MessageSquare, label: "Chat" },
    { id: "image" as const, icon: ImageIcon, label: "Image" },
    { id: "video" as const, icon: Video, label: "Video" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="flex-shrink-0 overflow-hidden"
          >
            <ChatSidebar onNewChat={handleNewChat} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 border-b border-white/5 glass">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-muted hover:text-white"
              aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {sidebarOpen ? (
                <PanelLeftClose className="w-5 h-5" />
              ) : (
                <PanelLeftOpen className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleNewChat}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-muted hover:text-white"
              aria-label="New chat"
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Tab switcher */}
            <div className="flex items-center ml-2 gap-0.5 p-0.5 rounded-lg bg-white/3 border border-white/5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-accent-indigo/20 text-accent-indigo border border-accent-indigo/20"
                      : "text-text-muted hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Model selector button */}
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass hover:bg-white/5 transition-all text-sm"
            >
              <span className="text-base">{activeModel.icon}</span>
              <span className="text-text-secondary hidden sm:inline">{activeModel.name}</span>
              <Sparkles className="w-3.5 h-3.5 text-accent-indigo" />
            </button>

            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors text-text-muted hover:text-white"
              id="header-settings-button"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Model Selector Dropdown */}
        <AnimatePresence>
          {showModelSelector && (
            <ModelSelector onClose={() => setShowModelSelector(false)} />
          )}
        </AnimatePresence>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "chat" && (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">
                  {messages.length === 0 ? (
                    <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
                  ) : (
                    <>
                      {messages.map((msg, i) => (
                        <MessageBubble
                          key={msg.id}
                          message={msg}
                          isLast={i === messages.length - 1}
                          model={activeModel}
                        />
                      ))}
                      {isLoading && messages[messages.length - 1]?.role === "user" && (
                        <TypingIndicator model={activeModel} />
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Chat Input */}
              <ChatInput
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSendMessage}
                isLoading={isLoading}
                stop={stop}
                hasMessages={messages.length > 0}
                onExportMarkdown={handleExportMarkdown}
                onExportPDF={handleExportPDF}
              />
            </div>
          )}

          {activeTab === "image" && <ImageGenerator />}
          {activeTab === "video" && <VideoGenerator />}
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel open={settingsOpen} />

      {/* User Setup Modal (first-time) */}
      <AnimatePresence>
        {showUserSetup && (
          <UserSetupModal onClose={() => setShowUserSetup(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
