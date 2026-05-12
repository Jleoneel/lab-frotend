const variants = {
  green: { bg: '#E8F5E9', border: '#00993330', iconColor: '#009933', textColor: '#666666', titleColor: '#009933' },
  gold:  { bg: '#FFF9E8', border: '#FFCC3330', iconColor: '#FFCC33', textColor: '#996600', titleColor: '#996600' },
  red:   { bg: '#FEF2F2', border: '#FEE2E2',   iconColor: '#DC2626', textColor: '#DC2626', titleColor: '#DC2626' },
  gray:  { bg: '#F9F9F9', border: '#E5E5E5',   iconColor: '#666666', textColor: '#666666', titleColor: '#333333' },
};

export default function InfoBanner({ icon: Icon, title, description, variant = 'green' }) {
  const v = variants[variant] ?? variants.green;

  return (
    <div
      className="rounded-xl p-3 flex items-start gap-2"
      style={{ backgroundColor: v.bg, border: `1px solid ${v.border}` }}
    >
      {Icon && <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: v.iconColor }} />}
      <div>
        {title && (
          <p className="text-xs font-medium" style={{ color: v.titleColor }}>{title}</p>
        )}
        {description && (
          <p className="text-xs mt-0.5" style={{ color: v.textColor }}>{description}</p>
        )}
      </div>
    </div>
  );
}
