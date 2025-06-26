import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseService";

interface Tip {
  description: string;
}

export function useDailyTip() {
  const [dailyTip, setDailyTip] = useState<Tip | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTips = async () => {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem("daily_tip");

      if (saved) {
        try {
          const { date, tip } = JSON.parse(saved);
          if (date === today) {
            setDailyTip(tip);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn("Invalid localStorage format for daily_tip");
        }
      }

      const { data, error } = await supabase
        .from("daily_tips")
        .select("description");

      if (error || !data) {
        console.error("Failed to fetch tips", error);
        setLoading(false);
        return;
      }

      const randomTip = data[Math.floor(Math.random() * data.length)];
      setDailyTip(randomTip);

      localStorage.setItem(
        "daily_tip",
        JSON.stringify({ date: today, tip: randomTip })
      );

      setLoading(false);
    };

    fetchTips();
  }, []);

  return { tip: dailyTip, loading };
}
