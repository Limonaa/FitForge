import React from "react";
import { useFoodEntries } from "../hooks/useFoodEntries";
import FoodColumn from "../components/FoodColumn";

const CaloriesPage: React.FC = () => {
  const { entries, loading, error } = useFoodEntries();
  const groupByMealType = (mealType: string) =>
    entries.filter((e) => e.meal_type === mealType);

  if (loading) return <p>Ładowanie...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <FoodColumn title="Breakfast" entries={groupByMealType("breakfast")} />
      <FoodColumn title="Lunch" entries={groupByMealType("lunch")} />
      <FoodColumn title="Dinner" entries={groupByMealType("dinner")} />
      <FoodColumn title="Snack" entries={groupByMealType("snack")} />
    </div>
  );
};

export default CaloriesPage;
