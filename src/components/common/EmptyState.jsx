//eslint-disable-next-line
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div
      className="bg-white rounded-xl border p-12 text-center shadow-sm"
      style={{ borderColor: '#E5E5E5' }}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ backgroundColor: '#F5F5F5' }}
      >
        <Icon className="w-10 h-10" style={{ color: '#CCCCCC' }} />
      </div>
      <h3 className="text-lg font-medium mb-2" style={{ color: '#333333' }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm mb-4" style={{ color: '#666666' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
