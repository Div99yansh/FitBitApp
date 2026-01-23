import { useState, useEffect, useCallback } from "react";
import type { Meal } from "../types";
import { apiCall } from "../api";

export const useMeals = (token: string | null) => {
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddingMeal, setIsAddingMeal] = useState(false);

  useEffect(() => {
    const getMeals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiCall("/fitbit/getUserMeals", {}, token);
        console.log("User's meals: ", data);
        setAllMeals(data.meals || []);
      } catch (e) {
        console.error("Error while getting meals", e);
        setError("Failed to load meals. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    getMeals();
  }, [token]);

  const addMeal = useCallback(
    async (mealName: string) => {
      try {
        setIsAddingMeal(true);
        const data = await apiCall(
          "/fitbit/addUserMeal",
          {
            method: "POST",
            body: JSON.stringify({ name: mealName }),
          },
          token
        );
        console.log("Add Meal details are: ", data);
        setAllMeals((prev) => [...prev, data.meal]);
      } catch (error) {
        console.error("Error adding custom meal:", error);
        setError("Failed to add meal. Please try again.");
      } finally {
        setIsAddingMeal(false);
      }
    },
    [token]
  );

  return { allMeals, loading, error, isAddingMeal, addMeal, setAllMeals };
};
