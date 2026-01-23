import React, { useRef, useEffect } from "react";
import { X, Bot, Sparkles } from "lucide-react";
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
  <div className="animate-message-appear flex justify-start mb-3">
    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
      <Bot size={16} className="text-blue-400" />
    </div>
    <div className="bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
      <div className="flex gap-1">
        <span className="animate-typing-dot w-2 h-2 bg-gray-400 rounded-full" />
        <span className="animate-typing-dot animate-typing-dot-delay-1 w-2 h-2 bg-gray-400 rounded-full" />
        <span className="animate-typing-dot animate-typing-dot-delay-2 w-2 h-2 bg-gray-400 rounded-full" />
      </div>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
      <Sparkles size={32} className="text-blue-400" />
    </div>
    <h4 className="text-white font-medium mb-2">How can I help you?</h4>
    <p className="text-gray-400 text-sm max-w-[280px]">
      Ask questions about your nutrition, workouts, and fitness goals. I have
      access to your daily data and can provide personalized insights.
    </p>
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:bg-transparent"
        onClick={onClose}
      />

      {/* Chat Panel */}
      <div className="animate-slide-up-overlay fixed z-50 inset-4 lg:inset-auto lg:bottom-24 lg:right-6 lg:w-[420px] lg:h-[70vh] lg:max-h-[600px] bg-gray-800 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
              <p className="text-gray-400 text-xs">Your fitness companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-700 flex items-center justify-center transition-colors"
            aria-label="Close chat"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
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
        <ChatInput onSend={onSendMessage} isDisabled={isLoading} />
      </div>
    </>
  );
};
