import React, { useState, useEffect } from "react";
import TrainingCard from "../components/TrainingCard";
import AddTrainingCard from "../components/AddTrainingCard";
import NotificationCard from "../components/NotificationCard";
import MacroBarChart from "../components/MacroDonutChart";
import { useTodayMacros } from "../hooks/useTodayMacros";
import { useTrainings } from "../hooks/useTrainings";

const Home = () => {
  // Trainings
  const trainingsWithState = useTrainings();
  const trainings = trainingsWithState.map(
    ({ loading, error, ...rest }) => rest
  );
  const trainingsLoading = trainingsWithState[0]?.loading ?? false;
  const trainingsError = trainingsWithState[0]?.error ?? null;

  // Macros
  const {
    calories,
    protein,
    carbs,
    fats,
    loading: macrosLoading,
    error: macrosError,
  } = useTodayMacros();

  // Notification
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Trainings error handling
  useEffect(() => {
    if (trainingsError) {
      setNotification({
        message: "Error fetching trainings: " + trainingsError.message,
        type: "error",
      });
    }
  }, [trainingsError]);

  // Macros error handling
  useEffect(() => {
    if (macrosError) {
      setNotification({
        message: "Error loading statistics: " + macrosError.message,
        type: "error",
      });
    }
  }, [macrosError]);

  const handleCardClick = (training: any) => {
    console.log("Card edit clicked:", training);
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
      <div className="flex flex-col items-start justify-center">
        <p className="text-3xl font-bold tracking-wide w-full text-center mb-2">
          UPCOMING TRAINING
        </p>
        {trainingsLoading ? (
          <p className="text-text-xl font-bold tracking-wide w-full text-center mt-6">
            Loading trainings...
          </p>
        ) : (
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
        )}

        <p className="text-3xl font-bold tracking-wide w-full text-center mt-6">
          STATISTICS
        </p>
        {macrosLoading ? (
          <p className="text-text-xl font-bold tracking-wide w-full text-center mt-6">
            Loading macros...
          </p>
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
