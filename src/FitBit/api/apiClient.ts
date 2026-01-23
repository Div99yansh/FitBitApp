import { API_BASE_URL, USE_MOCK_DATA } from "./config";
import { mockAPI } from "./mockApi";

export const apiCall = async (
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
