import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ChartProps {
  data: any[];
}

function CashFlowBar({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="incoming" />
        <Bar dataKey="outgoing" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CashFlowBar;
