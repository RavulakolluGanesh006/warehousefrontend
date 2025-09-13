import React from "react";

const DateFilter = ({ start, end, setStart, setEnd, onApply }) => {
  return (
    <div className="flex gap-2 mb-4 items-center">
      <input
        type="date"
        value={start}
        onChange={(e) => setStart(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="date"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        onClick={onApply}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
};

export default DateFilter;
