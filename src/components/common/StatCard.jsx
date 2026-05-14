import { colorVariants } from '../../styles/tokens';

//eslint-disable-next-line
export default function StatCard({ icon: Icon, label, value, variant = 'green' }) {
  const { bg, color } = colorVariants[variant] ?? colorVariants.green;

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bg }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-sm" style={{ color: '#666666' }}>{label}</p>
          <p className="text-xl font-bold" style={{ color }}>{value}</p>
        </div>
      </div>
    </div>
  );
}
