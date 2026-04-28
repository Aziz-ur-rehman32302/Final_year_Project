import { API_BASE_URL } from '../../config';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563eb", "#ef4444"];

export function PaymentStatus() {
  const [pieData, setPieData] = useState([]);
  const [paidPercent, setPaidPercent] = useState(0);
  const [unpaidPercent, setUnpaidPercent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPaymentData = () => {
    setLoading(true);
    setError(null);
    
    fetch(API_BASE_URL + '/payment_status_overview.php')
      .then(res => {
        if (!res.ok) {
          throw new Error("Server error");
        }
        return res.json();
      })
      .then(data => {
        if (data.status === "success") {
          const paid = data.paid_percentage;
          const unpaid = data.unpaid_percentage;
          
          setPieData([
            { name: "Paid", value: paid },
            { name: "Unpaid", value: unpaid }
          ]);
          
          setPaidPercent(paid);
          setUnpaidPercent(unpaid);
          setLoading(false);
        } else {
          setError("Failed to load payment data");
          setLoading(false);
        }
      })
      .catch(() => {
        setError("Failed to load payment data");
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPaymentData();
  }, []);

  // Show loading message while data is being fetched
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-300 p-6 flex flex-col items-center">
        <h2 className="font-semibold mb-6 self-start">Payment Status Overview</h2>
        <div className="h-[220px] w-[220px] flex items-center justify-center">
          <p className="text-gray-500">Loading payment data...</p>
        </div>
        <div className="flex gap-16 mt-6">
          <div className="text-center">
            <p className="text-blue-600 text-xl font-semibold">--%</p>
            <p className="text-sm">Paid</p>
          </div>
          <div className="text-center">
            <p className="text-red-500 text-xl font-semibold">--%</p>
            <p className="text-sm">Unpaid</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error message if API fails
  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-300 p-6 flex flex-col items-center">
        <h2 className="font-semibold mb-6 self-start">Payment Status Overview</h2>
        <div className="h-[220px] w-[220px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-2 text-sm">Failed to load payment data</p>
            <button 
              onClick={fetchPaymentData}
              className="text-blue-600 hover:text-blue-800 text-sm underline"
            >
              Retry
            </button>
          </div>
        </div>
        <div className="flex gap-16 mt-6">
          <div className="text-center">
            <p className="text-blue-600 text-xl font-semibold">--%</p>
            <p className="text-sm">Paid</p>
          </div>
          <div className="text-center">
            <p className="text-red-500 text-xl font-semibold">--%</p>
            <p className="text-sm">Unpaid</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-300 p-6 flex flex-col items-center">
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
          <p className="text-blue-600 text-xl font-semibold">{paidPercent}%</p>
          <p className="text-sm">Paid</p>
        </div>
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold">{unpaidPercent}%</p>
          <p className="text-sm">Unpaid</p>
        </div>
      </div>
    </div>
  );
}
