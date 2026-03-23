// components/ui/Button.jsx
export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  type = 'button',
  onClick,
  ...props 
}) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const getStyles = () => {
    if (variant === 'primary') {
      return {
        backgroundColor: '#009933',
        color: 'white'
      };
    }
    if (variant === 'secondary') {
      return {
        backgroundColor: '#F9F9F9',
        border: '1px solid #E5E5E5',
        color: '#666666'
      };
    }
    if (variant === 'danger') {
      return {
        backgroundColor: '#DC2626',
        color: 'white'
      };
    }
    return {
      backgroundColor: 'transparent',
      color: '#666666'
    };
  };

  const getHoverStyles = () => {
    if (variant === 'primary') {
      return { backgroundColor: '#00802b' };
    }
    if (variant === 'secondary') {
      return { backgroundColor: '#F5F5F5', borderColor: '#009933', color: '#009933' };
    }
    if (variant === 'danger') {
      return { backgroundColor: '#B91C1C' };
    }
    return { backgroundColor: '#F5F5F5', color: '#009933' };
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${className}`}
      disabled={disabled}
      onClick={onClick}
      style={getStyles()}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, getHoverStyles());
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, getStyles());
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}