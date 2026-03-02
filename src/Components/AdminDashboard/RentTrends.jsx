import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* DATA: Collected + Expected */
const data = [
  { month: "Jan", collected: 85000, expected: 100000 },
  { month: "Feb", collected: 92000, expected: 100000 },
  { month: "Mar", collected: 78000, expected: 100000 },
  { month: "Apr", collected: 98000, expected: 100000 },
  { month: "May", collected: 89000, expected: 100000 },
  { month: "Jun", collected: 100000, expected: 100000 },
];

/* CUSTOM TOOLTIP */
const CustomTooltip = ({ active, payload, label }) => {
  
  
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-3 rounded-lg text-sm shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        <p>Collected: Rs {payload[0].value}</p>
        <p className="text-gray-300">
          Expected: Rs {payload[1].value}
        </p>
        <p className="text-green-400 mt-1">
          Pending: Rs {payload[1].value - payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function RentTrends() {
  return (
    <div className="bg-white rounded-xl border border-gray-300 p-6">
      <h2 className="font-semibold mb-4">Rent Collection Trends</h2>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip /> }/>

            {/* Collected Rent */}
            <Line
              type="monotone"
              dataKey="collected"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 6 }}
            />

            {/* Expected Rent */}
            <Line
              type="monotone"
              dataKey="expected"
              stroke="#9ca3af"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
