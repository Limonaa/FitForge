import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { supabase } from "../services/supabaseService";
import NotificationCard from "./NotificationCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mealType: string;
  onSuccess: () => void;
}

const AddFoodDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  mealType,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fats, setFats] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async () => {
    setLoading(true);

    if (name == "" || name == null) {
      setNotification({
        message: "Enter food name",
        type: "error",
      });
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user || userError) return;

    const today = new Date().toISOString().slice(0, 10);

    const { error } = await supabase.from("food_entries").insert({
      user_id: user.id,
      date: today,
      meal_type: mealType,
      name,
      calories,
      protein,
      carbs,
      fats,
    });

    setLoading(false);
    if (error) {
      console.log(error);
    }
    if (!error) {
      onSuccess();
      onClose();
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
      <Dialog
        open={isOpen}
        onClose={onClose}
        className="fixed z-50 inset-0 flex items-center justify-center"
      >
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Add food to {mealType}</h2>
          <div className="w-full">
            <input
              placeholder="Food name"
              value={name}
              min={0}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-x-2">
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700">
                Calories
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                placeholder="Calories"
                type="number"
                value={calories}
                min={0}
                onChange={(e) => setCalories(Number(e.target.value))}
              />
            </div>
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700">
                Protein
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                placeholder="Protein"
                type="number"
                value={protein}
                min={0}
                onChange={(e) => setProtein(Number(e.target.value))}
              />
            </div>
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700">
                Carbs
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                placeholder="Carbs"
                type="number"
                value={carbs}
                min={0}
                onChange={(e) => setCarbs(Number(e.target.value))}
              />
            </div>
            <div className="mt-1">
              <label className="block text-sm font-medium text-gray-700">
                Fats
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                placeholder="Fats"
                type="number"
                value={fats}
                min={0}
                onChange={(e) => setFats(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 bg-indigo-600 text-white py-2 rounded-xl font-semibold"
            >
              {loading ? "Saving..." : "Add"}
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AddFoodDialog;
