const hoverMap = {
  green: { backgroundColor: '#E8F5E9', color: '#009933' },
  gold:  { backgroundColor: '#FFF9E8', color: '#FFCC33' },
  red:   { backgroundColor: '#FEF2F2', color: '#DC2626' },
  gray:  { backgroundColor: '#F5F5F5', color: '#666666' },
};

const sizeMap = {
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export default function IconButton({
  icon: Icon,
  onClick,
  title,
  variant = 'green',
  size = 'md',
  className = '',
  disabled = false,
}) {
  const hover = hoverMap[variant] ?? hoverMap.green;

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      style={{ color: '#666666' }}
      onMouseEnter={(e) => {
        if (!disabled) Object.assign(e.currentTarget.style, hover);
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#666666';
        }
      }}
    >
      <Icon className={sizeMap[size] ?? sizeMap.md} />
    </button>
  );
}
