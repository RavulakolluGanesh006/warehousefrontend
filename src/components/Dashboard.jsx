import React, { useState } from "react";
import SalesHistory from "./SalesHistory";
import API from "../api";

const Dashboard = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      // 1. Call the export API to generate the Excel file
      const response = await fetch(`${API}/sales/export`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Export failed");
      }

      // 2. Trigger download using the returned file path
      const downloadUrl = `${API}${data.filePath}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "sales_export.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("❌ Download error:", err);
      setError("Failed to download sales file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Warehouse Management</h1>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 disabled:opacity-50"
      >
        {isDownloading ? "⏳ Generating..." : "📥 Download Sales Excel"}
      </button>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Sales History */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <SalesHistory channel="Amazon" />
        <SalesHistory channel="Flipkart" />
      </div>
    </div>
  );
};

export default Dashboard;
