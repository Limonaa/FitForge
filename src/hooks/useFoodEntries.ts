import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";
import { type FoodEntry } from "../types/FoodEntry";
import { useUser } from "../context/UserContext";

interface UseFoodEntriesResult {
  entries: FoodEntry[];
  loading: boolean;
  error: Error | null;
}

export function useFoodEntries(): UseFoodEntriesResult & {
  refetch: () => void;
} {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId, loading: userLoading } = useUser();

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);

    try {
      const today = new Date().toISOString().slice(0, 10);

      const { data, error: fetchError } = await supabase
        .from("food_entries")
        .select("*")
        .eq("user_id", userId)
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

  useEffect(() => {
    if (userLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchEntries();
  }, [userId, userLoading]);

  return { entries, loading, error, refetch: fetchEntries };
}
