import React, { useState, useEffect, use } from "react";
import TrainingCard from "../components/TrainingCard";
import AddTrainingCard from "../components/AddTrainingCard";
import NotificationCard from "../components/NotificationCard";
import MacroBarChart from "../components/MacroDonutChart";
import CalorieProgressChart from "../components/CalorieProgressChart";
import MacroHistoryChart from "../components/MacroHistoryChart";
import DailyTip from "../components/DailyTip";
import { useTodayMacros } from "../hooks/useTodayMacros";
import { useTrainings } from "../hooks/useTrainings";
import { useUserSettings } from "../hooks/useUserSettings";

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

  const {
    daily_calorie_goal,
    loading: settingsLoading,
    error: settingsError,
  } = useUserSettings();

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

  // Settings error handling
  useEffect(() => {
    if (settingsError) {
      setNotification({
        message: "Error loading user settings: " + settingsError.message,
        type: "error",
      });
    }
  }, [settingsError]);

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
        <div className="flex flex-row items-center justify-center w-full mt-4 mb-6 gap-4">
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
          {settingsLoading ? (
            <p className="text-text-xl font-bold tracking-wide w-full text-center mt-6">
              Loading calories...
            </p>
          ) : (
            <CalorieProgressChart
              calories={calories}
              goal={daily_calorie_goal}
            />
          )}
          <MacroHistoryChart />
        </div>
      </div>
    </>
  );
};

export default Home;
