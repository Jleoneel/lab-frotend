// pages/messages/MensajesPage.jsx
import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Search, Send, Users, Clock, CheckCheck, MoreVertical } from 'lucide-react';
import { mensajeService } from '../../services/mensajeService';
import { userService } from '../../services/userService';
import { useAuthStore } from '../../store/authStore';
import ConversacionModal from '../../components/layouts/ConversacionModal';

export default function MensajesPage() {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  const [conversaciones, setConversaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [conversacionAbierta, setConversacionAbierta] = useState(null);
  const [showNuevaConv, setShowNuevaConv] = useState(false);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => { loadConversaciones(); }, []);

  useEffect(() => {
    if (showNuevaConv && isAdmin) loadUsuarios();
  }, [showNuevaConv]);

  const loadConversaciones = async () => {
    try {
      const data = await mensajeService.getConversaciones();
      setConversaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsuarios = async () => {
    try {
      const response = await userService.getAll();
      const todos = Array.isArray(response.data) ? response.data : [];
      const idsConConversacion = conversaciones.map(c => c.otroUser.id);
      setUsuarios(todos.filter(u => u.id !== user?.id && !idsConConversacion.includes(u.id)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleAbrirConversacion = (conv) => {
    setConversacionAbierta({
      otroUserId: conv.otroUser.id,
      otroUserName: conv.otroUser.fullName
    });
  };

  const handleConversacionCerrada = () => {
    setConversacionAbierta(null);
    loadConversaciones();
  };

  const conversacionesFiltradas = conversaciones.filter(c =>
    c.otroUser.fullName.toLowerCase().includes(busqueda.toLowerCase())
  );

  const formatTime = (date) => {
    const d = new Date(date);
    const hoy = new Date();
    const esHoy = d.toDateString() === hoy.toDateString();
    return esHoy
      ? d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
      : d.toLocaleDateString('es-EC', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: '#E8F5E9' }}>
            <MessageSquare className="w-7 h-7" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>
              Mensajes
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>
              Conversaciones internas del laboratorio
            </p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowNuevaConv(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:shadow-md"
            style={{ backgroundColor: '#009933' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
          >
            <Plus className="w-4 h-4" />
            Nueva Conversación
          </button>
        )}
      </div>

      {/* Estadísticas rápidas */}
      {conversaciones.length > 0 && (
        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" style={{ color: '#009933' }} />
              <span className="text-sm" style={{ color: '#666666' }}>Total conversaciones</span>
              <span className="text-sm font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#E8F5E9', color: '#009933' }}>
                {conversaciones.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: '#666666' }} />
              <span className="text-xs" style={{ color: '#999999' }}>
                Última actualización: {new Date().toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Buscador */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: '#999999' }} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar conversación por nombre..."
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none transition-all"
            style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#009933'; e.currentTarget.style.boxShadow = '0 0 0 2px #00993320'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#E5E5E5'; e.currentTarget.style.boxShadow = 'none'; }}
          />
        </div>
      </div>

      {/* Lista conversaciones */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: '#E5E5E5' }}>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 rounded-full animate-spin"
              style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          </div>
        ) : conversacionesFiltradas.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: '#F5F5F5' }}>
              <MessageSquare className="w-10 h-10" style={{ color: '#CCCCCC' }} />
            </div>
            <p className="text-lg font-medium" style={{ color: '#333333' }}>
              {busqueda ? 'No se encontraron conversaciones' : 'No hay conversaciones aún'}
            </p>
            <p className="text-sm mt-1" style={{ color: '#666666' }}>
              {isAdmin && !busqueda 
                ? 'Inicia una nueva conversación con tus compañeros' 
                : busqueda 
                  ? 'Intenta con otros términos de búsqueda'
                  : 'Cuando tengas mensajes, aparecerán aquí'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <ul className="divide-y" style={{ borderColor: '#E5E5E5' }}>
                {conversacionesFiltradas.map((conv) => (
                  <li key={conv.otroUser.id}
                    onClick={() => handleAbrirConversacion(conv)}
                    className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/50 group"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                        style={{ backgroundColor: '#009933' }}>
                        {conv.otroUser.fullName.charAt(0).toUpperCase()}
                      </div>
                      {/* Indicador de no leídos */}
                      {conv.noLeidos > 0 && (
                        <div className="absolute -top-1 -right-1 min-w-[20px] h-5 rounded-full flex items-center justify-center text-white text-xs font-bold px-1.5 shadow-sm"
                          style={{ backgroundColor: '#DC2626' }}>
                          {conv.noLeidos > 9 ? '9+' : conv.noLeidos}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold truncate" style={{ color: '#333333' }}>
                          {conv.otroUser.fullName}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3" style={{ color: '#999999' }} />
                          <p className="text-xs" style={{ color: '#999999' }}>
                            {formatTime(conv.ultimoMensaje.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs truncate flex-1 ${conv.noLeidos > 0 ? 'font-medium' : ''}`}
                          style={{ color: conv.noLeidos > 0 ? '#333333' : '#999999' }}>
                          {conv.ultimoMensaje.fromId === user?.id && (
                            <span className="inline-flex items-center gap-0.5 mr-1">
                              <CheckCheck className="w-3 h-3" style={{ color: '#A5D6A7' }} />
                              <span>Tú: </span>
                            </span>
                          )}
                          {conv.ultimoMensaje.contenido}
                        </p>
                        {/* Rol badge */}
                        <span className="text-xs px-2.5 py-1 rounded-full flex-shrink-0 ml-2"
                          style={{
                            backgroundColor: conv.otroUser.role === 'ADMIN' ? '#E8F5E9' : '#FFF9E8',
                            color: conv.otroUser.role === 'ADMIN' ? '#009933' : '#996600'
                          }}>
                          {conv.otroUser.role === 'ADMIN' ? 'Administrador' : 'Analista'}
                        </span>
                      </div>
                    </div>

                    {/* Icono de enviar (hover) */}
                    <Send className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: '#009933' }} />
                  </li>
                ))}
              </ul>
            </div>
            {/* Footer con total */}
            <div className="border-t px-5 py-3" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <p className="text-xs" style={{ color: '#666666' }}>
                Mostrando {conversacionesFiltradas.length} de {conversaciones.length} conversaciones
              </p>
            </div>
          </>
        )}
      </div>

      {/* Modal nueva conversación */}
      {showNuevaConv && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: '#009933' }} />
                <h3 className="text-lg font-semibold" style={{ color: '#009933' }}>
                  Nueva Conversación
                </h3>
              </div>
              <button
                onClick={() => setShowNuevaConv(false)}
                className="p-1 rounded-lg transition-colors"
                style={{ color: '#666666' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {usuarios.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: '#F5F5F5' }}>
                    <Users className="w-8 h-8" style={{ color: '#CCCCCC' }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: '#666666' }}>
                    No hay usuarios disponibles
                  </p>
                  <p className="text-xs mt-1" style={{ color: '#999999' }}>
                    Todos los usuarios ya tienen una conversación activa
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                  {usuarios.map(u => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setShowNuevaConv(false);
                        setConversacionAbierta({ otroUserId: u.id, otroUserName: u.fullName });
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
                      style={{ backgroundColor: '#F9F9F9' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.border = '1px solid #00993330'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F9F9F9'; e.currentTarget.style.border = 'none'; }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm flex-shrink-0"
                        style={{ backgroundColor: '#009933' }}>
                        {u.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold" style={{ color: '#333333' }}>{u.fullName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-xs px-1.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: u.role === 'ADMIN' ? '#E8F5E9' : '#FFF9E8',
                              color: u.role === 'ADMIN' ? '#009933' : '#996600'
                            }}>
                            {u.role === 'ADMIN' ? 'Administrador' : 'Analista'}
                          </span>
                        </div>
                      </div>
                      <Send className="w-4 h-4 opacity-0 transition-opacity" style={{ color: '#009933' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t flex justify-end" style={{ borderColor: '#E5E5E5', backgroundColor: '#F9F9F9' }}>
              <button
                onClick={() => setShowNuevaConv(false)}
                className="px-4 py-2 rounded-lg text-sm transition-colors"
                style={{ color: '#666666' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5'; e.currentTarget.style.color = '#009933'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conversación */}
      <ConversacionModal
        isOpen={!!conversacionAbierta}
        onClose={handleConversacionCerrada}
        otroUserId={conversacionAbierta?.otroUserId}
        otroUserName={conversacionAbierta?.otroUserName}
      />
    </div>
  );
}