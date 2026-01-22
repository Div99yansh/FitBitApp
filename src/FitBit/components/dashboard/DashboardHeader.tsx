import React from "react";
import { Calendar, LogOut, User as UserIcon } from "lucide-react";
import type { DashboardHeaderProps } from "../../types";

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  selectedDate,
  onDateChange,
  onLogout,
}) => {
  return (
    <div className="app-header">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white mb-1">FitBit</h1>
              <div className="w-24 h-1 bg-blue-400 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <UserIcon size={16} />
              <span>{user?.name}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
              <Calendar className="text-blue-400" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer"
              />
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
