import React from "react";

interface MealItemProps {
  type: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

const MealItem: React.FC<MealItemProps> = ({
  type,
  calories,
  protein,
  carbs,
  fats,
}) => {
  return (
    <div className="rounded-xl justify-center items-center px-3 py-1 w-full border border-gray-200">
      <div className="flex flex-row justify-between mb-2">
        <p className="text-lg font-medium first-letter:capitalize">{type}</p>
        <p className="text-lg font-semibold">{calories} kcal</p>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p className="text-gray text-sm">Protein</p>
          <p className="font-medium">{protein}g</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray text-sm">Carbs</p>
          <p className="font-medium">{carbs}g</p>
        </div>
        <div className="flex flex-col">
          <p className="text-gray text-sm">Fats</p>
          <p className="font-medium">{fats}g</p>
        </div>
      </div>
    </div>
  );
};

export default MealItem;
