import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../api";


// ✅ Get today's date in local timezone format (YYYY-MM-DD)
const getLocalToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const SalesHistory = ({ channel }) => {
  const today = getLocalToday();

  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async (start, end) => {
    try {
      let url = `${API}/sales/${channel}`;
      if (start && end) {
        url += `?start=${start}&end=${end}`;
      }

      const res = await axios.get(url);

      // Group sales by date (convert "DD/MM/YYYY" to "YYYY-MM-DD")
      const grouped = {};

      res.data.forEach((sale) => {
        const [day, month, year] = sale.date.split("/");
        const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;

        if (!grouped[isoDate]) grouped[isoDate] = [];

        grouped[isoDate].push(sale);
      });

      const formatted = Object.entries(grouped).map(([date, sales]) => ({
        date,
        sales,
      }));

      setSales(formatted);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchSales(startDate, endDate);
    } else {
      fetchSales();
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">{channel} Sales History</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="date"
          className="border p-2"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Filter
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Date</th>
            <th className="p-2">Sales</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((group, idx) => (
            <tr key={idx} className="border">
              <td className="p-2">{group.date}</td>
              <td className="p-2">
                <ul>
                  {group.sales.map((sale, i) => (
                    <li key={i}>
                      SKU: {sale.sku} — Quantity: {sale.quantity}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesHistory;
