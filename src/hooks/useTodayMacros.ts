import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface UseTodayMacrosResult extends Macros {
  loading: boolean;
  error: Error | null;
}

const defaultMacros: Macros = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
};

export function useTodayMacros(): UseTodayMacrosResult {
  const [macros, setMacros] = useState<Macros>(defaultMacros);
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

        const { data, error: fetchError } = await supabase
          .from("calorie_logs")
          .select("calories, protein, carbs, fats")
          .eq("user_id", user.id)
          .eq("date", today)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (data) {
          setMacros({
            calories: data.calories,
            protein: data.protein,
            carbs: data.carbs,
            fats: data.fats,
          });
        } else {
          const { data: insertData, error: insertError } = await supabase
            .from("calorie_logs")
            .insert({
              user_id: user.id,
              date: today,
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
            })
            .select("calories, protein, carbs, fats")
            .single();

          if (insertError) throw insertError;

          setMacros({
            calories: insertData.calories,
            protein: insertData.protein,
            carbs: insertData.carbs,
            fats: insertData.fats,
          });
        }
      } catch (err: any) {
        console.error("useTodayMacros error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreate();
  }, []);

  return { ...macros, loading, error };
}
