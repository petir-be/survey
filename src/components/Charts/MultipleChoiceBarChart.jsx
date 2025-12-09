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

function MutlipleChoiceBarChart({ data }) {
  const optionsObj = data.options;
  const color = "#DA1262";

  const options = Object.entries(optionsObj).map(([key, value]) => ({
    label: key,
    Total: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={options}
        margin={{ top: 10, bottom: 10, right: 10, left: 0 }}
      >
        <Tooltip separator=" - " />
        <Bar dataKey="Total" fill={color} stroke={color} />

        <XAxis dataKey="label" type="category" />
        <YAxis allowDecimals={false} padding={{ left: 1 }} />
        {/* <Legend /> */}

        <CartesianGrid vertical={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MutlipleChoiceBarChart;
