import React from "react";
import { Search, Plus } from "lucide-react";
import type { DashboardSidebarProps } from "../../types";
import { MealList } from "../meals";

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  meals,
  searchTerm,
  onSearchChange,
  onDragStart,
  onAddMealClick,
  isAddingMeal,
  isMobile = false,
}) => {
  if (isMobile) {
    return (
      <div className="animate-fade-in">
        <div className="bg-gray-800 rounded-xl p-4">
          <h2 className="text-white font-semibold text-lg mb-4">
            My Meals ({meals.length})
          </h2>
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          <div className="meals-list-scrollable custom-scrollbar">
            <MealList
              meals={meals}
              searchTerm={searchTerm}
              onDragStart={onDragStart}
              isAddingMeal={isAddingMeal}
            />
          </div>

          <button
            onClick={onAddMealClick}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={16} />
            Add New Meal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 animate-slide-in-left">
      <div className="meals-list-container">
        <div className="bg-gray-800 rounded-xl p-4 flex flex-col h-full">
          <h2 className="text-white font-semibold text-lg mb-4">
            My Meals ({meals.length})
          </h2>
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search meals..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
            />
          </div>

          <div className="meals-list-scrollable-desktop custom-scrollbar flex-1 overflow-y-auto">
            <MealList
              meals={meals}
              searchTerm={searchTerm}
              onDragStart={onDragStart}
              isAddingMeal={isAddingMeal}
            />
          </div>

          <button
            onClick={onAddMealClick}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-4 flex-shrink-0"
          >
            <Plus size={16} />
            Add New Meal
          </button>
        </div>
      </div>
    </div>
  );
};
