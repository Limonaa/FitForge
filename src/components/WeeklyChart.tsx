import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { useState } from "react";
import { useMacroHistory } from "../hooks/useMacroHistory";

const WeeklyChart = () => {
  const { data, loading, error } = useMacroHistory(7);
  const formattedData = data.map((entry) => ({
    ...entry,
    date: entry.date.slice(5),
  }));
  const [selected, setSelected] = useState<
    "calories" | "protein" | "carbs" | "fats"
  >("calories");

  const colorMap = {
    calories: "orange",
    protein: "blue",
    carbs: "green",
    fats: "purple",
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data</p>;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 w-full max-w-3xl">
      <h2 className="text-lg sm:text-xl font-semibold mb-2 first-letter:capitalize">
        {selected}
        <p className="text-sm text-gray-500 font-normal">(last 7 days)</p>
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={colorMap[selected]}
                stopOpacity={0.4}
              />
              <stop
                offset="95%"
                stopColor={colorMap[selected]}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={selected}
            stroke={colorMap[selected]}
            fillOpacity={1}
            fill="url(#colorFill)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex justify-start gap-4 sm:gap-6 mt-4 text-sm font-medium ">
        {["calories", "protein", "carbs", "fats"].map((key) => (
          <button
            key={key}
            onClick={() => setSelected(key as any)}
            className={`px-4 py-2 rounded-full capitalize text-sm transition font-semibold
        ${
          selected === key
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyChart;
