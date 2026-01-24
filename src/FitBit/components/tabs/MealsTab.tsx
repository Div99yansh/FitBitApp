import React, { useState, useCallback } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useMeals, useDayMeals, useMealDragDrop, useDndSensors } from "../../hooks";
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
  const [activeMeal, setActiveMeal] = useState<Meal | null>(null);

  const sensors = useDndSensors();
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveMeal(null);

      if (over && active.data.current?.type === "meal") {
        const meal = active.data.current.meal as Meal;
        const categoryId = over.data.current?.categoryId as string;
        if (categoryId) {
          handleMealDrop(categoryId, meal);
        }
      }
    },
    [handleMealDrop]
  );

  const handleDragStartEvent = useCallback(
    (event: DragStartEvent) => {
      const meal = event.active.data.current?.meal as Meal | undefined;
      if (meal) {
        setActiveMeal(meal);
        handleDragStart(meal);
      }
    },
    [handleDragStart]
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
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStartEvent}
      onDragEnd={handleDragEnd}
    >
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

        <div className="lg:col-span-2 space-y-6">
          {mealCategories.map((category) => (
            <div key={category.id}>
              <MealCategory
                category={category}
                onDropMeal={handleMealDrop}
                onRemoveMeal={handleRemoveMeal}
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
              onSaveMeals={handleSaveMeals}
              isSaving={isSaving}
              hasChanges={hasCategoryChanges(category.id)}
            />
          </div>
        ))}
      </div>

      {/* Drag Overlay - follows cursor/finger precisely */}
      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeMeal ? (
          <div className="bg-gray-700 rounded-lg p-3 shadow-2xl border-2 border-blue-400 cursor-grabbing w-64 pointer-events-none">
            <div className="font-medium text-white text-sm mb-2">
              {activeMeal.name}
            </div>
            <div className="text-gray-300 text-xs">
              {activeMeal.calories} cal • {activeMeal.protein}g protein
            </div>
          </div>
        ) : null}
      </DragOverlay>

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMeal={handleAddCustomMeal}
      />
    </DndContext>
  );
};
