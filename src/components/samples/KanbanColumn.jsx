// components/samples/KanbanColumn.jsx
import { Fragment } from 'react';

// Mapa de colores para diferentes tipos de columnas
const colorStyles = {
  default: {
    bg: 'bg-gray-50',
    headerBg: 'bg-gray-100',
    headerText: 'text-gray-700',
    border: 'border-gray-200',
    dot: 'bg-gray-400'
  },
  primary: {
    bg: 'bg-blue-50',
    headerBg: 'bg-blue-100',
    headerText: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  success: {
    bg: 'bg-green-50',
    headerBg: 'bg-green-100',
    headerText: 'text-green-700',
    border: 'border-green-200',
    dot: 'bg-green-500'
  },
  warning: {
    bg: 'bg-amber-50',
    headerBg: 'bg-amber-100',
    headerText: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  info: {
    bg: 'bg-purple-50',
    headerBg: 'bg-purple-100',
    headerText: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500'
  }
};

export default function KanbanColumn({ 
  title, 
  color = 'default', 
  children,
  count = 0,
  icon: Icon,
  onDragOver,
  onDrop
}) {
  const styles = colorStyles[color] || colorStyles.default;

  return (
    <div 
      className={`
        flex-shrink-0 
        w-full sm:w-80 
        ${styles.bg} 
        rounded-xl 
        border ${styles.border}
        shadow-sm 
        flex flex-col 
        max-h-full
        transition-all duration-200
        hover:shadow-md
      `}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Header de la columna */}
      <div className={`
        ${styles.headerBg} 
        px-4 py-3 
        rounded-t-xl 
        border-b ${styles.border}
        flex items-center justify-between
      `}>
        <div className="flex items-center gap-2 min-w-0">
          {/* Indicador de color (dot) */}
          <span className={`w-2 h-2 rounded-full ${styles.dot} flex-shrink-0`} />
          
          {/* Título con truncado */}
          <h3 className={`
            font-semibold 
            text-sm sm:text-base 
            ${styles.headerText}
            truncate
          `}>
            {title}
          </h3>

          {/* Badge con contador */}
          {count > 0 && (
            <span className={`
              inline-flex items-center justify-center
              min-w-[1.5rem] h-5
              px-1.5 py-0.5
              text-xs font-medium
              ${styles.headerBg}
              ${styles.headerText}
              rounded-full
              border ${styles.border}
              flex-shrink-0
            `}>
              {count}
            </span>
          )}
        </div>

        {/* Icono opcional */}
        {Icon && (
          <Icon className={`w-4 h-4 ${styles.headerText} opacity-70 flex-shrink-0`} />
        )}
      </div>

      {/* Contenido de la columna (cards) */}
      <div className={`
        p-3 
        space-y-2 
        overflow-y-auto 
        flex-1
        min-h-[200px] 
        max-h-[calc(100vh-300px)]
        scrollbar-thin 
        scrollbar-thumb-gray-300 
        scrollbar-track-transparent
        hover:scrollbar-thumb-gray-400
      `}>
        {children}

        {/* Mensaje cuando no hay elementos */}
        {(!children || (Array.isArray(children) && children.length === 0)) && (
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <div className={`
              w-8 h-8 
              rounded-full 
              ${styles.bg} 
              border-2 ${styles.border}
              flex items-center justify-center
              mb-2
            `}>
              <span className={`text-lg ${styles.headerText} opacity-50`}>○</span>
            </div>
            <p className={`text-xs ${styles.headerText} opacity-60`}>
              No hay elementos
            </p>
          </div>
        )}
      </div>

      {/* Footer opcional (por ejemplo, para botón de agregar) */}
      <div className={`
        p-2 
        border-t ${styles.border}
        ${styles.bg}
        rounded-b-xl
        text-xs ${styles.headerText} opacity-70
        text-center
      `}>
        <span></span>
      </div>
    </div>
  );
}