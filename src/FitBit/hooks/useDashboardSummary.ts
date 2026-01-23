import { useState, useEffect, useMemo } from "react";
import type { DailySummary, Meal, Workout } from "../types";
import { apiCall } from "../api";

const createEmptySummary = (): DailySummary => ({
  totalCalories: 0,
  totalProtein: 0,
  totalCarbs: 0,
  totalFats: 0,
  totalFiber: 0,
  totalSugar: 0,
  totalSodium: 0,
  mealBreakdown: {
    breakfast: { count: 0, calories: 0 },
    lunch: { count: 0, calories: 0 },
    dinner: { count: 0, calories: 0 },
  },
  totalWorkouts: 0,
  totalReps: 0,
  totalDuration: 0,
  workoutBreakdown: {
    upperBody: { count: 0, reps: 0, duration: 0 },
    lowerBody: { count: 0, reps: 0, duration: 0 },
    core: { count: 0, reps: 0, duration: 0 },
    fullBody: { count: 0, reps: 0, duration: 0 },
  },
  allWorkouts: [],
});

interface DayMealsResponse {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

interface DayWorkoutsResponse {
  upperBody: Workout[];
  lowerBody: Workout[];
  core: Workout[];
  fullBody: Workout[];
}

export const useDashboardSummary = (
  selectedDate: string,
  token: string | null
) => {
  const [mealsData, setMealsData] = useState<DayMealsResponse | null>(null);
  const [workoutsData, setWorkoutsData] = useState<DayWorkoutsResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [meals, workouts] = await Promise.all([
          apiCall(`/fitbit/getUserDayMeals?date=${selectedDate}`, {}, token),
          apiCall(`/fitbit/getUserDayWorkouts?date=${selectedDate}`, {}, token),
        ]);
        setMealsData(meals);
        setWorkoutsData(workouts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setMealsData(null);
        setWorkoutsData(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate, token]);

  const summary = useMemo<DailySummary>(() => {
    if (!mealsData && !workoutsData) {
      return createEmptySummary();
    }

    // Calculate meal totals
    const breakfast = mealsData?.breakfast || [];
    const lunch = mealsData?.lunch || [];
    const dinner = mealsData?.dinner || [];
    const allMeals = [...breakfast, ...lunch, ...dinner];

    const sumMeals = (meals: Meal[]) => ({
      calories: meals.reduce((sum, m) => sum + m.calories, 0),
      protein: meals.reduce((sum, m) => sum + m.protein, 0),
      carbs: meals.reduce((sum, m) => sum + m.carbohydrates, 0),
      fats: meals.reduce((sum, m) => sum + m.fats, 0),
      fiber: meals.reduce((sum, m) => sum + m.fiber, 0),
      sugar: meals.reduce((sum, m) => sum + m.sugar, 0),
      sodium: meals.reduce((sum, m) => sum + m.sodium, 0),
    });

    const totals = sumMeals(allMeals);

    // Calculate workout totals
    const upperBody = workoutsData?.upperBody || [];
    const lowerBody = workoutsData?.lowerBody || [];
    const core = workoutsData?.core || [];
    const fullBody = workoutsData?.fullBody || [];

    const sumWorkouts = (workouts: Workout[]) => ({
      count: workouts.length,
      reps: workouts.reduce((sum, w) => sum + w.reps, 0),
      duration: workouts.reduce((sum, w) => sum + w.duration, 0),
    });

    const workoutTotals = {
      upperBody: sumWorkouts(upperBody),
      lowerBody: sumWorkouts(lowerBody),
      core: sumWorkouts(core),
      fullBody: sumWorkouts(fullBody),
    };

    // Flatten all workouts with category for timeline
    const allWorkouts = [
      ...upperBody.map((w) => ({ ...w, category: "Upper Body" })),
      ...lowerBody.map((w) => ({ ...w, category: "Lower Body" })),
      ...core.map((w) => ({ ...w, category: "Core" })),
      ...fullBody.map((w) => ({ ...w, category: "Full Body" })),
    ];

    return {
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFats: totals.fats,
      totalFiber: totals.fiber,
      totalSugar: totals.sugar,
      totalSodium: totals.sodium,
      mealBreakdown: {
        breakfast: {
          count: breakfast.length,
          calories: sumMeals(breakfast).calories,
        },
        lunch: { count: lunch.length, calories: sumMeals(lunch).calories },
        dinner: { count: dinner.length, calories: sumMeals(dinner).calories },
      },
      totalWorkouts:
        upperBody.length + lowerBody.length + core.length + fullBody.length,
      totalReps:
        workoutTotals.upperBody.reps +
        workoutTotals.lowerBody.reps +
        workoutTotals.core.reps +
        workoutTotals.fullBody.reps,
      totalDuration:
        workoutTotals.upperBody.duration +
        workoutTotals.lowerBody.duration +
        workoutTotals.core.duration +
        workoutTotals.fullBody.duration,
      workoutBreakdown: workoutTotals,
      allWorkouts,
    };
  }, [mealsData, workoutsData]);

  return { summary, isLoading };
};
