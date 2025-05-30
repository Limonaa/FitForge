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

        // Używamy UPSERT zamiast SELECT + INSERT
        const { data: upserted, error: upsertError } = await supabase
          .from("calorie_logs")
          .upsert(
            {
              user_id: user.id,
              date: today,
              calories: 0,
              protein: 0,
              carbs: 0,
              fats: 0,
            },
            {
              onConflict: "user_id,date", // klucz unikalny
              ignoreDuplicates: true,
            }
          )
          .select("calories, protein, carbs, fats")
          .maybeSingle();

        if (upsertError) throw upsertError;
        if (upserted) setMacros(upserted);
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
