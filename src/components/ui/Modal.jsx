// components/ui/Modal.jsx
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay con transición */}
      <div 
        className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} overflow-hidden animate-in fade-in zoom-in duration-200`}
          style={{ borderColor: '#E5E5E5' }}
        >
          {/* Header con borde y color institucional */}
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#E5E5E5' }}>
            <h3 
              className="text-lg font-semibold"
              style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="transition-colors rounded-lg p-1"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}