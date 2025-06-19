import { MealType } from "./meals";

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: MealType;
}
