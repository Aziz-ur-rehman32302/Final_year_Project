import { PieChart, Pie, Cell } from "recharts";

const pieData = [
  { name: "Paid", value: 75 },
  { name: "Unpaid", value: 25 },
];

const COLORS = ["#2563eb", "#ef4444"];

export function PaymentStatus() {
  return (
    <div className="bg-white rounded-xl  border border-gray-300 p-6 flex flex-col items-center">
      <h2 className="font-semibold mb-6 self-start">Payment Status Overview</h2>

      <PieChart width={220} height={220}>
        <Pie
          data={pieData}
          innerRadius={70}
          outerRadius={100}
          paddingAngle={1}
          dataKey="value"
        >
          {pieData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Pie>
      </PieChart>

      <div className="flex gap-16 mt-6">
        <div className="text-center">
          <p className="text-blue-600 text-xl font-semibold">75%</p>
          <p className="text-sm">Paid</p>
        </div>
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold">25%</p>
          <p className="text-sm">Unpaid</p>
        </div>
      </div>
    </div>
  );
}
