import React from "react";
import { useDashboardSummary } from "../../hooks";
import type { DashboardTabProps, DailyGoals } from "../../types";
import {
  DailyProgressSection,
  NutritionOverviewSection,
  MealDistributionChart,
  WorkoutBreakdownSection,
  WorkoutSummarySection,
  AIChatbotPlaceholder,
} from "../dashboard-widgets";
import { Loader2 } from "lucide-react";

const DEFAULT_GOALS: DailyGoals = {
  calorieGoal: 2000,
  workoutMinutesGoal: 60,
};

export const DashboardTab: React.FC<DashboardTabProps> = ({
  token,
  selectedDate,
}) => {
  const { summary, isLoading } = useDashboardSummary(selectedDate, token);

  if (isLoading) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Dashboard Area - scrollable content */}
        <div className="flex-1 lg:pr-[300px] space-y-6 pb-10">
          {/* Daily Progress Section - Hero */}
          <section>
            <h2 className="text-white font-semibold text-lg mb-4">
              Daily Progress
            </h2>
            <DailyProgressSection
              totalCalories={summary.totalCalories}
              totalDuration={summary.totalDuration}
              goals={DEFAULT_GOALS}
            />
          </section>

          {/* Nutrition Overview Section */}
          <section>
            <h2 className="text-white font-semibold text-lg mb-4">
              Nutrition Overview
            </h2>
            <NutritionOverviewSection
              totalCalories={summary.totalCalories}
              totalProtein={summary.totalProtein}
              totalCarbs={summary.totalCarbs}
              totalFats={summary.totalFats}
              totalFiber={summary.totalFiber}
              totalSugar={summary.totalSugar}
              totalSodium={summary.totalSodium}
            />
          </section>

          {/* Meal Distribution Section */}
          <section>
            <h2 className="text-white font-semibold text-lg mb-4">
              Meal Distribution
            </h2>
            <MealDistributionChart
              breakfast={summary.mealBreakdown.breakfast.calories}
              lunch={summary.mealBreakdown.lunch.calories}
              dinner={summary.mealBreakdown.dinner.calories}
            />
          </section>

          {/* Workout Breakdown Section */}
          <section>
            <h2 className="text-white font-semibold text-lg mb-4">
              Workout Breakdown
            </h2>
            <WorkoutBreakdownSection
              breakdown={summary.workoutBreakdown}
              allWorkouts={summary.allWorkouts}
            />
          </section>

          {/* Workout Summary Section */}
          <section>
            <h2 className="text-white font-semibold text-lg mb-4">
              Workout Summary
            </h2>
            <WorkoutSummarySection
              totalWorkouts={summary.totalWorkouts}
              totalReps={summary.totalReps}
              totalDuration={summary.totalDuration}
            />
          </section>
        </div>

        {/* AI Chatbot Sidebar - Fixed position */}
        <div className="hidden lg:block fixed right-6 top-[100px] w-[280px] h-[calc(100vh-120px)] z-20">
          <AIChatbotPlaceholder />
        </div>

        {/* Mobile: Show chatbot at bottom */}
        <div className="lg:hidden">
          <AIChatbotPlaceholder />
        </div>
      </div>
    </div>
  );
};
