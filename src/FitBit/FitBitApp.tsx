import React from "react";
import { AuthProvider, useAuth } from "./context";
import { FitBitDashboard } from "./components/dashboard";
import { AuthPage } from "./components/auth";

const FitBitAppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <FitBitDashboard /> : <AuthPage />;
};

const FitBitApp: React.FC = () => {
  return (
    <AuthProvider>
      <FitBitAppContent />
    </AuthProvider>
  );
};

export default FitBitApp;
