import React from "react";
import { Bot } from "lucide-react";
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
      } mb-3`}
    >
      {!isUser && (
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
          <Bot size={16} className="text-blue-400" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
          isUser
            ? "bg-blue-600 text-white rounded-br-md"
            : "bg-gray-700 text-gray-100 rounded-bl-md"
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
