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
import NotificationCard from "./NotificationCard";

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
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fats, setFats] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { userId, loading: userLoading } = useUser();
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);
    if (userLoading || !userId) return;

    const cal = Number(calories);
    const prot = Number(protein);
    const carb = Number(carbs);
    const fat = Number(fats);

    if (
      !name.trim() ||
      isNaN(cal) ||
      isNaN(prot) ||
      isNaN(carb) ||
      isNaN(fat) ||
      cal < 0 ||
      prot < 0 ||
      carb < 0 ||
      fat < 0
    ) {
      setNotification({
        message: "Please enter valid, non-negative numbers for all fields.",
        type: "error",
      });
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);

    if (userId) {
      const { error } = await supabase.from("food_entries").insert([
        {
          user_id: userId,
          name,
          calories: cal,
          protein: prot,
          carbs: carb,
          fats: fat,
          meal_type: mealType,
          date: today,
        },
      ]);

      setLoading(false);

      if (error) {
        setNotification({
          message: error.message,
          type: "error",
        });
      } else {
        setNotification({
          message: "Food added succesfully",
          type: "success",
        });
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
    <>
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
                  onChange={(e) => setCalories(e.target.value)}
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
                  onChange={(e) => setProtein(e.target.value)}
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
                  onChange={(e) => setCarbs(e.target.value)}
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
                  onChange={(e) => setFats(e.target.value)}
                  required
                  placeholder="Fats (g)"
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>

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
    </>
  );
};

export default AddFoodDialog;
