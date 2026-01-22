import React from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { DatePicker } from "../ui/DatePicker";
import type { DashboardHeaderProps } from "../../types";

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  selectedDate,
  onDateChange,
  onLogout,
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="app-header">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white mb-1">FitBit</h1>
              <div className="w-24 h-1 bg-blue-400 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <UserIcon size={16} />
              <span>{user?.name}</span>
            </div>
            <div className="flex gap-1 bg-gray-800 p-1 rounded-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DatePicker value={selectedDate} onChange={onDateChange} />

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
