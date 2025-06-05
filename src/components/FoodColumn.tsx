import React, { useState } from "react";
import FoodCard from "./FoodCard";
import AddFoodDialog from "./AddFoodDialog";
import { type FoodEntry } from "../types/FoodEntry";

interface FoodColumnProps {
  title: string;
  entries: FoodEntry[];
  mealType: string;
  onAddSuccess: () => void;
}

const FoodColumn: React.FC<FoodColumnProps> = ({
  title,
  entries,
  mealType,
  onAddSuccess,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-2 w-full">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-700">
          {title}
        </h2>
        <button
          className="p-2 bg-blue-500 text-white rounded-xl font-medium"
          onClick={() => setOpen(true)}
        >
          + Add
        </button>
      </div>
      <ul className="space-y-1">
        {entries.map((entry) => (
          <FoodCard key={entry.id} entry={entry} />
        ))}
      </ul>

      <AddFoodDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        mealType={mealType}
        onSuccess={() => {
          setOpen(false);
          onAddSuccess();
        }}
      />
    </div>
  );
};

export default FoodColumn;
