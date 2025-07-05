import React, { useEffect, useState } from "react";
import { useFoodEntries } from "../hooks/useFoodEntries";
import { useUserSettings } from "../hooks/useUserSettings";
import { useTodayMacros } from "../hooks/useTodayMacros";
import TodaySummary from "../components/TodaySummary";
import MealTable from "../components/MealTable";
import PageHeader from "../components/PageHeader";
import NotificationCard from "../components/NotificationCard";
import LoadWrapper from "../components/LoadWrapper";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";
import { type FoodEntry } from "../types/FoodEntry";

const CaloriesPage: React.FC = () => {
  const {
    entries,
    loading: foodLoading,
    error: foodError,
    refetch,
  } = useFoodEntries();
  const [visibleEntries, setVisibleEntries] = useState<FoodEntry[]>([]);

  useEffect(() => {
    setVisibleEntries(entries);
  }, [entries]);

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

  const { userId } = useUser();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleRemoveMeal = async (id: string) => {
    try {
      const { error } = await supabase
        .from("food_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);

      if (error) {
        setNotification({
          message: error.message || "Failed to delete meal",
          type: "error",
        });
        return;
      }
      setNotification({
        message: "Removed meal successfully",
        type: "success",
      });
      setVisibleEntries((prev) => prev.filter((entry) => entry.id !== id));
    } catch (err: any) {
      setNotification({
        message: err.message || "Removed meal successfully",
        type: "error",
      });
    }
  };

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
      <LoadWrapper loading={macrosLoading || foodLoading || settingsLoading}>
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
          <MealTable
            entries={visibleEntries}
            onDelete={handleRemoveMeal}
            refetch={refetch}
          />
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
      </LoadWrapper>
    </>
  );
};

export default CaloriesPage;
