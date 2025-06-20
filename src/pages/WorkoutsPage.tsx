import React, { useState } from "react";
import NotificationCard from "../components/NotificationCard";
import MyWorkouts from "../components/MyWorkouts";

const WorkoutsPage = () => {
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  return (
    <div>
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
            Workout planner
          </p>
          <p className="text-sm text-gray-500">
            Plan and schedule your workouts
          </p>
          <MyWorkouts />
        </div>
      </>
    </div>
  );
};

export default WorkoutsPage;
