import React from "react";
import type { DashboardTabsProps } from "../../types";

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex-1 lg:flex-none px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
