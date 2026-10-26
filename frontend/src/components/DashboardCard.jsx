import React from "react";

// Simple stat card used across all role dashboards
const DashboardCard = ({ title, value, icon, color = "primary" }) => {
  const colorMap = {
    primary: "bg-primary-50 text-primary-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
    purple: "bg-purple-50 text-purple-700",
  };

  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      {icon && <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl ${colorMap[color]}`}>{icon}</div>}
    </div>
  );
};

export default DashboardCard;
