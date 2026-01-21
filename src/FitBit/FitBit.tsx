/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, createContext, useContext } from "react";
import { Search, Plus, X, Calendar, Save, LogOut, User } from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fats: number;
  carbohydrates: number;
  fiber: number;
  sugar: number;
  sodium: number;
  created_at: string;
  updated_at: string;
}

interface MealCategory {
  id: string;
  name: string;
  meals: Meal[];
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface ApiResponse {
  meals: Meal[];
  total_count: number;
}

interface DayMealsResponse {
  date: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

interface LoginResponse {
  user: User;
  token: string;
}

// ============================================================================
// MOCK DATA & API HELPER FUNCTIONS
// ============================================================================

const API_BASE_URL = "http://127.0.0.1:8000";
const USE_MOCK_DATA = false; // Set to false to use real API

// Mock database
const mockDatabase = {
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

// Mock API functions
const mockAPI = {
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

  saveUserDayMeals: async (date: string, mealType: string, meals: any[]) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!mockDatabase.dayMeals[date]) {
      mockDatabase.dayMeals[date] = { breakfast: [], lunch: [], dinner: [] };
    }
    mockDatabase.dayMeals[date][
      mealType as keyof (typeof mockDatabase.dayMeals)[typeof date]
    ] = meals as any;
    return {
      message: "Meals saved successfully",
      date,
      mealType,
      totalMeals: meals.length,
    };
  },
};

const apiCall = async (
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<any> => {
  if (USE_MOCK_DATA) {
    // Mock API logic
    if (endpoint === "/auth/login") {
      const body = JSON.parse(options.body as string);
      return mockAPI.login(body.email, body.password);
    } else if (endpoint === "/auth/signup") {
      const body = JSON.parse(options.body as string);
      return mockAPI.signup(body.name, body.email, body.password);
    } else if (endpoint === "/fitbit/getUserMeals") {
      return mockAPI.getUserMeals();
    } else if (endpoint === "/fitbit/addUserMeal") {
      const body = JSON.parse(options.body as string);
      return mockAPI.addUserMeal(body.name);
    } else if (endpoint.startsWith("/fitbit/getUserDayMeals")) {
      const date = endpoint.split("date=")[1];
      return mockAPI.getUserDayMeals(date);
    } else if (endpoint === "/fitbit/saveUserDayMeals") {
      const body = JSON.parse(options.body as string);
      return mockAPI.saveUserDayMeals(body.date, body.mealType, body.meals);
    }
  }

  // Real API logic
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers instanceof Headers
      ? Object.fromEntries(options.headers.entries())
      : Array.isArray(options.headers)
      ? Object.fromEntries(options.headers)
      : options.headers || {}),
  };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// ============================================================================
// AUTHENTICATION CONTEXT
// ============================================================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // FOR PRODUCTION: Uncomment this to use localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('fitbit_token');
    const storedUser = localStorage.getItem('fitbit_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await apiCall("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const { user: userData, token: authToken } = data;

      setUser(userData);
      setToken(authToken);

      // FOR PRODUCTION: Uncomment to persist in localStorage
      localStorage.setItem('fitbit_token', authToken);
      localStorage.setItem('fitbit_user', JSON.stringify(userData));
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || "Login failed");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const data = await apiCall("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const { user: userData, token: authToken } = data;

      setUser(userData);
      setToken(authToken);

      // FOR PRODUCTION: Uncomment to persist in localStorage
      localStorage.setItem('fitbit_token', authToken);
      localStorage.setItem('fitbit_user', JSON.stringify(userData));
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    // FOR PRODUCTION: Uncomment to clear localStorage
    localStorage.removeItem('fitbit_token');
    localStorage.removeItem('fitbit_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// ============================================================================
// AUTH COMPONENTS
// ============================================================================

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        await signup(name, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">FitBit</h1>
          <div className="w-24 h-1 bg-blue-400 mx-auto rounded-full mb-4"></div>
          <p className="text-gray-400">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              required
              minLength={6}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                required
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium disabled:bg-blue-800 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SNACKBAR COMPONENT
// ============================================================================

interface SnackbarProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg ${
          type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
      >
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 hover:opacity-80 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// MEAL COMPONENTS
// ============================================================================

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (mealName: string) => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({
  isOpen,
  onClose,
  onAddMeal,
}) => {
  const [mealName, setMealName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;
    onAddMeal(mealName.trim());
    setMealName("");
    onClose();
  };

  const handleClose = () => {
    setMealName("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Add New Meal</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Meal Name *
            </label>
            <input
              type="text"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g., 2 Slices Toast"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Add Meal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MealItem: React.FC<{
  meal: Meal;
  onDragStart: (meal: Meal) => void;
  isFromList?: boolean;
}> = ({ meal, onDragStart, isFromList = false }) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(meal);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(meal));
  };

  const formatNutritionInfo = () => {
    const parts = [];
    parts.push(`${meal.calories} cal`);
    parts.push(`${meal.protein}g protein`);
    parts.push(`${meal.carbohydrates}g carbs`);
    parts.push(`${meal.fats}g fats`);
    if (meal.fiber > 0) parts.push(`${meal.fiber}g fiber`);
    if (meal.sugar > 0) parts.push(`${meal.sugar}g sugar`);
    if (meal.sodium > 0) parts.push(`${meal.sodium}mg sodium`);
    return parts.join(" • ");
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`bg-gray-700 rounded-lg p-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:bg-gray-600 hover:scale-105 hover:shadow-lg ${
        isFromList ? "border-l-4 border-blue-400" : "border border-gray-600"
      }`}
    >
      <div className="font-medium text-white text-sm mb-2">{meal.name}</div>
      <div className="text-gray-300 text-xs">{formatNutritionInfo()}</div>
    </div>
  );
};

const MealSlotComponent: React.FC<{
  meal: Meal;
  categoryId: string;
  onRemoveMeal: (categoryId: string, mealId: string) => void;
  onDragStart: (meal: Meal) => void;
}> = ({ meal, categoryId, onRemoveMeal, onDragStart }) => {
  return (
    <div className="relative group">
      <div className="relative">
        <MealItem meal={meal} onDragStart={onDragStart} />
        <button
          onClick={() => onRemoveMeal(categoryId, meal.id)}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};

const MealCategory: React.FC<{
  category: MealCategory;
  onDropMeal: (categoryId: string, meal: Meal) => void;
  onRemoveMeal: (categoryId: string, mealId: string) => void;
  onDragStart: (meal: Meal) => void;
  onSaveMeals: (categoryId: string) => void;
  isSaving: boolean;
  hasChanges: boolean;
}> = ({
  category,
  onDropMeal,
  onRemoveMeal,
  onDragStart,
  onSaveMeals,
  isSaving,
  hasChanges,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const mealData = e.dataTransfer.getData("application/json");
    if (mealData) {
      const meal = JSON.parse(mealData);
      onDropMeal(category.id, meal);
    }
  };

  return (
    <div
      className={`bg-gray-800 rounded-xl p-4 transition-all duration-300 min-h-[200px] relative ${
        isDragOver ? "ring-2 ring-blue-400 bg-gray-700" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-lg">{category.name}</h3>
        <button
          onClick={() => onSaveMeals(category.id)}
          disabled={isSaving || !hasChanges}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
            !hasChanges
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : isSaving
              ? "bg-green-500 text-white cursor-wait"
              : "bg-green-600 hover:bg-green-500 text-white"
          }`}
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4">
        {category.meals.map((meal) => (
          <MealSlotComponent
            key={`${category.id}-${meal.id}`}
            meal={meal}
            categoryId={category.id}
            onRemoveMeal={onRemoveMeal}
            onDragStart={onDragStart}
          />
        ))}

        {category.meals.length === 0 && (
          <div className="col-span-1 bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-8 flex items-center justify-center text-gray-400 text-sm hover:border-gray-500 transition-colors duration-200">
            Drop meals here
          </div>
        )}
      </div>
    </div>
  );
};

const MealList: React.FC<{
  meals: Meal[];
  searchTerm: string;
  onDragStart: (meal: Meal) => void;
  onAddMealClick: () => void;
  isAddingMeal?: boolean;
}> = ({ meals, searchTerm, onDragStart, onAddMealClick, isAddingMeal = false }) => {
  const filteredMeals = meals.filter((meal) =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <button
        onClick={onAddMealClick}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mb-4"
      >
        <Plus size={16} />
        Add New Meal
      </button>

      {isAddingMeal && (
        <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-400 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-300 text-sm">Adding new meal...</span>
          </div>
        </div>
      )}

      {filteredMeals.map((meal, index) => (
        <div
          key={meal.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <MealItem meal={meal} onDragStart={onDragStart} isFromList />
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

const FitBitDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedMeal, setDraggedMeal] = useState<Meal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allMeals, setAllMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [mealCategories, setMealCategories] = useState<MealCategory[]>([
    { id: "breakfast", name: "Breakfast", meals: [] },
    { id: "lunch", name: "Lunch", meals: [] },
    { id: "dinner", name: "Dinner", meals: [] },
  ]);
  const [originalMealCategories, setOriginalMealCategories] = useState<MealCategory[]>([
    { id: "breakfast", name: "Breakfast", meals: [] },
    { id: "lunch", name: "Lunch", meals: [] },
    { id: "dinner", name: "Dinner", meals: [] },
  ]);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
    isVisible: boolean;
  }>({ message: "", type: "success", isVisible: false });

  // Inject styles
  useEffect(() => {
    const styleId = "fitbit-custom-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
          transform: translateX(-50px);
        }
        .animate-slide-in-right {
          animation: slideInRight 0.6s ease-out forwards;
          opacity: 0;
          transform: translateX(50px);
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
          transform: scale(0.9);
          opacity: 0;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #6b7280;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .meals-list-container {
          position: sticky;
          top: 6rem;
          height: calc(100vh - 8rem);
        }
        .meals-list-scrollable {
          height: calc(100vh - 18rem);
          overflow-y: auto;
        }
        .app-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(17, 24, 39, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(75, 85, 99, 0.3);
        }
        .main-content {
          padding-top: 1rem;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes slideInLeft {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s ease-out forwards;
        }
        @media (max-width: 1024px) {
          .meals-list-container {
            position: relative;
            height: auto;
            top: 0;
          }
          .meals-list-scrollable {
            height: 300px;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Fetch user's meals
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
        const emptyCategories = [
          { id: "breakfast", name: "Breakfast", meals: [] },
          { id: "lunch", name: "Lunch", meals: [] },
          { id: "dinner", name: "Dinner", meals: [] },
        ];
        setMealCategories(emptyCategories);
        setOriginalMealCategories(JSON.parse(JSON.stringify(emptyCategories)));
      }
    };

    if (selectedDate) {
      fetchDayMeals();
    }
  }, [selectedDate, token]);

  const handleDragStart = (meal: Meal) => {
    console.log("Prev dragged meal : ", draggedMeal);

    setDraggedMeal(meal);
  };

  const hasCategoryChanges = (categoryId: string): boolean => {
    const currentCategory = mealCategories.find((cat) => cat.id === categoryId);
    const originalCategory = originalMealCategories.find((cat) => cat.id === categoryId);

    if (!currentCategory || !originalCategory) return false;

    if (currentCategory.meals.length !== originalCategory.meals.length) return true;

    const currentMealIds = currentCategory.meals.map((m) => m.id).sort();
    const originalMealIds = originalCategory.meals.map((m) => m.id).sort();

    return JSON.stringify(currentMealIds) !== JSON.stringify(originalMealIds);
  };

  const handleDropMeal = (categoryId: string, meal: Meal) => {
    setMealCategories((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            meals: [
              ...category.meals,
              { ...meal, id: `${meal.id}-${Date.now()}` },
            ],
          };
        }
        return category;
      })
    );
  };

  const handleRemoveMeal = (categoryId: string, mealId: string) => {
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
  };

  const handleSaveMeals = async (categoryId: string) => {
    const category = mealCategories.find((cat) => cat.id === categoryId);
    if (!category) return;

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
      setSnackbar({
        message: `${category.name} saved successfully!`,
        type: "success",
        isVisible: true,
      });
    } catch (error) {
      console.error(`Error saving ${category?.name}:`, error);
      setSnackbar({
        message: `Failed to save ${category?.name}. Please try again.`,
        type: "error",
        isVisible: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCustomMeal = async (mealName: string) => {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading meals...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="app-header">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white mb-1">FitBit</h1>
                <div className="w-24 h-1 bg-blue-400 rounded-full"></div>
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <User size={16} />
                <span>{user?.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg">
                <Calendar className="text-blue-400" size={20} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 cursor-pointer"
                />
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="main-content max-w-7xl mx-auto px-6">
        {error && (
          <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 animate-slide-in-left">
            <div className="meals-list-container">
              <div className="bg-gray-800 rounded-xl p-4">
                <h2 className="text-white font-semibold text-lg mb-4">
                  My Meals ({allMeals.length})
                </h2>
                <div className="relative mb-4">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search meals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                  />
                </div>

                <div className="meals-list-scrollable custom-scrollbar">
                  <MealList
                    meals={allMeals}
                    searchTerm={searchTerm}
                    onDragStart={handleDragStart}
                    onAddMealClick={() => setIsModalOpen(true)}
                    isAddingMeal={isAddingMeal}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
            {mealCategories.map((category, index) => (
              <div
                key={category.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <MealCategory
                  category={category}
                  onDropMeal={handleDropMeal}
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

        <div className="lg:hidden space-y-6">
          <div className="animate-fade-in">
            <div className="bg-gray-800 rounded-xl p-4">
              <h2 className="text-white font-semibold text-lg mb-4">
                My Meals ({allMeals.length})
              </h2>
              <div className="relative mb-4">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search meals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                />
              </div>

              <div className="meals-list-scrollable custom-scrollbar">
                <MealList
                  meals={allMeals}
                  searchTerm={searchTerm}
                  onDragStart={handleDragStart}
                  onAddMealClick={() => setIsModalOpen(true)}
                  isAddingMeal={isAddingMeal}
                />
              </div>
            </div>
          </div>

          {mealCategories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MealCategory
                category={category}
                onDropMeal={handleDropMeal}
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

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddMeal={handleAddCustomMeal}
      />

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={() => setSnackbar((prev) => ({ ...prev, isVisible: false }))}
      />
    </div>
  );
};

// ============================================================================
// ROOT APP COMPONENT
// ============================================================================

const FitBitApp: React.FC = () => {
  return (
    <AuthProvider>
      <FitBitAppContent />
    </AuthProvider>
  );
};

const FitBitAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <FitBitDashboard /> : <AuthPage />;
};

export default FitBitApp;
