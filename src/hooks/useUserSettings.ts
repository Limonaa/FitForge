import { useState, useEffect } from "react";
import { supabase } from "../services/supabaseService";

interface UserSettings {
  weight: number;
  height: number;
  gender: string;
  caloriesGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatsGoal: number;
  name: string;
  birthdate: string;
  activityLevel: string;
  goalType: string;
}

interface UseUserSettingsResult extends UserSettings {
  loading: boolean;
  error: Error | null;
}

export function useUserSettings(): UseUserSettingsResult {
  const [settings, setSettings] = useState<UserSettings>({
    weight: 70,
    height: 175,
    gender: "male",
    caloriesGoal: 2500,
    proteinGoal: 120,
    carbsGoal: 480,
    fatsGoal: 75,
    name: "",
    birthdate: "",
    activityLevel: "",
    goalType: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Map data from database for UsersSettings' structure
  function mapDbToUserSettings(data: any): UserSettings {
    return {
      weight: data.weight,
      height: data.height,
      gender: data.gender,
      caloriesGoal: data.calories_goal,
      proteinGoal: data.protein_goal,
      carbsGoal: data.carbs_goal,
      fatsGoal: data.fats_goal,
      name: data.name,
      birthdate: data.birthdate,
      activityLevel: data.activity_level,
      goalType: data.goal_type,
    };
  }

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
          throw new Error("User not authenticated");
        }

        const { data, error: fetchError } = await supabase
          .from("user_profile_view")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (fetchError) {
          throw fetchError;
        }
        if (data) setSettings(mapDbToUserSettings(data));
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
