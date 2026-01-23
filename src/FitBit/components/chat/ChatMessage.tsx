import React from "react";
import { Sparkles } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../../types";

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`animate-message-appear flex ${
        isUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {!isUser && (
        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-violet-500 rounded-xl flex items-center justify-center mr-3 flex-shrink-0 shadow-lg shadow-blue-500/20">
          <Sparkles size={16} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-3 ${
          isUser
            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-md shadow-lg shadow-blue-500/20"
            : "bg-gray-700/60 backdrop-blur-sm text-gray-100 rounded-2xl rounded-bl-md border border-white/5"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
      </div>
    </div>
  );
};
