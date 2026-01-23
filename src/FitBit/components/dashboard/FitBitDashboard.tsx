import React, { useState, useEffect } from "react";
import { useAuth } from "../../context";
import { useSnackbar, useAIChat, useDashboardSummary } from "../../hooks";
import { injectStyles } from "../../styles/animations";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardTab, MealsTab, WorkoutTab } from "../tabs";
import { Snackbar } from "../ui";
import { AIChatLauncher, AIChatOverlay } from "../chat";
import type { Tab, TabId } from "../../types";

const tabs: Tab[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "meals", label: "Meals" },
  { id: "workout", label: "Workout" },
];

export const FitBitDashboard: React.FC = () => {
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const { snackbar, showSnackbar, hideSnackbar } = useSnackbar();

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { summary } = useDashboardSummary(selectedDate, token);
  const { messages, isLoading: isChatLoading, sendMessage } = useAIChat(token);

  const handleSendMessage = (question: string) => {
    if (user?.id) {
      sendMessage(question, user.id, selectedDate, summary);
    }
  };

  useEffect(() => {
    injectStyles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader
        user={user}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onLogout={logout}
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="main-content max-w-7xl mx-auto px-6">
        {activeTab === "dashboard" && (
          <DashboardTab token={token} selectedDate={selectedDate} />
        )}

        {activeTab === "meals" && (
          <MealsTab
            token={token}
            selectedDate={selectedDate}
            onShowSnackbar={showSnackbar}
          />
        )}

        {activeTab === "workout" && (
          <WorkoutTab
            token={token}
            selectedDate={selectedDate}
            onShowSnackbar={showSnackbar}
          />
        )}
      </div>

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />

      {/* AI Chat */}
      <AIChatLauncher onClick={() => setIsChatOpen(true)} />
      <AIChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        isLoading={isChatLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
