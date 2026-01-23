import React from "react";
import { Sparkles } from "lucide-react";

interface AIChatLauncherProps {
  onClick: () => void;
}

export const AIChatLauncher: React.FC<AIChatLauncherProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Pulse ring effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 chat-launcher-ring" />

      {/* Main button */}
      <button
        onClick={onClick}
        className="animate-float relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group"
        aria-label="Open AI Assistant"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-violet-600 shadow-lg shadow-blue-500/40" />

        {/* Inner glow */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-blue-400/20 to-transparent" />

        {/* Shimmer overlay */}
        <div className="absolute inset-0 rounded-full animate-shimmer overflow-hidden" />

        {/* Icon */}
        <Sparkles
          size={24}
          className="relative text-white drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
        />
      </button>
    </div>
  );
};
