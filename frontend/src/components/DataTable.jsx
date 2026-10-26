import React from "react";
import Loader from "./Loader";

// Generic responsive data table.
// columns: [{ key, label, render? }]
const DataTable = ({ columns, data, loading, emptyMessage = "No records found" }) => {
  if (loading) return <Loader />;

  if (!data || data.length === 0) {
    return <div className="text-center text-slate-500 py-12 text-sm">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-ink-100">
            {columns.map((col) => (
              <th key={col.key} className="py-2.5 px-3 font-medium whitespace-nowrap">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={row._id || idx} className="border-b border-parchment-200 hover:bg-parchment-100">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-3 align-middle">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
