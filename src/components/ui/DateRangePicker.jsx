import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "../../styles/custom-day-picker.css"; // Use our new custom styles
import { Calendar as CalendarIcon } from "lucide-react";
import Button from "./Button";

const DateRangePicker = ({ onDateChange, initialRange }) => {
  const [range, setRange] = useState(initialRange);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const handleSelect = (selectedRange) => {
    setRange(selectedRange);
    onDateChange(selectedRange);
    if (selectedRange?.from && selectedRange?.to) {
      setIsOpen(false);
    }
  };

  const buttonText = range?.from ? (
    range.to ? (
      <>
        {format(range.from, "LLL dd, y")} - {format(range.to, "LLL dd, y")}
      </>
    ) : (
      format(range.from, "LLL dd, y")
    )
  ) : (
    <span>Pick a date range</span>
  );

  return (
    <div className="relative">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal"
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>

      {isOpen && (
        <div
          className="absolute z-10 top-full mt-2 bg-white p-2 border rounded-md shadow-lg"
          // We can remove onMouseLeave to prevent accidental closing
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={handleSelect}
            numberOfMonths={2}
            defaultMonth={range?.from || new Date()}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
