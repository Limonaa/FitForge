import React from "react";
import { type FoodEntry } from "../types/FoodEntry";

const FoodCard: React.FC<{ entry: FoodEntry }> = ({ entry }) => {
  return (
    <>
      <li className="p-2 bg-white shadow-md rounded-xl flex justify-center items-center">
        <div className="py-2">
          <div className="font-semibold">
            {entry.name} | {entry.calories} kcal
          </div>
          <div className="text-gray-600 flex flex-row justify-between font-medium tracking-wide gap-3">
            <div className="text-indigo-500">P: {entry.protein}g</div>
            <div className="text-purple-500">C: {entry.carbs}g </div>
            <div className="text-amber-500">F: {entry.fats}g</div>
          </div>
        </div>
      </li>
    </>
  );
};

export default FoodCard;
