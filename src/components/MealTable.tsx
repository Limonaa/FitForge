import React, { useState } from "react";
import { type FoodEntry } from "../types/FoodEntry";
import { MealType } from "../types/meals";
import AddFoodDialog from "./AddFoodDialog";
import Button from "./Button";

interface MealTableProps {
  entries: FoodEntry[];
}

const MealTable: React.FC<MealTableProps> = ({ entries }) => {
  const mealTypeLabels: Record<MealType, string> = {
    [MealType.Breakfats]: "Breakfast",
    [MealType.Lunch]: "Lunch",
    [MealType.Dinner]: "Dinner",
    [MealType.Snack]: "Snack",
  };
  const grouped: Record<MealType, FoodEntry[]> = {
    [MealType.Breakfats]: [],
    [MealType.Lunch]: [],
    [MealType.Dinner]: [],
    [MealType.Snack]: [],
  };

  const [openMealType, setOpenMealType] = useState<MealType | null>(null);

  const handleOpenDialog = (mealType: MealType) => {
    setOpenMealType(mealType);
  };

  const handleCloseDialog = () => {
    setOpenMealType(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
  };

  entries.forEach((entry) => {
    const type = entry.meal_type as MealType;
    if (grouped[type]) {
      grouped[type].push(entry);
    }
  });

  return (
    <>
      {openMealType && (
        <AddFoodDialog
          isOpen={true}
          onClose={handleCloseDialog}
          mealType={openMealType}
          onSuccess={handleSuccess}
        />
      )}
      <div className="space-y-4 w-full">
        {Object.entries(grouped).map(([type, foods]) => (
          <div key={type}>
            <div className=" flex flex-row justify-between items-center">
              <h2 className="text-xl font-semibold mb-2">
                {mealTypeLabels[type as MealType]}
              </h2>
              <Button
                variant="primary"
                onClick={() => handleOpenDialog(type as MealType)}
                className="my-2"
              >
                Add
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="text-gray-700 text-sm font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-left w-1/4">Food Name</th>
                    <th className="px-4 py-2 text-start w-1/5">Calories</th>
                    <th className="px-4 py-2 text-start w-1/5">Protein (g)</th>
                    <th className="px-4 py-2 text-start w-1/5">Carbs (g)</th>
                    <th className="px-4 py-2 text-start w-1/5">Fats (g)</th>
                  </tr>
                </thead>
                {foods.length > 0 ? (
                  <tbody>
                    {foods.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 w-1/4">{item.name}</td>
                        <td className="px-4 py-2 text-start w-1/5">
                          {item.calories}
                        </td>
                        <td className="px-4 py-2 text-start w-1/5">
                          {item.protein}
                        </td>
                        <td className="px-4 py-2 text-start w-1/5">
                          {item.carbs}
                        </td>
                        <td className="px-4 py-2 text-start w-1/5">
                          {item.fats}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ) : (
                  <tbody>
                    <tr>
                      <td className="text-gray-500 italic px-4 text-start w-1/4">
                        No meals added.
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MealTable;
