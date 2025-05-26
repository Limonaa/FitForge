import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import TrainingCard from "../components/TrainingCard";
import AddTrainingCard from "../components/AddTrainingCard";
import { supabase } from "../services/supabaseService";
import NotificationCard from "../components/NotificationCard";
import MacroBarChart from "../components/MacroBarChart";
import { CaseLowerIcon } from "lucide-react";

const Home = () => {
  type Training = {
    title: string;
    nextTraining: string;
    lastDone: string;
  };

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [caloriesToday, setCaloriesToday] = useState<number>(0);
  const [macroToday, setMacroToday] = useState<{
    protein: number;
    carbs: number;
    fats: number;
  } | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const fetchTrainings = async () => {
    const { data, error } = await supabase
      .from("trainings")
      .select("title, next_date, last_date")
      .order("next_date", { ascending: true })
      .limit(3);
    if (error) {
      setNotification({
        message: "Error fetching trainings: " + error.message,
        type: "error",
      });
      return;
    } else {
      setTrainings(
        data.map((training: any) => ({
          title: training.title,
          nextTraining: training.next_date
            ? new Date(training.next_date).toLocaleDateString()
            : "Not scheduled",
          lastDone: training.last_date
            ? new Date(training.last_date).toLocaleDateString()
            : "Never done",
        }))
      );
    }
  };

  const fetchCaloriesOrCreateToday = async () => {
    const today = new Date().toISOString().split("T")[0];
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("calorie_logs")
      .select("calories")
      .eq("user_id", user?.id)
      .eq("date", today)
      .maybeSingle();

    if (error) {
      setNotification({
        message: "Error fetching today's calories" + error.message,
        type: "error",
      });
    }

    if (data) setCaloriesToday(data.calories);
    else {
      const { data: insertData, error: insertError } = await supabase
        .from("calorie_logs")
        .upsert({
          user_id: user.id,
          date: today,
          calories: 0,
          protein: 0,
          carbs: 0,
          fats: 0,
        })
        .select("calories")
        .single();

      if (insertError) {
        setNotification({
          message:
            "Error initializing today's calories: " + insertError.message,
          type: "error",
        });
      } else if (insertData) {
        setCaloriesToday(insertData.calories);
      }
    }
  };

  const fetchMacroToday = async () => {
    const today = new Date().toISOString().split("T")[0];
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("calorie_logs")
      .select("protein, carbs, fats")
      .eq("user_id", user?.id)
      .eq("date", today)
      .single();

    if (error) {
      setNotification({
        message: "Error fetching today's macros" + error.message,
        type: "error",
      });
    }

    if (data) setMacroToday(data);
    else setMacroToday({ protein: 0, carbs: 0, fats: 0 });
  };

  useEffect(() => {
    fetchTrainings();
    fetchCaloriesOrCreateToday();
    fetchMacroToday();
  }, []);

  const handleCardClick = (training: any) => {
    console.log("Card clicked:", training);
  };

  return (
    <>
      {notification && (
        <NotificationCard
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      {trainings.length === 0 && (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl font-bold">No trainings available</p>
        </div>
      )}
      <div className="flex flex-col items-start justify-center">
        <p className="text-3xl font-bold tracking-wide w-full text-center mb-2">
          UPCOMING TRAINING
        </p>
        <div className="flex flex-wrap gap-8 m-2">
          {trainings.map((training, index) => (
            <TrainingCard
              key={index}
              title={training.title}
              nextTraining={training.nextTraining}
              lastDone={training.lastDone}
              onClick={() => handleCardClick(training)}
            />
          ))}
          {trainings.length < 3 && <AddTrainingCard />}
        </div>
        <p className="text-3xl font-bold tracking-wide w-full text-center mt-6">
          STATISTICS
        </p>
        <MacroBarChart
          protein={macroToday?.protein ?? 0}
          carbs={macroToday?.carbs ?? 0}
          fats={macroToday?.fats ?? 0}
        />
      </div>
    </>
  );
};

export default Home;
