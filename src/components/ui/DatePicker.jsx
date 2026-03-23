// components/ui/DatePicker.jsx
import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ label, value, onChange, className = "", ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          className="block text-sm font-medium mb-1" 
          style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
          <Calendar className="w-4 h-4" style={{ color: '#666666' }} />
        </div>
        <DatePicker
          selected={value ? new Date(value) : null}
          onChange={(date) => onChange(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Seleccionar fecha"
          className={`block w-full pl-9 pr-3 py-2.5 bg-white border text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 shadow-sm placeholder:text-gray-400 ${className}`}
          style={{ 
            borderColor: '#E5E5E5',
            color: '#333333',
            fontFamily: "'Montserrat', sans-serif"
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#009933';
            e.currentTarget.style.boxShadow = '0 0 0 2px #00993320';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#E5E5E5';
            e.currentTarget.style.boxShadow = 'none';
          }}
          wrapperClassName="w-full"
          {...props}
        />
      </div>
    </div>
  );
};

export default CustomDatePicker;