// components/messages/ConversacionModal.jsx
import { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Smile, CheckCheck, Clock as ClockIcon } from 'lucide-react';
import { mensajeService } from '../../services/mensajeService';
import { useAuthStore } from '../../store/authStore';

export default function ConversacionModal({ isOpen, onClose, otroUserId, otroUserName }) {
  const { user } = useAuthStore();
  const [mensajes, setMensajes] = useState([]);
  const [otroUser, setOtroUser] = useState(null);
  const [contenido, setContenido] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [newMessagesCount, setNewMessagesCount] = useState(0);

  useEffect(() => {
    if (isOpen && otroUserId) {
      loadConversacion();
    }
  }, [isOpen, otroUserId]);

  // Auto-refresh solo para nuevos mensajes (sin recargar todo el modal)
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(async () => {
      try {
        const data = await mensajeService.getConversacion(otroUserId);
        const nuevosMensajes = data.mensajes || [];
        
        // Solo actualizar si hay nuevos mensajes
        if (nuevosMensajes.length !== mensajes.length) {
          setMensajes(nuevosMensajes);
          setNewMessagesCount(prev => prev + (nuevosMensajes.length - mensajes.length));
          // Limpiar el contador después de 3 segundos
          setTimeout(() => setNewMessagesCount(0), 3000);
        }
      } catch (error) {
        console.error(error);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isOpen, otroUserId, mensajes.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  const loadConversacion = async () => {
    setLoading(true);
    try {
      const data = await mensajeService.getConversacion(otroUserId);
      setMensajes(data.mensajes || []);
      setOtroUser(data.otroUser);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!contenido.trim() || sending) return;
    setSending(true);
    try {
      await mensajeService.send(otroUserId, contenido);
      setContenido('');
      await loadConversacion();
      inputRef.current?.focus();
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatHour = (date) => {
    return new Date(date).toLocaleTimeString('es-EC', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Función para determinar si un mensaje es de hoy, ayer o otra fecha
  const getDateLabel = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (msgDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return msgDate.toLocaleDateString('es-EC', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
    }
  };

  // Agrupar mensajes por fecha
  const groupMessagesByDate = () => {
    const groups = [];
    let currentDate = null;
    
    //eslint-disable-next-line
    mensajes.forEach((msg, idx) => {
      const msgDate = new Date(msg.createdAt).toDateString();
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({
          date: msgDate,
          label: getDateLabel(msg.createdAt),
          messages: []
        });
      }
      groups[groups.length - 1].messages.push(msg);
    });
    
    return groups;
  };

  if (!isOpen) return null;

  const messageGroups = groupMessagesByDate();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ height: '650px', maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0"
          style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                style={{ backgroundColor: '#009933' }}>
                {(otroUserName || otroUser?.fullName || '?').charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#333333' }}>
                {otroUserName || otroUser?.fullName || 'Conversación'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#009933' }}></div>
                <p className="text-xs" style={{ color: '#009933' }}>
                  {otroUser?.role === 'ADMIN' ? 'Administrador' : 'Analista'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {newMessagesCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                +{newMessagesCount}
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors"
              style={{ color: '#666666' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          style={{ backgroundColor: '#FAFAFA' }}>
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 rounded-full animate-spin"
                style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
            </div>
          ) : mensajes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                <Send className="w-6 h-6" style={{ color: '#CCCCCC' }} />
              </div>
              <p className="text-sm font-medium" style={{ color: '#999999' }}>No hay mensajes aún</p>
              <p className="text-xs" style={{ color: '#CCCCCC' }}>Sé el primero en escribir</p>
            </div>
          ) : (
            messageGroups.map((group, groupIdx) => (
              <div key={groupIdx}>
                {/* Separador de fecha */}
                <div className="flex justify-center my-4">
                  <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: '#F0F0F0', color: '#666666' }}>
                    {group.label}
                  </span>
                </div>
                
                {/* Mensajes del grupo */}
                {group.messages.map((msg) => {
                  const esMio = msg.fromId === user?.id;
                  return (
                    <div key={msg.id} className={`flex mb-3 ${esMio ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${esMio ? 'items-end' : 'items-start'}`}>
                        {/* Burbuja */}
                        <div
                          className={`relative px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                            esMio ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'
                          }`}
                          style={{
                            backgroundColor: esMio ? '#009933' : '#FFFFFF',
                            color: esMio ? '#FFFFFF' : '#333333',
                            border: esMio ? 'none' : '1px solid #E5E5E5'
                          }}
                        >
                          {msg.contenido}
                        </div>
                        {/* Hora y estado */}
                        <div className={`flex items-center gap-1 mt-1 ${esMio ? 'justify-end' : 'justify-start'}`}>
                          <ClockIcon className="w-2.5 h-2.5" style={{ color: '#CCCCCC' }} />
                          <p className="text-xs" style={{ color: '#999999' }}>
                            {formatHour(msg.createdAt)}
                          </p>
                          {esMio && (
                            <CheckCheck className="w-3 h-3 ml-1" style={{ color: '#A5D6A7' }} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t flex-shrink-0" style={{ borderColor: '#E5E5E5', backgroundColor: '#FFFFFF' }}>
          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Escribe un mensaje..."
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none resize-none transition-all"
                style={{
                  borderColor: '#E5E5E5',
                  color: '#333333',
                  fontFamily: "'Montserrat', sans-serif",
                  maxHeight: '100px',
                  overflowY: 'auto'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#009933';
                  e.currentTarget.style.boxShadow = '0 0 0 2px #00993320';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#E5E5E5';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !contenido.trim()}
              className="p-2.5 rounded-xl text-white disabled:opacity-40 flex-shrink-0 transition-all hover:shadow-md"
              style={{ backgroundColor: '#009933' }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#00802b'; }}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex justify-between items-center mt-1.5">
            <p className="text-xs" style={{ color: '#CCCCCC' }}>
              <kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: '#F0F0F0', color: '#666666' }}>Shift</kbd> + <kbd className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: '#F0F0F0', color: '#666666' }}>Enter</kbd> para nueva línea
            </p>
            <p className="text-xs" style={{ color: '#CCCCCC' }}>
              {contenido.length} caracteres
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}