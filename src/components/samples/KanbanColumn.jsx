// components/samples/KanbanColumn.jsx
export default function KanbanColumn({ title, color, children }) {
  return (
    <div className={`flex-shrink-0 w-80 ${color} rounded-lg p-4`}>
      <h3 className="font-semibold text-gray-700 mb-3">{title}</h3>
      <div className="space-y-2 min-h-[200px]">
        {children}
      </div>
    </div>
  );
}