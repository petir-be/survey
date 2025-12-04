import {
  BarChart,
  Bar,
  ResponsiveContainer,
  Legend,
  YAxis,
  XAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

function MutlipleChoiceBarChart({ data }) {
  const optionsObj = data.options;

  const options = Object.entries(optionsObj).map(([key, value]) => ({
    label: key,
    Total: value,
  }));


  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={options}
        margin={{ top: 10, bottom: 10, right: 10, left: 0 }}
      >
        <Bar dataKey="Total" fill="#DA1262" stroke="#DA1262" />

        <XAxis dataKey="label" type="category"/>
        <YAxis allowDecimals={false} padding={{left: 1}}/>
        {/* <Legend /> */}
        <Tooltip />
        <CartesianGrid vertical={false} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default MutlipleChoiceBarChart;
