// components/ui/Input.jsx
import { forwardRef } from 'react';

const Input = forwardRef(({ label, type = "text", className = "", error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon className="w-4 h-4" style={{ color: '#666666' }} />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full ${Icon ? 'pl-9' : 'pl-4'} pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 transition-shadow ${
            error ? "border-red-300" : ""
          } ${className}`}
          style={{
            borderColor: error ? '#FECACA' : '#E5E5E5',
            color: '#333333',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#009933';
            e.currentTarget.style.boxShadow = '0 0 0 2px #00993320';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? '#FECACA' : '#E5E5E5';
            e.currentTarget.style.boxShadow = 'none';
          }}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;