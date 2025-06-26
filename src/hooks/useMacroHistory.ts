import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";
import { useUser } from "../context/UserContext";

interface MacroEntry {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export function useMacroHistory(days: number = 7) {
  const [data, setData] = useState<MacroEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { userId, loading: userLoading } = useUser();

  useEffect(() => {
    if (userLoading) return;
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchMacroHistory = async () => {
      setLoading(true);
      setError(null);

      try {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - (days - 1));
        const fromDateString = fromDate.toISOString().slice(0, 10);

        const { data, error: fetchError } = await supabase
          .from("macro_history_view")
          .select("*")
          .eq("user_id", userId)
          .gte("date", fromDateString)
          .order("date", { ascending: true });

        if (fetchError) throw fetchError;

        setData(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMacroHistory();
  }, [days, userId, userLoading]);

  return { data, loading, error };
}
