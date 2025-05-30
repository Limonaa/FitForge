import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";
import { type FoodEntry } from "../types/FoodEntry";

interface UseFoodEntriesResult {
  entries: FoodEntry[];
  loading: boolean;
  error: Error | null;
}

export function useFoodEntries(): UseFoodEntriesResult {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (!user || userError) {
          throw new Error(userError?.message || "User not authenticated");
        }

        const today = new Date().toISOString().slice(0, 10);

        const { data, error: fetchError } = await supabase
          .from("food_entries")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .order("date", { ascending: true });

        if (fetchError) throw fetchError;

        setEntries(data as FoodEntry[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  return { entries, loading, error };
}
