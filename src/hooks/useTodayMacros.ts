import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

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

  useEffect(() => {
    const fetchOrCreate = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user)
          throw new Error(userError?.message || "Not authenticated");

        const today = new Date().toISOString().slice(0, 10);
        await supabase.from("today_macros_view").upsert(
          {
            user_id: user.id,
            date: today,
            total_calories: 0,
            total_protein: 0,
            total_carbs: 0,
            total_fats: 0,
          },
          {
            onConflict: "user_id,date",
            ignoreDuplicates: true,
          }
        );

        const { data, error } = await supabase
          .from("today_macros_view")
          .select("total_calories, total_protein, total_carbs, total_fats")
          .eq("user_id", user.id)
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
  }, []);

  return { ...macros, loading, error };
}
