import React from "react";
import Navbar from "../components/NavBar";
import TrainingCard from "../components/TrainingCard";
import AddTrainingCard from "../components/AddTrainingCard";

const Home = () => {
  const trainings = [
    {
      title: "FBW Training",
      nextTraining: "Tomorrow",
      lastDone: "16/05/2025",
    },
    {
      title: "FBW Workout",
      nextTraining: "20/05/2025",
      lastDone: "12/05/2025",
    },
  ];

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
          />
        ))}
        {trainings.length < 3 && <AddTrainingCard />}
      </div>
    </div>
  );
};

export default Home;
