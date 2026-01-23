import React, { useState } from "react";
import type { KeyboardEvent } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isDisabled: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isDisabled,
  placeholder = "Ask me anything...",
}) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !isDisabled) {
      onSend(trimmedInput);
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center gap-3 p-4">
      <div className="flex-1 relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isDisabled}
          className="w-full bg-gray-700/50 backdrop-blur-sm text-white text-sm px-4 py-3.5 rounded-xl border border-white/5 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        />
      </div>
      <button
        onClick={handleSend}
        disabled={isDisabled || !input.trim()}
        className="relative w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
      >
        {/* Button background */}
        <div
          className={`absolute inset-0 rounded-xl transition-all duration-200 ${
            input.trim() && !isDisabled
              ? "bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/30"
              : "bg-gray-700/50"
          }`}
        />
        <Send
          size={18}
          className={`relative transition-all duration-200 ${
            input.trim() && !isDisabled
              ? "text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              : "text-gray-500"
          }`}
        />
      </button>
    </div>
  );
};
