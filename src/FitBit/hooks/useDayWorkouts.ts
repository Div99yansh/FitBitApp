import { useState, useEffect, useCallback } from "react";
import type { Workout, WorkoutCategory } from "../types";
import { apiCall } from "../api";

const createEmptyCategories = (): WorkoutCategory[] => [
  { id: "upperBody", name: "Upper Body", workouts: [] },
  { id: "lowerBody", name: "Lower Body", workouts: [] },
  { id: "core", name: "Core", workouts: [] },
  { id: "fullBody", name: "Full Body", workouts: [] },
];

export const useDayWorkouts = (selectedDate: string, token: string | null) => {
  const [workoutCategories, setWorkoutCategories] = useState<WorkoutCategory[]>(
    createEmptyCategories()
  );
  const [originalWorkoutCategories, setOriginalWorkoutCategories] = useState<
    WorkoutCategory[]
  >(createEmptyCategories());
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDayWorkouts = async () => {
      try {
        const data = await apiCall(
          `/fitbit/getUserDayWorkouts?date=${selectedDate}`,
          {},
          token
        );
        console.log("Workouts for selected date:", data);

        const categories = [
          { id: "upperBody", name: "Upper Body", workouts: data.upperBody || [] },
          { id: "lowerBody", name: "Lower Body", workouts: data.lowerBody || [] },
          { id: "core", name: "Core", workouts: data.core || [] },
          { id: "fullBody", name: "Full Body", workouts: data.fullBody || [] },
        ];
        setWorkoutCategories(categories);
        setOriginalWorkoutCategories(JSON.parse(JSON.stringify(categories)));
      } catch (e) {
        console.error("Error fetching day workouts:", e);
        const emptyCategories = createEmptyCategories();
        setWorkoutCategories(emptyCategories);
        setOriginalWorkoutCategories(JSON.parse(JSON.stringify(emptyCategories)));
      }
    };

    if (selectedDate) {
      fetchDayWorkouts();
    }
  }, [selectedDate, token]);

  const hasCategoryChanges = useCallback(
    (categoryId: string): boolean => {
      const currentCategory = workoutCategories.find(
        (cat) => cat.id === categoryId
      );
      const originalCategory = originalWorkoutCategories.find(
        (cat) => cat.id === categoryId
      );

      if (!currentCategory || !originalCategory) return false;

      if (currentCategory.workouts.length !== originalCategory.workouts.length)
        return true;

      const currentWorkoutIds = currentCategory.workouts.map((w) => w.id).sort();
      const originalWorkoutIds = originalCategory.workouts.map((w) => w.id).sort();

      return JSON.stringify(currentWorkoutIds) !== JSON.stringify(originalWorkoutIds);
    },
    [workoutCategories, originalWorkoutCategories]
  );

  const handleDropWorkout = useCallback(
    (
      categoryId: string,
      workout: Workout
    ): { success: boolean; message: string } => {
      const category = workoutCategories.find((cat) => cat.id === categoryId);
      if (!category) {
        return { success: false, message: "Category not found" };
      }

      const workoutExists = category.workouts.some((w) => w.id === workout.id);
      if (workoutExists) {
        return {
          success: false,
          message: `${workout.name} is already in ${category.name}`,
        };
      }

      setWorkoutCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              workouts: [...cat.workouts, workout],
            };
          }
          return cat;
        })
      );

      return { success: true, message: `${workout.name} added to ${category.name}` };
    },
    [workoutCategories]
  );

  const handleRemoveWorkout = useCallback(
    (categoryId: string, workoutId: string) => {
      setWorkoutCategories((prev) =>
        prev.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              workouts: category.workouts.filter((workout) => workout.id !== workoutId),
            };
          }
          return category;
        })
      );
    },
    []
  );

  const saveWorkouts = useCallback(
    async (
      categoryId: string
    ): Promise<{ success: boolean; message: string }> => {
      const category = workoutCategories.find((cat) => cat.id === categoryId);
      if (!category) {
        return { success: false, message: "Category not found" };
      }

      try {
        setIsSaving(true);
        const payload = {
          date: selectedDate,
          workoutType: categoryId,
          workoutIds: category.workouts.map((workout) => workout.id),
        };

        await apiCall(
          "/fitbit/saveUserDayWorkouts",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );

        setOriginalWorkoutCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId
              ? { ...cat, workouts: JSON.parse(JSON.stringify(category.workouts)) }
              : cat
          )
        );

        console.log(`${category.name} saved successfully for ${selectedDate}`);
        return { success: true, message: `${category.name} saved successfully!` };
      } catch (error) {
        console.error(`Error saving ${category?.name}:`, error);
        return {
          success: false,
          message: `Failed to save ${category?.name}. Please try again.`,
        };
      } finally {
        setIsSaving(false);
      }
    },
    [workoutCategories, selectedDate, token]
  );

  return {
    workoutCategories,
    isSaving,
    hasCategoryChanges,
    handleDropWorkout,
    handleRemoveWorkout,
    saveWorkouts,
  };
};
