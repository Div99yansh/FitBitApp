export interface Meal {
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

export interface MealCategory {
  id: string;
  name: string;
  meals: Meal[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ApiResponse {
  meals: Meal[];
  total_count: number;
}

export interface DayMealsResponse {
  date: string;
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SnackbarProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export interface SnackbarState {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
}

export interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMeal: (mealName: string) => void;
}

export interface MealItemProps {
  meal: Meal;
  onDragStart: (meal: Meal) => void;
  isFromList?: boolean;
}

export interface MealSlotProps {
  meal: Meal;
  categoryId: string;
  onRemoveMeal: (categoryId: string, mealId: string) => void;
  onDragStart: (meal: Meal) => void;
}

export interface DropMealResult {
  success: boolean;
  message: string;
}

export interface MealCategoryProps {
  category: MealCategory;
  onDropMeal: (categoryId: string, meal: Meal) => DropMealResult;
  onRemoveMeal: (categoryId: string, mealId: string) => void;
  onDragStart: (meal: Meal) => void;
  onSaveMeals: (categoryId: string) => void;
  isSaving: boolean;
  hasChanges: boolean;
}

export interface MealListProps {
  meals: Meal[];
  searchTerm: string;
  onDragStart: (meal: Meal) => void;
  isAddingMeal?: boolean;
}

export interface DashboardHeaderProps {
  user: User | null;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onLogout: () => void;
  tabs: Tab[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export interface DashboardSidebarProps {
  meals: Meal[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDragStart: (meal: Meal) => void;
  onAddMealClick: () => void;
  isAddingMeal: boolean;
  isMobile?: boolean;
}

// Tab Types
export type TabId = "dashboard" | "meals" | "workout";

export interface Tab {
  id: TabId;
  label: string;
}

export interface DashboardTabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  tabs: Tab[];
}

export interface MealsTabProps {
  token: string | null;
  selectedDate: string;
  onShowSnackbar: (message: string, type: "success" | "error") => void;
}

export interface WorkoutTabProps {
  token: string | null;
  selectedDate: string;
  onShowSnackbar: (message: string, type: "success" | "error") => void;
}

// Workout Types
export interface Workout {
  id: string;
  name: string;
  reps: number;
  duration: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface WorkoutCategory {
  id: string;
  name: string;
  workouts: Workout[];
}

export interface DayWorkoutsResponse {
  date: string;
  upperBody: Workout[];
  lowerBody: Workout[];
  core: Workout[];
  fullBody: Workout[];
}

export interface AddWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkout: (name: string, reps: number, duration: number) => void;
}

export interface WorkoutItemProps {
  workout: Workout;
  onDragStart: (workout: Workout) => void;
  isFromList?: boolean;
}

export interface WorkoutSlotProps {
  workout: Workout;
  categoryId: string;
  onRemoveWorkout: (categoryId: string, workoutId: string) => void;
  onDragStart: (workout: Workout) => void;
}

export interface DropWorkoutResult {
  success: boolean;
  message: string;
}

export interface WorkoutCategoryProps {
  category: WorkoutCategory;
  onDropWorkout: (categoryId: string, workout: Workout) => DropWorkoutResult;
  onRemoveWorkout: (categoryId: string, workoutId: string) => void;
  onDragStart: (workout: Workout) => void;
  onSaveWorkouts: (categoryId: string) => void;
  isSaving: boolean;
  hasChanges: boolean;
}

export interface WorkoutListProps {
  workouts: Workout[];
  searchTerm: string;
  onDragStart: (workout: Workout) => void;
  isAddingWorkout?: boolean;
}

export interface WorkoutSidebarProps {
  workouts: Workout[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onDragStart: (workout: Workout) => void;
  onAddWorkoutClick: () => void;
  isAddingWorkout: boolean;
  isMobile?: boolean;
}
