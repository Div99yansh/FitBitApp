import React from "react";
import { LayoutDashboard, Utensils, Dumbbell } from "lucide-react";
import type { Tab, TabId } from "../../types";

interface MobileTabBarProps {
  tabs: Tab[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

const tabIcons: Record<TabId, React.ReactNode> = {
  dashboard: <LayoutDashboard size={20} />,
  meals: <Utensils size={20} />,
  workout: <Dumbbell size={20} />,
};

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-gray-900 border-t border-gray-700 safe-area-bottom">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div
              className={`mb-1 transition-transform duration-200 ${
                activeTab === tab.id ? "scale-110" : ""
              }`}
            >
              {tabIcons[tab.id]}
            </div>
            <span className="text-xs font-medium">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-blue-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
