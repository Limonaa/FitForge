import React from "react";

interface Exercise {
  id: number;
  workout_id: number;
  name: string;
  order_in_workout: number;
  weight: number;
  reps: number;
  sets: number;
  user_id: string;
}

interface ExerciseEditorListProps {
  exercises: Exercise[];
  onUpdate: (index: number, updated: Partial<Exercise>) => void;
  onRemove?: (index: number) => void;
}

const ExerciseEditorTable: React.FC<ExerciseEditorListProps> = ({
  exercises,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <div
          key={exercise.id ?? index}
          className="p-4 bg-white rounded-xl shadow-md space-y-2"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p>Name</p>
              <input
                type="text"
                value={exercise.name}
                onChange={(e) => onUpdate(index, { name: e.target.value })}
                placeholder="Exercise name"
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div>
              <p>Sets</p>
              <input
                type="number"
                value={exercise.sets}
                onChange={(e) =>
                  onUpdate(index, { sets: parseInt(e.target.value) || 0 })
                }
                placeholder="Sets"
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div>
              <p>Reps</p>
              <input
                type="number"
                value={exercise.reps}
                onChange={(e) =>
                  onUpdate(index, { reps: parseInt(e.target.value) || 0 })
                }
                placeholder="Reps"
                className="border p-2 rounded-md w-full"
              />
            </div>
            <div>
              <p>Weight</p>
              <input
                type="number"
                value={exercise.weight}
                onChange={(e) =>
                  onUpdate(index, { weight: parseFloat(e.target.value) || 0 })
                }
                placeholder="Weight (kg)"
                className="border p-2 rounded-md w-full"
              />
            </div>
          </div>
          <div className="flex justify-end items-end">
            {onRemove && (
              <button
                onClick={() => onRemove(index)}
                className="text-red-500 text-sm hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExerciseEditorTable;
