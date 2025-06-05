import React from "react";
import { useFoodEntries } from "../hooks/useFoodEntries";
import { useUserSettings } from "../hooks/useUserSettings";
import { useTodayMacros } from "../hooks/useTodayMacros";
import FoodColumn from "../components/FoodColumn";
import MacroProgress from "../components/MacroProgressChart";

const CaloriesPage: React.FC = () => {
  const { entries, loading, error, refetch } = useFoodEntries();
  const groupByMealType = (mealType: string) =>
    entries.filter((e) => e.meal_type === mealType);
  const {
    calories,
    protein,
    carbs,
    fats,
    loading: macrosLoading,
    error: macrosError,
  } = useTodayMacros();

  const { daily_calorie_goal, daily_protein, daily_carbs, daily_fats } =
    useUserSettings();
  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <FoodColumn
          title="Breakfast"
          entries={groupByMealType("breakfast")}
          mealType="breakfast"
          onAddSuccess={refetch}
        />
        <FoodColumn
          title="Lunch"
          entries={groupByMealType("lunch")}
          mealType="lunch"
          onAddSuccess={refetch}
        />
        <FoodColumn
          title="Dinner"
          entries={groupByMealType("dinner")}
          mealType="dinner"
          onAddSuccess={refetch}
        />
        <FoodColumn
          title="Snack"
          entries={groupByMealType("snack")}
          mealType="snack"
          onAddSuccess={refetch}
        />
      </div>
      <div className="flex flex-row w-full justify-center items-center gap-6 px-6">
        <MacroProgress
          label="Proteins"
          current={protein}
          target={daily_protein}
          color="red-500"
        />
        <MacroProgress
          label="Carbs"
          current={carbs}
          target={daily_carbs}
          color="blue-500"
        />
        <MacroProgress
          label="Fats"
          current={fats}
          target={daily_fats}
          color="amber-500"
        />
      </div>
    </>
  );
};

export default CaloriesPage;
