import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { MealType } from "../types/meals";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";
import {
  Beef,
  CirclePlus,
  Croissant,
  Egg,
  Flame,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Button from "./Button";

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
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
          <Dialog.Title className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
            <CirclePlus size={24} /> Add Food to{" "}
            <span className="capitalize">{mealType}</span>
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <UtensilsCrossed className="text-indigo-500 mr-2" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Food name"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <Flame className="text-red-500 mr-2" size={18} />
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                required
                placeholder="Calories"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <Beef className="text-purple-500 mr-2" size={18} />
              <input
                type="number"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                required
                placeholder="Protein (g)"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <Croissant className="text-blue-500 mr-2" size={18} />
              <input
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                required
                placeholder="Carbs (g)"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center border rounded-md px-3 py-2 bg-gray-50">
              <Egg className="text-amber-500 mr-2" size={18} />
              <input
                type="number"
                value={fats}
                onChange={(e) => setFats(Number(e.target.value))}
                required
                placeholder="Fats (g)"
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                loading={loading}
                loadingText="Adding..."
                disabled={loading}
              >
                Add
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddFoodDialog;
