import {
  ResponsiveContainer,
  BarChart,
  Legend,
  Bar,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

function ChoiceMatrixBarChart({ data }) {
  const chartData = Object.entries(data.rows).map(([rowName, columns]) => ({
    row: rowName,
    ...columns, // Spread all columns as separate properties
  }));

  const columnNames = data.rows[Object.keys(data.rows)[0]]
    ? Object.keys(data.rows[Object.keys(data.rows)[0]])
    : [];

  // Color palette for different columns
  const colors = ["#DA1262", "#4A90E2", "#50C878", "#FFB347"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 10, bottom: 10, right: 10, left: 0 }}
      >
        {columnNames.map((columnName, index) => (
          <Bar
            key={columnName}
            dataKey={columnName}
            fill={colors[index % colors.length]}
            stroke={colors[index % colors.length]}
            isAnimationActive={false}
          />
        ))}

        <XAxis dataKey="row" type="category" />
        <YAxis allowDecimals={false} padding={{ left: 1 }} />
        <Legend />
        <Tooltip />
        <CartesianGrid vertical={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ChoiceMatrixBarChart;
