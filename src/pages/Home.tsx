import React, { useState, useEffect } from "react";
import TrainingCard from "../components/TrainingCard";
import AddTrainingCard from "../components/AddTrainingCard";
import { supabase } from "../services/supabaseService";
import NotificationCard from "../components/NotificationCard";
import MacroBarChart from "../components/MacroBarChart";
import { useTodayMacros } from "../hooks/useTodayMacros";

const Home = () => {
  type Training = {
    title: string;
    nextTraining: string;
    lastDone: string;
  };

  const [trainings, setTrainings] = useState<Training[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { calories, protein, carbs, fats, loading, error } = useTodayMacros();

  useEffect(() => {
    if (error) {
      setNotification({
        message: "Error fetching today's macros: " + error.message,
        type: "error",
      });
    }
  }, [error]);

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

  useEffect(() => {
    fetchTrainings();
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
        {loading ? (
          <p className="text-center">Loading statistics...</p>
        ) : (
          <MacroBarChart
            calories={calories}
            protein={protein}
            carbs={carbs}
            fats={fats}
          />
        )}
      </div>
    </>
  );
};

export default Home;
