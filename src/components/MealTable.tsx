import React, { useState } from "react";
import { type FoodEntry } from "../types/FoodEntry";
import { MealType } from "../types/meals";
import AddFoodDialog from "./AddFoodDialog";
import Button from "./Button";
import NotificationCard from "./NotificationCard";

interface MealTableProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
  refetch: () => void;
}

const MealTable: React.FC<MealTableProps> = ({
  entries,
  onDelete,
  refetch,
}) => {
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
  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "info" | "success";
  } | null>(null);

  const handleOpenDialog = (mealType: MealType) => {
    setOpenMealType(mealType);
  };

  const handleCloseDialog = () => {
    setOpenMealType(null);
  };

  const handleSuccess = () => {
    setNotification({
      message: "Food added succesfully",
      type: "success",
    });
    refetch();
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
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {openMealType && (
        <AddFoodDialog
          isOpen={true}
          onClose={handleCloseDialog}
          mealType={openMealType}
          onSuccess={handleSuccess}
          onError={(error) =>
            setNotification({
              message: error.message || "Failed to add meal",
              type: "error",
            })
          }
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
                    <th className="px-4 py-2 text-left w-4/12">Food Name</th>
                    <th className="px-4 py-2 text-start w-2/12">Calories</th>
                    <th className="px-4 py-2 text-start w-2/12">Protein (g)</th>
                    <th className="px-4 py-2 text-start w-2/12">Carbs (g)</th>
                    <th className="px-4 py-2 text-start w-1/12">Fats (g)</th>
                    <th className="px-4 py-2 w-1/12"></th>
                  </tr>
                </thead>
                {foods.length > 0 ? (
                  <tbody>
                    {foods.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 w-4/12">{item.name}</td>
                        <td className="px-4 py-2 text-start w-2/12">
                          {item.calories}
                        </td>
                        <td className="px-4 py-2 text-start w-2/12">
                          {item.protein}
                        </td>
                        <td className="px-4 py-2 text-start w-2/12">
                          {item.carbs}
                        </td>
                        <td className="px-4 py-2 text-start w-1/12">
                          {item.fats}
                        </td>
                        <td
                          className="px-4 text-start text-red-500 w-1/12 hover:cursor-pointer"
                          onClick={() => onDelete(item.id)}
                        >
                          Remove
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
