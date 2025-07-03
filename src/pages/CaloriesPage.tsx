import React, { useEffect, useState } from "react";
import { useFoodEntries } from "../hooks/useFoodEntries";
import { useUserSettings } from "../hooks/useUserSettings";
import { useTodayMacros } from "../hooks/useTodayMacros";
import TodaySummary from "../components/TodaySummary";
import MealTable from "../components/MealTable";
import PageHeader from "../components/PageHeader";
import NotificationCard from "../components/NotificationCard";

const CaloriesPage: React.FC = () => {
  const {
    entries,
    loading: foodLoading,
    error: foodError,
    refetch,
  } = useFoodEntries();
  const {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    loading: macrosLoading,
    error: macrosError,
  } = useTodayMacros();

  const {
    caloriesGoal,
    proteinGoal,
    carbsGoal,
    fatsGoal,
    loading: settingsLoading,
    error: settingsError,
  } = useUserSettings();

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // FoodEntries Error Handler
  useEffect(() => {
    if (foodError) {
      setNotification({
        message: foodError?.message || "Failed to fetch food entries",
        type: "error",
      });
    }
  }, [foodError]);

  // Macro Error Handler
  useEffect(() => {
    if (macrosError) {
      setNotification({
        message: macrosError?.message || "Failed to fetch macro",
        type: "error",
      });
    }
  }, [macrosError]);

  // Settings Error Handler
  useEffect(() => {
    if (settingsError) {
      setNotification({
        message: settingsError?.message || "Failed to fetch user settings",
        type: "error",
      });
    }
  }, [settingsError]);

  return (
    <>
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <PageHeader
        title="Nutrition Tracker"
        subtitle="Track your daily calories and macronutrients"
      >
        <MealTable entries={entries} />
        <div className="w-full flex flex-row gap-6 mb-2 sticky bottom-0 z-10 pb-2">
          <TodaySummary
            calories={totalCalories}
            protein={totalProtein}
            carbs={totalCarbs}
            fats={totalFats}
            goalCalories={caloriesGoal}
            goalProtein={proteinGoal}
            goalCarbs={carbsGoal}
            goalFats={fatsGoal}
          />
        </div>
      </PageHeader>
    </>
  );
};

export default CaloriesPage;
