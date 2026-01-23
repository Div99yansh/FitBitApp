import React from "react";
import { Bot, Sparkles, Send } from "lucide-react";

export const AIChatbotPlaceholder: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
          <Bot size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">AI Assistant</h3>
          <p className="text-gray-400 text-xs">Your fitness companion</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Sparkles size={32} className="text-blue-400" />
        </div>
        <h4 className="text-white font-medium mb-2">Coming Soon</h4>
        <p className="text-gray-400 text-sm max-w-[200px]">
          Ask questions about your nutrition and workout data, get personalized
          recommendations, and track your progress.
        </p>
      </div>

      <div className="mt-6">
        <div className="bg-gray-700 rounded-lg p-3 flex items-center gap-3 opacity-50 cursor-not-allowed">
          <input
            type="text"
            placeholder="Ask me anything..."
            className="bg-transparent text-gray-400 text-sm flex-1 outline-none"
            disabled
          />
          <button
            className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
            disabled
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
