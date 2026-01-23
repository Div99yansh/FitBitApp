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
    <div className="flex items-center gap-3 p-4 border-t border-gray-700 bg-gray-800">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        className="flex-1 bg-gray-700 text-white text-sm px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSend}
        disabled={isDisabled || !input.trim()}
        className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-colors"
      >
        <Send size={18} className="text-white" />
      </button>
    </div>
  );
};
