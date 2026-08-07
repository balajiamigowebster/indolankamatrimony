import React from "react";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[...Array(9)].map((_, colIndex) => (
      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </td>
    ))}
  </tr>
);

export default function ProfileTableSkeleton({ rows = 10 }) {
  return (
    <div className="bg-white shadow overflow-x-auto sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Table Headings-a repeat pannunga */}
            {[
              "S.No.",
              "ID",
              "Name",
              "Gender",
              "Age/DOB",
              "Marital Status",
              "Education",
              "Phone No.",
              "Actions",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {[...Array(rows)].map((_, rowIndex) => (
            <SkeletonRow key={rowIndex} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
