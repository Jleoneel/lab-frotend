import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef(({ label, error, className = '', ...props }, ref) => {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1" style={{ color: '#666666' }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={`w-full pl-4 pr-10 py-2 border rounded-xl focus:outline-none transition-shadow ${
            error ? 'border-red-300' : ''
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
        <button
          type="button"
          onClick={() => setShow(!show)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          style={{ color: '#666666' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#009933')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#666666')}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm" style={{ color: '#DC2626' }}>{error}</p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;
