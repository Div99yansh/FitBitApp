import React from "react";
import { MessageCircle } from "lucide-react";

interface AIChatLauncherProps {
  onClick: () => void;
}

export const AIChatLauncher: React.FC<AIChatLauncherProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="animate-bounce-in animate-pulse-glow fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Open AI Assistant"
    >
      <MessageCircle size={24} className="text-white" />
    </button>
  );
};
