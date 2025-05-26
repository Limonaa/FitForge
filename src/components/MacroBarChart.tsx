import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface BarChartData {
  protein: number;
  carbs: number;
  fats: number;
}

const MacroBarChart: React.FC<BarChartData> = ({ protein, carbs, fats }) => {
  const COLORS = ["#6366f1", "#a855f7", "#06b6d4"];
  const data = [
    { name: "Protein", value: protein },
    { name: "Carbs", value: carbs },
    { name: "Fats", value: fats },
  ];

  return (
    <div className="flex justify-center items-center p-2 bg-white rounded-2xl shadow-lg">
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default MacroBarChart;
