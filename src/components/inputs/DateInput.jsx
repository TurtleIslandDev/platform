import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const DateInput = ({ startDate, setStartDate }) => {
  return (
    <DatePicker
      selected={startDate}
      onChange={(date) => setStartDate(date)}
      className="text-white w-full border border-[#6b7280] bg-transparent px-4 py-2 rounded-md cursor-pointer"
    />
  );
};

export default DateInput;
