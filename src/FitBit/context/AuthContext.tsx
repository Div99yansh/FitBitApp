import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User } from "../types";
import { apiCall } from "../api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("fitbit_token");
    const storedUser = localStorage.getItem("fitbit_user");
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

      localStorage.setItem("fitbit_token", authToken);
      localStorage.setItem("fitbit_user", JSON.stringify(userData));
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

      localStorage.setItem("fitbit_token", authToken);
      localStorage.setItem("fitbit_user", JSON.stringify(userData));
    } catch (error: any) {
      console.error("Signup error:", error);
      throw new Error(error.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("fitbit_token");
    localStorage.removeItem("fitbit_user");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { AuthContext };
