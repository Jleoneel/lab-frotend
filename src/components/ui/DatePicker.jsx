import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
const CustomDatePicker = ({ label, value, onChange, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <Calendar className="w-4 h-4 text-gray-400" />
        </div>
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Seleccionar fecha"
          className={`block w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm placeholder:text-gray-400 ${className}`}
          wrapperClassName="w-full"
          {...props}
        />
      </div>
    </div>
  );
};

export default CustomDatePicker;