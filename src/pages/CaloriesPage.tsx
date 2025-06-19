import React from "react";
import { useFoodEntries } from "../hooks/useFoodEntries";
import { useUserSettings } from "../hooks/useUserSettings";
import { useTodayMacros } from "../hooks/useTodayMacros";
import TodaySummary from "../components/TodaySummary";
import MealTable from "../components/MealTable";

const CaloriesPage: React.FC = () => {
  const { entries, loading, error, refetch } = useFoodEntries();
  const {
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    loading: macrosLoading,
    error: macrosError,
  } = useTodayMacros();

  const { caloriesGoal, proteinGoal, carbsGoal, fatsGoal } = useUserSettings();
  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="flex flex-col items-start justify-center">
        <p className="text-3xl font-bold tracking-wide w-full mb-2">
          Nutrition Tracker
        </p>
        <p className="text-sm text-gray-500">
          Track your daily calories and macronutrients
        </p>
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
      </div>
    </>
  );
};

export default CaloriesPage;
