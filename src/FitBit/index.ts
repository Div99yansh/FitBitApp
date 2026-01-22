export { default } from "./FitBitApp";

// Types
export type {
  Meal,
  MealCategory,
  User,
  AuthContextType,
  ApiResponse,
  DayMealsResponse,
  LoginResponse,
  SnackbarProps,
  SnackbarState,
  AddMealModalProps,
  MealItemProps,
  MealSlotProps,
  DropMealResult,
  MealCategoryProps,
  MealListProps,
  DashboardHeaderProps,
  DashboardSidebarProps,
} from "./types";

// Context
export { AuthContext, AuthProvider, useAuth } from "./context";

// Hooks
export { useSnackbar, useMealDragDrop, useMeals, useDayMeals } from "./hooks";

// Components
export {
  Snackbar,
  AuthPage,
  MealItem,
  MealSlot,
  MealCategory as MealCategoryComponent,
  MealList,
  AddMealModal,
  DashboardHeader,
  DashboardSidebar,
  FitBitDashboard,
} from "./components";

// API
export { apiCall, API_BASE_URL, USE_MOCK_DATA, mockAPI, mockDatabase } from "./api";
