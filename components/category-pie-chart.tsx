"use client"

import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface CategoryPieChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#A4DE6C",
  "#D0ED57",
  "#FFC658",
  "#FF7300",
]

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  // Filter out zero values
  const filteredData = data.filter((item) => item.value > 0)

  return (
    <div className="w-full h-[300px]">
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsChart>
            <Pie
              data={filteredData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {filteredData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              labelFormatter={(name) => `Category: ${name}`}
            />
            <Legend />
          </RechartsChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">No data available for chart</div>
      )}
    </div>
  )
}
