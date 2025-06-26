import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { MealType } from "../types/meals";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  onSuccess: () => void;
}

const AddFoodDialog: React.FC<AddFoodDialogProps> = ({
  isOpen,
  onClose,
  mealType,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fats, setFats] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { userId, loading: userLoading } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    if (userLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    e.preventDefault();
    setError("");
    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);

    if (userId) {
      const { error } = await supabase.from("food_entries").insert([
        {
          user_id: userId,
          name,
          calories: Number(calories),
          protein: Number(protein),
          carbs: Number(carbs),
          fats: Number(fats),
          meal_type: mealType,
          date: today,
        },
      ]);

      setLoading(false);

      if (error) {
        setError(error.message);
      } else {
        onSuccess();
        onClose();
        setName("");
        setCalories("");
        setProtein("");
        setCarbs("");
        setFats("");
      }
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Add Food to {mealType}
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Food name"
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="number"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              required
              placeholder="Calories"
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(Number(e.target.value))}
              required
              placeholder="Protein (g)"
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(Number(e.target.value))}
              required
              placeholder="Carbs (g)"
              className="w-full border px-3 py-2 rounded-md"
            />
            <input
              type="number"
              value={fats}
              onChange={(e) => setFats(Number(e.target.value))}
              required
              placeholder="Fats (g)"
              className="w-full border px-3 py-2 rounded-md"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddFoodDialog;
