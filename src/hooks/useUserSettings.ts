import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

interface UserSettings {
  daily_calorie_goal: number;
  weight: number | null;
  height: number | null;
}

interface UseUserSettingsResult extends UserSettings {
  loading: boolean;
  error: Error | null;
}

const defaultSettings: UserSettings = {
  daily_calorie_goal: 2000,
  weight: null,
  height: null,
};

export function useUserSettings(): UseUserSettingsResult {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserSettings = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (!user || userError) {
          throw new Error("Not authenticated");
        }

        const { data, error: fetchError } = await supabase
          .from("user_settings")
          .select("daily_calorie_goal, weight, height")
          .eq("user_id", user.id)
          .single();
        if (fetchError) {
          throw fetchError;
        }
        if (data) setSettings(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  return { ...settings, loading, error };
}
