import React from "react";
import { LayoutDashboard } from "lucide-react";

export const DashboardTab: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="bg-gray-800 rounded-xl p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <LayoutDashboard className="text-blue-400" size={32} />
          </div>
          <h2 className="text-white text-xl font-semibold">Dashboard</h2>
          <p className="text-gray-400 max-w-md">
            Your fitness overview and insights will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};
