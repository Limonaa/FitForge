import React, { useState, useEffect } from "react";
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
  Search,
} from "lucide-react";
import Button from "./Button";
import LabeledInput from "./LabeledInput";

interface Product {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface AddFoodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mealType: MealType;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const AddFoodDialog: React.FC<AddFoodDialogProps> = ({
  isOpen,
  onClose,
  mealType,
  onSuccess,
  onError,
}) => {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<string>("");
  const [protein, setProtein] = useState<string>("");
  const [carbs, setCarbs] = useState<string>("");
  const [fats, setFats] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const { userId, loading: userLoading } = useUser();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${searchTerm}%`)
        .limit(15);

      if (!error && data) {
        setSearchResults(data as Product[]);
      } else {
        setSearchResults([]);
      }
      setSearchLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleProductSelect = (product: Product) => {
    setName(product.name);
    setCalories(String(product.calories));
    setProtein(String(product.protein));
    setCarbs(String(product.carbs));
    setFats(String(product.fats));
    setSearchTerm("");
    setSearchResults([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      alert("Please enter valid, non-negative numbers for all fields.");
      return;
    }

    setLoading(true);
    const today = new Date().toISOString().slice(0, 10);

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
      onError(error);
    } else {
      onSuccess();
      onClose();
      setName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFats("");
      setSearchTerm("");
      setSearchResults([]);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed z-50 inset-0">
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <Dialog.Panel className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <Dialog.Title className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
            <CirclePlus size={24} /> Add Food to{" "}
            <span className="capitalize">{mealType}</span>
          </Dialog.Title>

          <div className="mb-4 max-h-64 overflow-auto">
            <div className="relative mb-2">
              <Search
                className="absolute left-2 top-2.5 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2 py-2 border rounded"
              />
            </div>

            {searchLoading && (
              <p className="text-sm text-gray-400 px-2">Searching...</p>
            )}

            {!searchLoading && searchResults.length > 0 && (
              <div className="max-h-40 overflow-y-auto border rounded text-sm divide-y">
                {searchResults.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                    type="button"
                  >
                    <div className="w-full flex flex-row gap-4 sm:gap-6 items-center">
                      <p className="sm:text-lg">{product.name}</p>
                      <div className="flex gap-1.5 items-center">
                        <Flame className="text-red-500" size={18} />
                        <p className="sm:text-lg tracking-wide">
                          {product.calories}
                        </p>
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <Beef className="text-purple-500" size={16} />
                        <p className="sm:text-lg tracking-wide">
                          {product.protein}
                        </p>
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <Croissant className="text-blue-500" size={16} />
                        <p className="sm:text-lg tracking-wide">
                          {product.carbs}
                        </p>
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <Egg className="text-amber-500" size={16} />
                        <p className="sm:text-lg tracking-wide">
                          {product.fats}
                        </p>
                      </div>
                      <p className="text-gray-600 min-w-11">/ 100g</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {!searchLoading && searchTerm && searchResults.length === 0 && (
              <p className="text-sm text-gray-500 px-2">No products found</p>
            )}
          </div>

          <p className="text-gray-700 text-center">
            Didn't find a ready-made one? Add your own!
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <LabeledInput
              value={name}
              onChange={setName}
              placeholder="Food name"
              icon={<UtensilsCrossed className="text-indigo-500" size={18} />}
              type="text"
              required
            />
            <LabeledInput
              value={calories}
              onChange={setCalories}
              placeholder="Calories"
              icon={<Flame className="text-red-500" size={18} />}
              type="number"
            />
            <LabeledInput
              value={protein}
              onChange={setProtein}
              placeholder="Protein"
              icon={<Beef className="text-purple-500" size={18} />}
              type="number"
            />
            <LabeledInput
              value={carbs}
              onChange={setCarbs}
              placeholder="Carbs"
              icon={<Croissant className="text-blue-500" size={18} />}
              type="number"
            />
            <LabeledInput
              value={fats}
              onChange={setFats}
              placeholder="Fats"
              icon={<Egg className="text-amber-500" size={18} />}
              type="number"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={onClose} type="button">
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
