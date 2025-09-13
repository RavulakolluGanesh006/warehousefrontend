import React, { useState } from "react";
import ProductTable from "./components/ProductTable";
import SalesHistory from "./components/SalesHistory";
import Dashboard from "./components/Dashboard";

function App() {
  const [view, setView] = useState("dashboard");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Warehouse Management</h1>

      {/* Navigation */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${view === "dashboard" ? "bg-purple-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView("dashboard")}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "products" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setView("products")}
        >
          Products
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "amazon" ? "bg-yellow-500 text-white" : "bg-gray-200"}`}
          onClick={() => setView("amazon")}
        >
          Amazon Sales
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "flipkart" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setView("flipkart")}
        >
          Flipkart Sales
        </button>
      </div>

      {/* Pages */}
      {view === "dashboard" && <Dashboard />}
      {view === "products" && <ProductTable />}
      {view === "amazon" && <SalesHistory channel="Amazon" />}
      {view === "flipkart" && <SalesHistory channel="Flipkart" />}
    </div>
  );
}

export default App;
