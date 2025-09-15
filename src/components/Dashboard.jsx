import React, { useState } from "react";
import SalesHistory from "./SalesHistory";
import { API } from "../api";
const Dashboard = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);

//   const handleDownload = async () => {
//   setIsDownloading(true);
//   setError(null);

//   try {
//     // 1. Request backend to generate the Excel file and return file path
//     const response = await fetch(`${API}/sales/export`);
//     const data = await response.json();

//   if (!response.ok) {
//   console.error("Server error response:", data);
//   throw new Error(data.error || data.message || "Export failed");
// }


//     // 2. Fetch the generated file as a blob
//     const fileResponse = await fetch(`${STATIC_API}${data.filePath}`);
//     if (!fileResponse.ok) {
//       throw new Error("Failed to fetch the export file");
//     }
//     const blob = await fileResponse.blob();

//     // 3. Create a URL for the blob and trigger download
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "sales_export.xlsx";
//     document.body.appendChild(link);
//     link.click();

//     // 4. Cleanup
//     link.remove();
//     window.URL.revokeObjectURL(url);
//   } catch (err) {
//     console.error("❌ Download error:", err);
//     setError("Failed to download sales file. Please try again.");
//   } finally {
//     setIsDownloading(false);
//   }
// };
// const handleDownload = () => {
//   setIsDownloading(true);
//   setError(null);

//   fetch(`${API.base}/sales/export/download`)
//     .then(res => {
//       if (!res.ok) throw new Error("Failed to download file");
//       return res.blob();
//     })
//     .then(blob => {
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = "sales_export.xlsx";
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       window.URL.revokeObjectURL(url);
//     })
//     .catch(err => {
//       console.error("❌ Download error:", err);
//       setError("Failed to download sales file. Please try again.");
//     })
//     .finally(() => setIsDownloading(false));
// };
const handleDownload = () => {
  setIsDownloading(true);
  setError(null);

  fetch(`${API}/sales/export/download`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to download file");
      return res.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "sales_export.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    })
    .catch(err => {
      console.error("❌ Download error:", err);
      setError("Failed to download sales file. Please try again.");
    })
    .finally(() => setIsDownloading(false));
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
