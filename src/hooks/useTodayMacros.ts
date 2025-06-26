import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";

interface Macros {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

interface UseTodayMacrosResult extends Macros {
  loading: boolean;
  error: Error | null;
}

export function useTodayMacros(): UseTodayMacrosResult {
  const [macros, setMacros] = useState<Macros>({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userId, loading: userLoading } = useUser();

  useEffect(() => {
    if (userLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOrCreate = async () => {
      setLoading(true);
      setError(null);

      try {
        const today = new Date().toISOString().slice(0, 10);

        const { data, error } = await supabase
          .from("today_macros_view")
          .select("total_calories, total_protein, total_carbs, total_fats")
          .eq("user_id", userId)
          .eq("date", today)
          .maybeSingle();

        if (error) throw error;
        if (data)
          setMacros({
            totalCalories: data.total_calories,
            totalProtein: data.total_protein,
            totalCarbs: data.total_carbs,
            totalFats: data.total_fats,
          });
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreate();
  }, [userId, userLoading]);

  return { ...macros, loading, error };
}
