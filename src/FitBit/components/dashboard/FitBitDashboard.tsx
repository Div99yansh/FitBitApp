import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context";
import { useMeals, useDayMeals, useMealDragDrop, useSnackbar } from "../../hooks";
import { injectStyles } from "../../styles/animations";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
import { MealCategory } from "../meals";
import { AddMealModal } from "../meals";
import { Snackbar } from "../ui";
import type { Meal } from "../../types";

export const FitBitDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Custom hooks
  const { allMeals, loading, error, isAddingMeal, addMeal } = useMeals(token);
  const {
    mealCategories,
    isSaving,
    hasCategoryChanges,
    handleDropMeal,
    handleRemoveMeal,
    saveMeals,
  } = useDayMeals(selectedDate, token);
  const { handleDragStart } = useMealDragDrop();
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // Inject styles
  useEffect(() => {
    injectStyles();
  }, []);

  const handleMealDrop = useCallback(
    (categoryId: string, meal: Meal) => {
      const result = handleDropMeal(categoryId, meal);
      if (!result.success) {
        showSnackbar(result.message, "error");
      }
      return result;
    },
    [handleDropMeal, showSnackbar]
  );

  const handleSaveMeals = async (categoryId: string) => {
    const result = await saveMeals(categoryId);
    showSnackbar(result.message, result.success ? "success" : "error");
  };

  const handleAddCustomMeal = async (mealName: string) => {
    await addMeal(mealName);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading meals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader
        user={user}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onLogout={logout}
      />

      <div className="main-content max-w-7xl mx-auto px-6">
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          <DashboardSidebar
            meals={allMeals}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDragStart={handleDragStart}
            onAddMealClick={() => setIsModalOpen(true)}
            isAddingMeal={isAddingMeal}
          />

          <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
            {mealCategories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <MealCategory
                  category={category}
                  onDropMeal={handleMealDrop}
                  onRemoveMeal={handleRemoveMeal}
                  onDragStart={handleDragStart}
                  onSaveMeals={handleSaveMeals}
                  isSaving={isSaving}
                  hasChanges={hasCategoryChanges(category.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden space-y-6">
          <DashboardSidebar
            meals={allMeals}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onDragStart={handleDragStart}
            onAddMealClick={() => setIsModalOpen(true)}
            isAddingMeal={isAddingMeal}
            isMobile
          />

          {mealCategories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MealCategory
                category={category}
                onDropMeal={handleMealDrop}
                onRemoveMeal={handleRemoveMeal}
                onDragStart={handleDragStart}
                onSaveMeals={handleSaveMeals}
                isSaving={isSaving}
                hasChanges={hasCategoryChanges(category.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMeal={handleAddCustomMeal}
      />

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </div>
  );
};
