import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ChartProps {
  data: any[];
}

function IncomeExpenseChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="income" stroke="#2b59ff" strokeWidth={2} />
        <Line type="monotone" dataKey="expense" stroke="#ff3b3b" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default IncomeExpenseChart;
