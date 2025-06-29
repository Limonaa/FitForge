import React from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useWorkoutEdit } from "../hooks/useWorkoutEdit";
import EditableWorkoutHeader from "../components/EditableWorkoutHeader";
import ExerciseEditorTable from "../components/ExerciseEditorTable";
import { ChevronLeft, CirclePlus } from "lucide-react";
import Button from "../components/Button";

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
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-md text-gray-600 hover:text-black transition"
        >
          <ChevronLeft size={18} />
          Back
        </button>
      </div>

      <div className="w-full mt-6">
        <EditableWorkoutHeader
          title={workout.title}
          onTitleChange={updateTitle}
        />
        <ExerciseEditorTable
          exercises={exercises}
          onUpdate={updateExercise}
          onRemove={deleteExercise}
        />
        <div className="flex justify-end w-full">
          <Button variant="green" onClick={addExercise} className="mt-2">
            Add Exercise
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditWorkoutPage;
