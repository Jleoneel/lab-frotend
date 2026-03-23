// components/ui/Select.jsx
export default function Select({
  label,
  children,
  className = '',
  error,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
          {label}
        </label>
      )}
      <select
        className={`
          w-full px-3 py-2 border rounded-xl bg-white
          focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200
          ${error ? 'border-red-300' : ''}
          ${className}
        `}
        style={{ 
          borderColor: error ? '#FECACA' : '#E5E5E5',
          color: '#333333',
          fontFamily: "'Montserrat', sans-serif"
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
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm" style={{ color: '#DC2626', fontFamily: "'Montserrat', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}