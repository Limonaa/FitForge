import React, { useState, useEffect } from "react";
import NotificationCard from "../components/NotificationCard";
import { useTodayMacros } from "../hooks/useTodayMacros";
import { useTrainings } from "../hooks/useTrainings";
import { useUserSettings } from "../hooks/useUserSettings";
import { Flame, Beef, Croissant, Hamburger } from "lucide-react";
import MacroCard from "../components/MacroCard";
import WeeklyChart from "../components/WeeklyChart";
import UpcomingWorkouts from "../components/UpcomingWorkouts";
import DailyTip from "../components/DailyTip";

interface Training {
  id: number;
  title: string;
  nextTraining: string;
}

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
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
    loading: macrosLoading,
    error: macrosError,
  } = useTodayMacros();

  // User settings
  const {
    caloriesGoal,
    proteinGoal,
    carbsGoal,
    fatsGoal,
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

  const handleCardClick = (training: Training) => {
    // TODO
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
        <p className="text-3xl font-bold tracking-wide w-full mb-2">
          Dashboard
        </p>
        <p className="text-sm text-gray-500">
          Welcome back! Here's your fitness summary
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 w-full">
          <MacroCard
            title="Calories Today"
            icon={Flame}
            current={totalCalories}
            goal={caloriesGoal}
            type="calories"
          />
          <MacroCard
            title="Calories Today"
            icon={Beef}
            current={totalProtein}
            goal={proteinGoal}
            type="protein"
          />
          <MacroCard
            title="Carbs Today"
            icon={Croissant}
            current={totalCarbs}
            goal={carbsGoal}
            type="carbs"
          />
          <MacroCard
            title="Fats Today"
            icon={Hamburger}
            current={totalFats}
            goal={fatsGoal}
            type="fats"
          />
        </div>
        <div className="flex flex-row gap-4 w-full">
          <WeeklyChart />
          <UpcomingWorkouts workouts={trainings} />
        </div>
        <div className="flex justify-center w-full mt-4">
          <DailyTip />
        </div>
      </div>
    </>
  );
};

export default Home;
