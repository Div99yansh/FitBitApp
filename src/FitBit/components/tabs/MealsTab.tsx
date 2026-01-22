import React, { useState, useCallback } from "react";
import { useMeals, useDayMeals, useMealDragDrop } from "../../hooks";
import { DashboardSidebar } from "../dashboard/DashboardSidebar";
import { MealCategory, AddMealModal } from "../meals";
import type { Meal, MealsTabProps } from "../../types";

export const MealsTab: React.FC<MealsTabProps> = ({
  token,
  selectedDate,
  onShowSnackbar,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleMealDrop = useCallback(
    (categoryId: string, meal: Meal) => {
      const result = handleDropMeal(categoryId, meal);
      if (!result.success) {
        onShowSnackbar(result.message, "error");
      }
      return result;
    },
    [handleDropMeal, onShowSnackbar]
  );

  const handleSaveMeals = async (categoryId: string) => {
    const result = await saveMeals(categoryId);
    onShowSnackbar(result.message, result.success ? "success" : "error");
  };

  const handleAddCustomMeal = async (mealName: string) => {
    await addMeal(mealName);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading meals...</div>
      </div>
    );
  }

  return (
    <>
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

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMeal={handleAddCustomMeal}
      />
    </>
  );
};
