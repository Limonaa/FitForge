import React, { useMemo, useState } from "react";
import type { Workout } from "../types/Workout";
import WorkoutDetails from "./WorkoutDetails";

interface WorkoutsHisotyTableProps {
  workouts: Workout[];
}

const WorkoutsHisotyTable: React.FC<WorkoutsHisotyTableProps> = ({
  workouts,
}) => {
  const [filter, setFilter] = useState("");
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<number | null>(
    null
  );

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) =>
      w.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [workouts, filter]);

  return (
    <>
      {selectedWorkoutId !== null && (
        <WorkoutDetails
          workoutId={selectedWorkoutId}
          onClose={() => setSelectedWorkoutId(null)}
        />
      )}
      <div className="bg-white shadow-md rounded-xl justify-center items-center p-2 w-full">
        <div className="flex flex-row justify-between p-2">
          <p className="text-lg font-semibold">Recent workouts</p>
          <input
            type="text"
            placeholder="Filter by name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-48"
          />
        </div>
        <table className="min-w-full bg-white border-gray-200">
          <thead className="text-gray-700 text-sm font-semibold">
            <tr>
              <th className="px-4 py-2 text-start w-4/12">Workout</th>
              <th className="px-4 py-2 text-start w-2/12">Date</th>
              <th className="px-4 py-2 text-start w-2/12">Duration</th>
              <th className="px-4 py-2 text-start w-3/12">Reps/Sets</th>
              <th className="px-4 py-2 text-start w-1/12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredWorkouts.map((item) => (
              <tr
                key={item.id}
                className="border-t border-gray-200 hover:border-gray-50"
              >
                <td className="px-4 py-2 w-1/5">{item.name}</td>
                <td className="px-4 py-2 w-1/5">{item.date}</td>
                <td className="px-4 py-2 w-1/5">
                  {String(item.time / 60)} min
                </td>
                <td className="px-4 py-2 w-1/5">
                  {item.reps}/{item.sets}
                </td>
                <td
                  className="px-4 py-2 w-1/5 text-end"
                  onClick={() => setSelectedWorkoutId(item.id)}
                >
                  Details
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WorkoutsHisotyTable;
