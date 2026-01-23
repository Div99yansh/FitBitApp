import React, { useRef, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import type { ChatMessage as ChatMessageType } from "../../types";

interface AIChatOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (question: string) => void;
}

const TypingIndicator: React.FC = () => (
  <div className="animate-message-appear flex justify-start mb-4">
    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-blue-500/20">
      <Sparkles size={16} className="text-white" />
    </div>
    <div className="bg-gray-700/60 backdrop-blur-sm px-5 py-3.5 rounded-2xl rounded-bl-md border border-white/5">
      <div className="flex gap-1.5">
        <span className="animate-typing-dot w-2 h-2 bg-blue-400 rounded-full" />
        <span className="animate-typing-dot animate-typing-dot-delay-1 w-2 h-2 bg-blue-400 rounded-full" />
        <span className="animate-typing-dot animate-typing-dot-delay-2 w-2 h-2 bg-blue-400 rounded-full" />
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12">
    {/* Decorative background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
    </div>

    <div className="relative">
      {/* Icon container with glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl blur-xl opacity-40" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
          <Sparkles size={36} className="text-white" />
        </div>
      </div>

      <h4 className="text-white font-semibold text-lg mb-3">
        How can I help you today?
      </h4>
      <p className="text-gray-400 text-sm max-w-[280px] leading-relaxed">
        Ask me about your nutrition, workouts, and fitness goals. I can analyze
        your daily data and provide personalized insights.
      </p>

      {/* Suggestion chips */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {["How am I doing today?", "Analyze my macros", "Workout tips"].map(
          (suggestion) => (
            <span
              key={suggestion}
              className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 border border-white/5 rounded-full text-xs text-gray-300 cursor-pointer transition-colors"
            >
              {suggestion}
            </span>
          )
        )}
      </div>
    </div>
  </div>
);

export const AIChatOverlay: React.FC<AIChatOverlayProps> = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Chat Panel with glass morphism */}
      <div className="animate-slide-up-overlay fixed z-50 inset-4 lg:inset-auto lg:bottom-24 lg:right-6 lg:w-[440px] lg:h-[75vh] lg:max-h-[650px] glass-panel rounded-3xl shadow-2xl shadow-black/40 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="glass-header flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-4">
            {/* Animated icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl blur opacity-60" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-blue-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={22} className="text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold">AI Assistant</h3>
              <p className="text-gray-400 text-xs">Powered by AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label="Close chat"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative">
          {messages.length === 0 && !isLoading ? (
            <EmptyState />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="glass-input">
          <ChatInput onSend={onSendMessage} isDisabled={isLoading} />
        </div>
      </div>
    </>
  );
};
