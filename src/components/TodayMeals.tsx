import React from "react";
import { CirclePlus } from "lucide-react";
import MealItem from "./MealItem";

const TodayMeals = () => {
  const data = [
    { type: "breakfast", calories: 700, protein: 34, carbs: 122, fats: 21 },
    { type: "lunch", calories: 1600, protein: 100, carbs: 180, fats: 50 },
    { type: "snack", calories: 200, protein: 3, carbs: 28, fats: 2 },
  ];

  return (
    <div className="bg-white shadow-md rounded-xl justify-center items-center p-2 w-full">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">Today's meals</h2>
        <CirclePlus className="w-8 h-8 text-indigo-500" />
      </div>
      <div className="flex flex-col gap-2">
        {data.map((meal) => (
          <MealItem
            type={meal.type}
            calories={meal.calories}
            protein={meal.protein}
            carbs={meal.carbs}
            fats={meal.fats}
          />
        ))}
      </div>
    </div>
  );
};

export default TodayMeals;
