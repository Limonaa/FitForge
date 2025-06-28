import React, { useMemo, useState } from "react";
import type { Workout } from "../types/Workout";
import { useNavigate } from "react-router-dom";

interface WorkoutsHistoryTableProps {
  workouts: Workout[];
}

const WorkoutsHistoryTable: React.FC<WorkoutsHistoryTableProps> = ({
  workouts,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) =>
      w.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [workouts, filter]);

  const handleWorkoutDetails = (id: number) => {
    navigate(`/history/${id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <div>
          <p className="text-lg font-semibold">Recent Workouts</p>
          <p className="text-sm text-gray-500">View and review your sessions</p>
        </div>
        <input
          type="text"
          placeholder="Filter by name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full md:w-64"
        />
      </div>

      {filteredWorkouts.length === 0 ? (
        <p className="text-sm text-gray-500 mt-4">No workouts found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-900">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 font-medium">Workout</th>
                <th className="px-4 py-3 font-medium flex gap-1">Date</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Reps/Sets</th>
                <th className="px-4 py-3 font-medium text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 border-b last:border-none transition-colors"
                >
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{item.time} min</td>
                  <td className="px-4 py-3">
                    {item.reps}/{item.sets}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <button
                      onClick={() => handleWorkoutDetails(item.id)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkoutsHistoryTable;
