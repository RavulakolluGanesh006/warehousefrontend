import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api";


const SalesHistory = ({ channel }) => {
  const [sales, setSales] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchSales(); // load initially with all sales
  }, []);

  const fetchSales = async (start, end) => {
    try {
      let url = `${API}/sales/${channel}`;
      if (start && end) {
        url += `?start=${start}&end=${end}`;
      }

      const res = await axios.get(url);

      // ✅ Group sales by DATE (ignores time)
      const grouped = {};
      res.data.forEach((sale) => {
        const dateKey = new Date(sale.date).toLocaleDateString();

        if (!grouped[dateKey]) grouped[dateKey] = {};

        // ✅ Aggregate items by product on the same date
        (sale.items || []).forEach((item) => {
          const productName =
            item.productId?.name || item.productId?.sku || "Unknown Product";

          if (!grouped[dateKey][productName]) {
            grouped[dateKey][productName] = {
              sku: item.productId?.sku || "N/A",
              quantity: 0,
            };
          }

          grouped[dateKey][productName].quantity += item.quantity;
        });
      });

      // ✅ Convert to array [{date, items:[{name, sku, quantity}]}]
      const formatted = Object.entries(grouped).map(([date, items]) => ({
        date,
        items: Object.entries(items).map(([name, data]) => ({
          name,
          sku: data.sku,
          quantity: data.quantity,
        })),
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
      fetchSales(); // if empty, fetch all
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold mb-3">{channel} Sales History</h2>

      {/* 🔹 Date Filter */}
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

      {/* 🔹 Sales Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Date</th>
            <th className="p-2">Items Sold</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, idx) => (
            <tr key={idx} className="border">
              <td className="p-2">
  {new Date(sale.date).toLocaleDateString("en-GB")} 
</td>
              <td className="p-2">
                <ul>
                  {sale.items.map((item, i) => (
                    <li key={i}>
                      {item.name} (SKU: {item.sku}) — {item.quantity}
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
