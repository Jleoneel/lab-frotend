// components/samples/KanbanColumn.jsx
import { Fragment } from 'react';

// Mapa de colores para diferentes tipos de columnas con paleta UTM
const colorStyles = {
  default: {
    bg: '#F9F9F9',
    headerBg: '#F5F5F5',
    headerText: '#666666',
    border: '#E5E5E5',
    dot: '#CCCCCC'
  },
  primary: {
    bg: '#E8F5E9',
    headerBg: '#D4EAD5',
    headerText: '#009933',
    border: '#00993330',
    dot: '#009933'
  },
  success: {
    bg: '#E8F5E9',
    headerBg: '#D4EAD5',
    headerText: '#009933',
    border: '#00993330',
    dot: '#009933'
  },
  warning: {
    bg: '#FFF9E8',
    headerBg: '#FFF2D0',
    headerText: '#FFCC33',
    border: '#FFCC3330',
    dot: '#FFCC33'
  },
  info: {
    bg: '#F9F9F9',
    headerBg: '#F5F5F5',
    headerText: '#666666',
    border: '#E5E5E5',
    dot: '#999999'
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
        rounded-xl 
        border
        shadow-sm 
        flex flex-col 
        max-h-full
        transition-all duration-200
        hover:shadow-md
      `}
      style={{ 
        backgroundColor: styles.bg,
        borderColor: styles.border
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Header de la columna */}
      <div 
        className={`
          px-4 py-3 
          rounded-t-xl 
          border-b
          flex items-center justify-between
        `}
        style={{ 
          backgroundColor: styles.headerBg,
          borderColor: styles.border
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Indicador de color (dot) */}
          <span 
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: styles.dot }}
          />
          
          {/* Título con truncado */}
          <h3 
            className="font-semibold text-sm sm:text-base truncate"
            style={{ 
              color: styles.headerText,
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            {title}
          </h3>

          {/* Badge con contador */}
          {count > 0 && (
            <span 
              className="inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 py-0.5 text-xs font-medium rounded-full border flex-shrink-0"
              style={{ 
                backgroundColor: styles.headerBg,
                color: styles.headerText,
                borderColor: styles.border
              }}
            >
              {count}
            </span>
          )}
        </div>

        {/* Icono opcional */}
        {Icon && (
          <Icon 
            className="w-4 h-4 flex-shrink-0" 
            style={{ color: styles.headerText, opacity: 0.7 }}
          />
        )}
      </div>

      {/* Contenido de la columna (cards) */}
      <div className="p-3 space-y-2 overflow-y-auto flex-1 min-h-[200px] max-h-[calc(100vh-300px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {children}

        {/* Mensaje cuando no hay elementos */}
        {(!children || (Array.isArray(children) && children.length === 0)) && (
          <div className="flex flex-col items-center justify-center h-24 text-center">
            <div 
              className="w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2"
              style={{ 
                backgroundColor: styles.bg,
                borderColor: styles.border
              }}
            >
              <span className="text-lg" style={{ color: styles.headerText, opacity: 0.5 }}>○</span>
            </div>
            <p className="text-xs" style={{ color: styles.headerText, opacity: 0.6 }}>
              No hay elementos
            </p>
          </div>
        )}
      </div>

      {/* Footer opcional */}
      <div 
        className="p-2 border-t rounded-b-xl text-xs text-center"
        style={{ 
          borderColor: styles.border,
          backgroundColor: styles.bg,
          color: styles.headerText,
          opacity: 0.7
        }}
      >
        <span></span>
      </div>
    </div>
  );
}