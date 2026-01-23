import React from "react";
import { Lightbulb, TrendingUp, Target, Sparkles } from "lucide-react";

export const DailyInsightsPlaceholder: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
          <Lightbulb size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">Daily Insights</h3>
          <p className="text-gray-400 text-xs">AI-powered analysis</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
          <Sparkles size={32} className="text-amber-400" />
        </div>
        <h4 className="text-white font-medium mb-2">Coming Soon</h4>
        <p className="text-gray-400 text-sm max-w-[200px] mb-6">
          Get personalized daily insights based on your nutrition and workout
          data.
        </p>

        {/* Preview Items */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3 opacity-50">
            <TrendingUp size={18} className="text-green-400" />
            <span className="text-gray-400 text-xs">Progress tracking</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3 opacity-50">
            <Target size={18} className="text-blue-400" />
            <span className="text-gray-400 text-xs">Goal recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
};
