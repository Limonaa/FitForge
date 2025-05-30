import React from "react";
import FoodCard from "./FoodCard";
import { type FoodEntry } from "../types/FoodEntry";

interface FoodColumnProps {
  title: string;
  entries: FoodEntry[];
}

const FoodColumn: React.FC<FoodColumnProps> = ({ title, entries }) => {
  return (
    <div className="p-2 w-full">
      <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
        {title}
      </h2>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <FoodCard key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  );
};

export default FoodColumn;
