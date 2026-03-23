// components/ui/Badge.jsx
export default function Badge({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) {
  // Variantes predefinidas con colores UTM
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    utm_green: 'bg-[#E8F5E9] text-[#009933]',
    utm_gold: 'bg-[#FFF9E8] text-[#FFCC33]',
    utm_gray: 'bg-[#F5F5F5] text-[#666666]',
  };

  const variantClass = variants[variant] || variants.default;

  return (
    <span 
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClass} ${className}`}
      style={{ fontFamily: "'Montserrat', sans-serif" }}
      {...props}
    >
      {children}
    </span>
  );
}