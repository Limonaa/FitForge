import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import TrainingCard from "../components/TrainingCard";
import AddTrainingCard from "../components/AddTrainingCard";
import { supabase } from "../services/supabaseService";
import NotificationCard from "../components/NotificationCard";

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
    </div>
  );
};

export default Home;
