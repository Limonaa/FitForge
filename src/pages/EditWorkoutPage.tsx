import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useWorkoutEdit } from "../hooks/useWorkoutEdit";
import EditableWorkoutHeader from "../components/EditableWorkoutHeader";
import ExerciseEditorTable from "../components/ExerciseEditorTable";

const EditWorkoutPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    workout,
    exercises,
    updateTitle,
    updateExercise,
    deleteExercise,
    addExercise,
  } = useWorkoutEdit(Number(id));

  const handleGoBack = () => {
    navigate("/workouts");
  };

  if (!workout) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-start justify-center">
      <div className="flex justify-between items-center w-full">
        <div>
          <p className="text-3xl font-bold tracking-wide w-full mb-2">
            Edit workout
          </p>
          <p className="text-sm text-gray-500">Personalize your exercises</p>
        </div>
        <button
          className="bg-red-600 px-4 py-2 text-white font-semibold rounded-lg"
          onClick={() => handleGoBack()}
        >
          Go back
        </button>
      </div>

      <div className="w-full mt-4">
        <EditableWorkoutHeader
          title={workout.title}
          onTitleChange={updateTitle}
        />
        <ExerciseEditorTable
          exercises={exercises}
          onUpdate={updateExercise}
          onRemove={deleteExercise}
        />
        <button
          onClick={addExercise}
          className="mt-4 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
        >
          + Add Exercise
        </button>
      </div>
    </div>
  );
};

export default EditWorkoutPage;
