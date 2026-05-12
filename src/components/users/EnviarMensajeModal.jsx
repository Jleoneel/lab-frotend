// components/messages/EnviarMensajeModal.jsx
import { useState } from 'react';
import { Send, Mail, User, MessageSquare, SendHorizontal, CheckCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import ModalActions from '../common/ModalActions';
import { mensajeService } from '../../services/mensajeService';
import Swal from 'sweetalert2';

export default function EnviarMensajeModal({ isOpen, onClose, user }) {
  const [contenido, setContenido] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!contenido.trim()) {
      await Swal.fire({
        icon: 'warning',
        title: 'Mensaje vacío',
        text: 'Por favor escribe un mensaje antes de enviar',
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true
      });
      return;
    }
    
    setSending(true);
    try {
      await mensajeService.send(user.id, contenido);
      await Swal.fire({
        icon: 'success',
        title: '¡Mensaje enviado!',
        html: `Mensaje enviado a <strong>${user.fullName}</strong> correctamente`,
        confirmButtonColor: '#009933',
        timer: 2000,
        timerProgressBar: true,
        backdrop: true
      });
      setContenido('');
      onClose();
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error al enviar',
        text: error.response?.data?.message || 'No se pudo enviar el mensaje',
        confirmButtonColor: '#dc3545'
      });
    } finally {
      setSending(false);
    }
  };

  // Calcular caracteres restantes (máximo sugerido 1000)
  const caracteresRestantes = 1000 - contenido.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Nuevo Mensaje`} size="md">
      <div className="space-y-5">
        {/* Información del destinatario */}
        {user && (
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: "#E8F5E9", border: "1px solid #00993330" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
              <Mail className="w-5 h-5" style={{ color: "#009933" }} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "#666666" }}>
                Para
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0"
                  style={{ backgroundColor: "#009933" }}
                >
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#009933" }}>
                    {user.fullName}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <User className="w-3 h-3" style={{ color: "#666666" }} />
                    <p className="text-xs" style={{ color: "#666666" }}>
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Campos del mensaje */}
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: "#666666" }}>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mensaje</span>
              <span className="text-xs font-normal" style={{ color: "#DC2626" }}>*</span>
            </div>
          </label>
          <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows={5}
            placeholder="Escribe tu mensaje aquí..."
            className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none transition-all resize-none"
            style={{ borderColor: "#E5E5E5", color: "#333333" }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#009933";
              e.currentTarget.style.boxShadow = "0 0 0 2px #00993320";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E5E5E5";
              e.currentTarget.style.boxShadow = "none";
            }}
            maxLength={1000}
          />
          
          {/* Contador de caracteres */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: contenido.trim() ? '#009933' : '#CCCCCC' }} />
              <p className="text-xs" style={{ color: contenido.trim() ? '#009933' : '#999999' }}>
                {contenido.trim() ? 'Mensaje listo para enviar' : 'Escribe tu mensaje'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-mono ${caracteresRestantes < 100 ? 'text-red-500' : 'text-gray-400'}`}>
                {caracteresRestantes}
              </span>
              <span className="text-xs text-gray-400">caracteres restantes</span>
            </div>
          </div>
        </div>

        {/* Vista previa (opcional - solo cuando hay contenido) */}
        {contenido.trim() && (
          <div className="rounded-xl p-3 border" style={{ backgroundColor: "#FFF9E8", borderColor: "#FFCC3330" }}>
            <div className="flex items-center gap-2 mb-2">
              <Send className="w-3.5 h-3.5" style={{ color: "#FFCC33" }} />
              <p className="text-xs font-medium" style={{ color: "#996600" }}>Vista previa del mensaje</p>
            </div>
            <p className="text-sm" style={{ color: "#666666" }}>
              {contenido.length > 150 ? contenido.substring(0, 150) + '...' : contenido}
            </p>
          </div>
        )}
        <ModalActions
          onCancel={onClose}
          onConfirm={handleSend}
          confirmLabel="Enviar Mensaje"
          loadingLabel="Enviando..."
          loading={sending}
          disabled={!contenido.trim()}
          icon={SendHorizontal}
        />
      </div>
    </Modal>
  );
}