import React from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, Legend } from "recharts";

interface CalorieProgressChartProps {
  calories: number;
  goal: number;
}

const getFillColor = (value: number, raw: number): string => {
  if (value >= 110) return "#ef4444";
  if (raw < 50) return "#fa7171";
  if (raw < 90) return "#ffbf00";
  return "#4ade80";
};

const CalorieProgressChart: React.FC<CalorieProgressChartProps> = ({
  calories,
  goal,
}) => {
  const rawPercentage = goal > 0 ? (calories / goal) * 100 : 0;
  const percentage = Math.min(rawPercentage, 100);
  const fillColor = getFillColor(percentage, rawPercentage);

  const data = [
    {
      name: "Postęp",
      value: percentage,
      fill: fillColor,
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center p-2 bg-white rounded-2xl shadow-lg">
      <p className="text-center text-xl font-bold -mb-4 tracking-wide">
        Daily calories
      </p>
      <RadialBarChart
        width={220}
        height={300}
        cx={110}
        cy={150}
        innerRadius={80}
        outerRadius={120}
        barSize={18}
        data={data}
        startAngle={180}
        endAngle={0}
        className="mb-4"
      >
        <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
        <RadialBar background dataKey="value" />
        <Legend
          iconSize={10}
          layout="horizontal"
          verticalAlign="bottom"
          height={36}
          align="center"
          payload={[
            {
              value: `${calories} / ${goal} kcal`,
              type: "circle",
              color: data[0].fill,
              id: "progress",
            },
          ]}
        />
      </RadialBarChart>
    </div>
  );
};

export default CalorieProgressChart;
