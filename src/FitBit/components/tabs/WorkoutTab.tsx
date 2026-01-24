import React, { useState, useCallback } from "react";
import { DndContext, DragOverlay, pointerWithin } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import { useWorkouts, useDayWorkouts, useWorkoutDragDrop, useDndSensors } from "../../hooks";
import { WorkoutSidebar, WorkoutCategory, AddWorkoutModal } from "../workouts";
import type { Workout, WorkoutTabProps } from "../../types";

export const WorkoutTab: React.FC<WorkoutTabProps> = ({
  token,
  selectedDate,
  onShowSnackbar,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  const sensors = useDndSensors();
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

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveWorkout(null);

      if (over && active.data.current?.type === "workout") {
        const workout = active.data.current.workout as Workout;
        const categoryId = over.data.current?.categoryId as string;
        if (categoryId) {
          handleWorkoutDrop(categoryId, workout);
        }
      }
    },
    [handleWorkoutDrop]
  );

  const handleDragStartEvent = useCallback(
    (event: DragStartEvent) => {
      const workout = event.active.data.current?.workout as Workout | undefined;
      if (workout) {
        setActiveWorkout(workout);
        handleDragStart(workout);
      }
    },
    [handleDragStart]
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
        <WorkoutSidebar
          workouts={allWorkouts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onDragStart={handleDragStart}
          onAddWorkoutClick={() => setIsModalOpen(true)}
          isAddingWorkout={isAddingWorkout}
        />

        <div className="lg:col-span-2 space-y-6">
          {workoutCategories.map((category) => (
            <div key={category.id}>
              <WorkoutCategory
                category={category}
                onDropWorkout={handleWorkoutDrop}
                onRemoveWorkout={handleRemoveWorkout}
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
              onSaveWorkouts={handleSaveWorkouts}
              isSaving={isSaving}
              hasChanges={hasCategoryChanges(category.id)}
            />
          </div>
        ))}
      </div>

      {/* Drag Overlay - follows cursor/finger precisely */}
      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeWorkout ? (
          <div className="bg-gray-700 rounded-lg p-3 shadow-2xl border-2 border-blue-400 cursor-grabbing w-64 pointer-events-none">
            <div className="font-medium text-white text-sm mb-2">
              {activeWorkout.name}
            </div>
            <div className="text-gray-300 text-xs">
              {activeWorkout.reps} reps • {activeWorkout.duration} min
            </div>
          </div>
        ) : null}
      </DragOverlay>

      <AddWorkoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddWorkout={handleAddCustomWorkout}
      />
    </DndContext>
  );
};
