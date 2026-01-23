import type { Meal } from "../../types";

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
}

interface MockDatabase {
  users: MockUser[];
  meals: Meal[];
  dayMeals: Record<string, { breakfast: Meal[]; lunch: Meal[]; dinner: Meal[] }>;
}

export const mockDatabase: MockDatabase = {
  users: [
    {
      id: "user_1",
      email: "demo@fitbit.com",
      password: "demo123",
      name: "Demo User",
    },
  ],
  meals: [
    {
      id: "meal_1",
      name: "Scrambled Eggs",
      calories: 140,
      protein: 12,
      fats: 9,
      carbohydrates: 2,
      fiber: 0,
      sugar: 1,
      sodium: 340,
      created_at: "2025-01-10T07:00:00Z",
      updated_at: "2025-01-10T07:00:00Z",
    },
    {
      id: "meal_2",
      name: "2 Slices Whole Wheat Toast",
      calories: 160,
      protein: 6,
      fats: 2,
      carbohydrates: 30,
      fiber: 4,
      sugar: 3,
      sodium: 240,
      created_at: "2025-01-10T07:00:00Z",
      updated_at: "2025-01-10T07:00:00Z",
    },
    {
      id: "meal_3",
      name: "Greek Yogurt with Berries",
      calories: 150,
      protein: 15,
      fats: 3,
      carbohydrates: 20,
      fiber: 3,
      sugar: 12,
      sodium: 65,
      created_at: "2025-01-10T08:00:00Z",
      updated_at: "2025-01-10T08:00:00Z",
    },
    {
      id: "meal_4",
      name: "Grilled Chicken Breast",
      calories: 165,
      protein: 31,
      fats: 3.6,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
      sodium: 74,
      created_at: "2025-01-10T12:00:00Z",
      updated_at: "2025-01-10T12:00:00Z",
    },
    {
      id: "meal_5",
      name: "Brown Rice Bowl",
      calories: 215,
      protein: 5,
      fats: 1.6,
      carbohydrates: 45,
      fiber: 3.5,
      sugar: 0,
      sodium: 10,
      created_at: "2025-01-10T12:00:00Z",
      updated_at: "2025-01-10T12:00:00Z",
    },
    {
      id: "meal_6",
      name: "Mixed Green Salad",
      calories: 50,
      protein: 2,
      fats: 0.5,
      carbohydrates: 10,
      fiber: 3,
      sugar: 4,
      sodium: 40,
      created_at: "2025-01-10T12:00:00Z",
      updated_at: "2025-01-10T12:00:00Z",
    },
    {
      id: "meal_7",
      name: "Baked Salmon",
      calories: 206,
      protein: 22,
      fats: 12,
      carbohydrates: 0,
      fiber: 0,
      sugar: 0,
      sodium: 59,
      created_at: "2025-01-10T19:00:00Z",
      updated_at: "2025-01-10T19:00:00Z",
    },
    {
      id: "meal_8",
      name: "Steamed Broccoli",
      calories: 55,
      protein: 4,
      fats: 0.6,
      carbohydrates: 11,
      fiber: 5,
      sugar: 2,
      sodium: 30,
      created_at: "2025-01-10T19:00:00Z",
      updated_at: "2025-01-10T19:00:00Z",
    },
    {
      id: "meal_9",
      name: "Sweet Potato",
      calories: 112,
      protein: 2,
      fats: 0.1,
      carbohydrates: 26,
      fiber: 4,
      sugar: 5,
      sodium: 36,
      created_at: "2025-01-10T19:00:00Z",
      updated_at: "2025-01-10T19:00:00Z",
    },
    {
      id: "meal_10",
      name: "Oatmeal with Banana",
      calories: 180,
      protein: 6,
      fats: 3,
      carbohydrates: 32,
      fiber: 5,
      sugar: 8,
      sodium: 90,
      created_at: "2025-01-11T08:00:00Z",
      updated_at: "2025-01-11T08:00:00Z",
    },
    {
      id: "meal_11",
      name: "Turkey Sandwich",
      calories: 320,
      protein: 25,
      fats: 8,
      carbohydrates: 38,
      fiber: 4,
      sugar: 5,
      sodium: 680,
      created_at: "2025-01-11T12:00:00Z",
      updated_at: "2025-01-11T12:00:00Z",
    },
    {
      id: "meal_12",
      name: "Apple Slices",
      calories: 95,
      protein: 0.5,
      fats: 0.3,
      carbohydrates: 25,
      fiber: 4,
      sugar: 19,
      sodium: 2,
      created_at: "2025-01-11T15:00:00Z",
      updated_at: "2025-01-11T15:00:00Z",
    },
  ],
  dayMeals: {} as Record<
    string,
    { breakfast: Meal[]; lunch: Meal[]; dinner: Meal[] }
  >,
};

// Initialize today's meals
const today = new Date().toISOString().split("T")[0];
mockDatabase.dayMeals[today] = {
  breakfast: [
    mockDatabase.meals[0], // Scrambled Eggs
    mockDatabase.meals[1], // Toast
  ],
  lunch: [
    mockDatabase.meals[3], // Grilled Chicken
    mockDatabase.meals[4], // Brown Rice
    mockDatabase.meals[5], // Salad
  ],
  dinner: [
    mockDatabase.meals[6], // Salmon
    mockDatabase.meals[7], // Broccoli
    mockDatabase.meals[8], // Sweet Potato
  ],
};
