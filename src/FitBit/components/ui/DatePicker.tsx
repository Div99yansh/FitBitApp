import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const date = value ? new Date(value) : new Date();
    return { month: date.getMonth(), year: date.getFullYear() };
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value) : null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setViewDate({ month: date.getMonth(), year: date.getFullYear() });
    }
  }, [value]);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { month: 11, year: prev.year - 1 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const handleNextMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { month: 0, year: prev.year + 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const handleDateSelect = (day: number) => {
    const date = new Date(viewDate.year, viewDate.month, day);
    const formatted = date.toISOString().split("T")[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const handleTodayClick = () => {
    const formatted = new Date().toISOString().split("T")[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(viewDate.month, viewDate.year);
    const firstDay = getFirstDayOfMonth(viewDate.month, viewDate.year);
    const days: React.ReactNode[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(viewDate.year, viewDate.month, day);
      date.setHours(0, 0, 0, 0);
      const isSelected =
        selectedDate &&
        date.getTime() === selectedDate.getTime();
      const isToday = date.getTime() === today.getTime();

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-9 w-9 rounded-full text-sm font-medium transition-all duration-150 ${
            isSelected
              ? "bg-blue-600 text-white"
              : isToday
              ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <Calendar className="text-blue-400" size={20} />
        <span className="text-white text-sm font-medium">
          {value ? formatDisplayDate(value) : "Select date"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4 z-50 animate-fade-in w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-white font-semibold">
              {MONTHS[viewDate.month]} {viewDate.year}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div
                key={day}
                className="h-9 w-9 flex items-center justify-center text-xs font-medium text-gray-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

          {/* Today button */}
          <button
            onClick={handleTodayClick}
            className="w-full mt-3 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      )}
    </div>
  );
};
