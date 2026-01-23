import { useState, useEffect, useCallback } from "react";
import type { Meal, MealCategory } from "../types";
import { apiCall } from "../api";

const createEmptyCategories = (): MealCategory[] => [
  { id: "breakfast", name: "Breakfast", meals: [] },
  { id: "lunch", name: "Lunch", meals: [] },
  { id: "dinner", name: "Dinner", meals: [] },
];

export const useDayMeals = (selectedDate: string, token: string | null) => {
  const [mealCategories, setMealCategories] = useState<MealCategory[]>(
    createEmptyCategories()
  );
  const [originalMealCategories, setOriginalMealCategories] = useState<
    MealCategory[]
  >(createEmptyCategories());
  const [isSaving, setIsSaving] = useState(false);

  // Fetch meals for selected date
  useEffect(() => {
    const fetchDayMeals = async () => {
      try {
        const data = await apiCall(
          `/fitbit/getUserDayMeals?date=${selectedDate}`,
          {},
          token
        );
        console.log("Meals for selected date:", data);

        const categories = [
          { id: "breakfast", name: "Breakfast", meals: data.breakfast || [] },
          { id: "lunch", name: "Lunch", meals: data.lunch || [] },
          { id: "dinner", name: "Dinner", meals: data.dinner || [] },
        ];
        setMealCategories(categories);
        setOriginalMealCategories(JSON.parse(JSON.stringify(categories)));
      } catch (e) {
        console.error("Error fetching day meals:", e);
        const emptyCategories = createEmptyCategories();
        setMealCategories(emptyCategories);
        setOriginalMealCategories(JSON.parse(JSON.stringify(emptyCategories)));
      }
    };

    if (selectedDate) {
      fetchDayMeals();
    }
  }, [selectedDate, token]);

  const hasCategoryChanges = useCallback(
    (categoryId: string): boolean => {
      const currentCategory = mealCategories.find(
        (cat) => cat.id === categoryId
      );
      const originalCategory = originalMealCategories.find(
        (cat) => cat.id === categoryId
      );

      if (!currentCategory || !originalCategory) return false;

      if (currentCategory.meals.length !== originalCategory.meals.length)
        return true;

      const currentMealIds = currentCategory.meals.map((m) => m.id).sort();
      const originalMealIds = originalCategory.meals.map((m) => m.id).sort();

      return JSON.stringify(currentMealIds) !== JSON.stringify(originalMealIds);
    },
    [mealCategories, originalMealCategories]
  );

  const handleDropMeal = useCallback(
    (
      categoryId: string,
      meal: Meal
    ): { success: boolean; message: string } => {
      const category = mealCategories.find((cat) => cat.id === categoryId);
      if (!category) {
        return { success: false, message: "Category not found" };
      }

      // Check if meal already exists in this category
      const mealExists = category.meals.some((m) => m.id === meal.id);
      if (mealExists) {
        return {
          success: false,
          message: `${meal.name} is already in ${category.name}`,
        };
      }

      setMealCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === categoryId) {
            return {
              ...cat,
              meals: [...cat.meals, meal],
            };
          }
          return cat;
        })
      );

      return { success: true, message: `${meal.name} added to ${category.name}` };
    },
    [mealCategories]
  );

  const handleRemoveMeal = useCallback(
    (categoryId: string, mealId: string) => {
      setMealCategories((prev) =>
        prev.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              meals: category.meals.filter((meal) => meal.id !== mealId),
            };
          }
          return category;
        })
      );
    },
    []
  );

  const saveMeals = useCallback(
    async (
      categoryId: string
    ): Promise<{ success: boolean; message: string }> => {
      const category = mealCategories.find((cat) => cat.id === categoryId);
      if (!category) {
        return { success: false, message: "Category not found" };
      }

      try {
        setIsSaving(true);
        const payload = {
          date: selectedDate,
          mealType: categoryId,
          mealIds: category.meals.map((meal) => meal.id),
        };

        await apiCall(
          "/fitbit/saveUserDayMeals",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token
        );

        // Update original state to reflect saved state
        setOriginalMealCategories((prev) =>
          prev.map((cat) =>
            cat.id === categoryId
              ? { ...cat, meals: JSON.parse(JSON.stringify(category.meals)) }
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
    [mealCategories, selectedDate, token]
  );

  return {
    mealCategories,
    isSaving,
    hasCategoryChanges,
    handleDropMeal,
    handleRemoveMeal,
    saveMeals,
  };
};
