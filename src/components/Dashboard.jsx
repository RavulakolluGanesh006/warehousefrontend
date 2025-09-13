import React from "react";
import SalesHistory from "./SalesHistory";

const Dashboard = () => {
  return (
    // Detailed Sales History
    <div className="mt-6 grid grid-cols-2 gap-6">
      <SalesHistory channel="Amazon" />
      <SalesHistory channel="Flipkart" />
    </div>
  );
};

export default Dashboard;
