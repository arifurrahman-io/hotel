import React from "react";
import { DayPicker } from "react-day-picker";
import "../../styles/custom-day-picker.css"; // We'll reuse the admin styles

const BookingCalendar = ({ selectedRange, onSelect, disabledDays }) => {
  const today = new Date();

  return (
    <div className="bg-white rounded-lg p-2">
      <DayPicker
        mode="range"
        selected={selectedRange}
        onSelect={onSelect}
        disabled={[...disabledDays, { before: today }]} // Disable past dates and booked dates
        numberOfMonths={1}
        defaultMonth={today}
        styles={{
          caption: { textTransform: "capitalize" },
        }}
      />
    </div>
  );
};

export default BookingCalendar;
