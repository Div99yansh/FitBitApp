import React, { useState, useCallback } from "react";
import { useWorkouts, useDayWorkouts, useWorkoutDragDrop } from "../../hooks";
import { WorkoutSidebar, WorkoutCategory, AddWorkoutModal } from "../workouts";
import type { Workout, WorkoutTabProps } from "../../types";

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  token,
  selectedDate,
  onShowSnackbar,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { allWorkouts, loading, error, isAddingWorkout, addWorkout } = useWorkouts(token);
  const {
    workoutCategories,
    isSaving,
    hasCategoryChanges,
    handleDropWorkout,
    handleRemoveWorkout,
    saveWorkouts,
  } = useDayWorkouts(selectedDate, token);
  const { handleDragStart } = useWorkoutDragDrop();

  const handleWorkoutDrop = useCallback(
    (categoryId: string, workout: Workout) => {
      const result = handleDropWorkout(categoryId, workout);
      if (!result.success) {
        onShowSnackbar(result.message, "error");
      }
      return result;
    },
    [handleDropWorkout, onShowSnackbar]
  );

  const handleSaveWorkouts = async (categoryId: string) => {
    const result = await saveWorkouts(categoryId);
    onShowSnackbar(result.message, result.success ? "success" : "error");
  };

  const handleAddCustomWorkout = async (name: string, reps: number, duration: number) => {
    await addWorkout(name, reps, duration);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading workouts...</div>
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
        <WorkoutSidebar
          workouts={allWorkouts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onDragStart={handleDragStart}
          onAddWorkoutClick={() => setIsModalOpen(true)}
          isAddingWorkout={isAddingWorkout}
        />

        <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
          {workoutCategories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <WorkoutCategory
                category={category}
                onDropWorkout={handleWorkoutDrop}
                onRemoveWorkout={handleRemoveWorkout}
                onDragStart={handleDragStart}
                onSaveWorkouts={handleSaveWorkouts}
                isSaving={isSaving}
                hasChanges={hasCategoryChanges(category.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden space-y-6">
        <WorkoutSidebar
          workouts={allWorkouts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onDragStart={handleDragStart}
          onAddWorkoutClick={() => setIsModalOpen(true)}
          isAddingWorkout={isAddingWorkout}
          isMobile
        />

        {workoutCategories.map((category, index) => (
          <div
            key={category.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <WorkoutCategory
              category={category}
              onDropWorkout={handleWorkoutDrop}
              onRemoveWorkout={handleRemoveWorkout}
              onDragStart={handleDragStart}
              onSaveWorkouts={handleSaveWorkouts}
              isSaving={isSaving}
              hasChanges={hasCategoryChanges(category.id)}
            />
          </div>
        ))}
      </div>

      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWorkout={handleAddCustomWorkout}
      />
    </>
  );
};
