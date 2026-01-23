import type { Meal } from "../../types";
import { mockDatabase } from "./mockDatabase";

export const mockAPI = {
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const user = mockDatabase.users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }
    return {
      user: { id: user.id, email: user.email, name: user.name },
      token: `mock_token_${user.id}_${Date.now()}`,
    };
  },

  signup: async (name: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const existingUser = mockDatabase.users.find((u) => u.email === email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password,
      name,
    };
    mockDatabase.users.push(newUser);
    return {
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
      token: `mock_token_${newUser.id}_${Date.now()}`,
    };
  },

  getUserMeals: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      meals: mockDatabase.meals,
      total_count: mockDatabase.meals.length,
    };
  },

  addUserMeal: async (name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newMeal: Meal = {
      id: `meal_${Date.now()}`,
      name,
      calories: Math.floor(Math.random() * 300) + 50,
      protein: Math.floor(Math.random() * 30) + 2,
      fats: Math.floor(Math.random() * 20) + 1,
      carbohydrates: Math.floor(Math.random() * 40) + 5,
      fiber: Math.floor(Math.random() * 8),
      sugar: Math.floor(Math.random() * 15),
      sodium: Math.floor(Math.random() * 500) + 50,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    mockDatabase.meals.push(newMeal);
    return { meal: newMeal, message: "Meal added successfully" };
  },

  getUserDayMeals: async (date: string) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const dayMeals = mockDatabase.dayMeals[date] || {
      breakfast: [],
      lunch: [],
      dinner: [],
    };
    return {
      date,
      ...dayMeals,
    };
  },

  saveUserDayMeals: async (date: string, mealType: string, meals: Meal[]) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!mockDatabase.dayMeals[date]) {
      mockDatabase.dayMeals[date] = { breakfast: [], lunch: [], dinner: [] };
    }
    mockDatabase.dayMeals[date][
      mealType as keyof (typeof mockDatabase.dayMeals)[typeof date]
    ] = meals;
    return {
      message: "Meals saved successfully",
      date,
      mealType,
      totalMeals: meals.length,
    };
  },
};
