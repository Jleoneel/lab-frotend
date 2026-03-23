// pages/clients/ClientsList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Users,
  Edit,
  Trash2,
  Mail,
  Phone,
  Search,
  MapPin,
  Building2,
  FileText,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react";
import { clientService } from "../../services/clientService";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import EditClientModal from "../../components/clients/EditClientModa";

// Modal de confirmación para eliminar con colores UTM
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, client }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in">
          {/* Header con color de advertencia rojo UTM */}
          <div className="px-6 py-4" style={{ backgroundColor: '#DC2626' }}>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-lg p-2">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Confirmar eliminación
                </h3>
                <p className="text-sm text-white/80">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2' }}>
              <p className="text-gray-700">
                ¿Estás seguro que deseas eliminar al cliente{" "}
                <span className="font-semibold" style={{ color: '#DC2626' }}>
                  "{client?.name}"
                </span>
                ?
              </p>
              {client?.email && (
                <p className="text-sm text-gray-500 mt-2">
                  Email: <span className="font-mono">{client.email}</span>
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <Button
                variant="ghost"
                onClick={onClose}
                className="order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={onConfirm}
                className="order-1 sm:order-2"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Cliente
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientService.getAll();
      setClients(response.data);
    } catch (error) {
      console.error("Error cargando clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!clientToDelete) return;

    try {
      await clientService.delete(clientToDelete.id);
      setClients(clients.filter((c) => c.id !== clientToDelete.id));
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (error) {
      console.error("Error eliminando cliente:", error);
    }
  };

  const filteredClients = clients
    .filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.city?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      const direction = sortDirection === "asc" ? 1 : -1;
      return (aVal > bVal ? 1 : -1) * direction;
    });

  const totalClients = clients.length;
  const totalQuotes = clients.reduce(
    (acc, c) => acc + (c._count?.quotes || 0),
    0,
  );
  const totalRequests = clients.reduce(
    (acc, c) => acc + (c._count?.requests || 0),
    0,
  );
  const clientsWithEmail = clients.filter((c) => c.email).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
          <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título y botón nuevo cliente */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
            <Users className="w-5 h-5" style={{ color: '#009933' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#009933', fontFamily: "'Trajan Pro Bold', serif" }}>Clientes</h1>
            <p className="text-sm" style={{ color: '#666666', fontFamily: "'Montserrat', sans-serif" }}>Gestiona tu cartera de clientes</p>
          </div>
        </div>

        <Link to="/clients/new">
          <Button className="w-full sm:w-auto" style={{ backgroundColor: '#009933' }}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <Users className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Total clientes</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <Mail className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Con email</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{clientsWithEmail}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <FileText className="w-5 h-5" style={{ color: '#009933' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Cotizaciones</p>
              <p className="text-xl font-bold" style={{ color: '#009933' }}>{totalQuotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF9E8' }}>
              <ClipboardList className="w-5 h-5" style={{ color: '#FFCC33' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#666666' }}>Solicitudes</p>
              <p className="text-xl font-bold" style={{ color: '#FFCC33' }}>{totalRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#666666' }} />
            <Input
              placeholder="Buscar por nombre, email, teléfono o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={`${sortBy}-${sortDirection}`}
              onChange={(e) => {
                const [field, direction] = e.target.value.split("-");
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="px-3 py-2 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
              style={{ borderColor: '#E5E5E5', color: '#333333', fontFamily: "'Montserrat', sans-serif" }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#009933'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
            >
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="city-asc">Ciudad (A-Z)</option>
              <option value="city-desc">Ciudad (Z-A)</option>
            </select>
          </div>
        </div>

        {searchTerm && (
          <p className="text-sm mt-3" style={{ color: '#666666' }}>
            {filteredClients.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Lista de clientes */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center shadow-sm" style={{ borderColor: '#E5E5E5' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F5F5F5' }}>
            <Users className="w-10 h-10" style={{ color: '#CCCCCC' }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: '#333333' }}>
            {searchTerm ? "No se encontraron clientes" : "No hay clientes registrados"}
          </h3>
          <p className="text-sm mb-4" style={{ color: '#666666' }}>
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando tu primer cliente"}
          </p>
          {!searchTerm && (
            <Link to="/clients/new">
              <Button style={{ backgroundColor: '#009933' }}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Cliente
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="group relative bg-white rounded-2xl border p-6 hover:shadow-lg transition-all duration-200"
              style={{ borderColor: '#E5E5E5' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#009933'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
            >
              {/* Icono decorativo de fondo */}
              <div className="absolute bottom-4 right-4 opacity-5">
                <Users className="w-24 h-24" style={{ color: '#009933' }} />
              </div>

              <div className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold" style={{ color: '#009933' }}>{client.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" style={{ color: '#666666' }} />
                      <p className="text-xs" style={{ color: '#666666' }}>
                        {client.city || "Ciudad no especificada"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setClientToEdit(client);
                        setShowEditModal(true);
                      }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#666666' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setClientToDelete(client);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 rounded-lg transition-colors"
                      style={{ color: '#666666' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.color = '#DC2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  {client.email ? (
                    <div className="flex items-center gap-2 text-sm rounded-lg p-2" style={{ backgroundColor: '#E8F5E9' }}>
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#009933' }} />
                      <a href={`mailto:${client.email}`} className="hover:underline truncate" style={{ color: '#009933' }}>
                        {client.email}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm rounded-lg p-2" style={{ backgroundColor: '#F9F9F9', color: '#999999' }}>
                      <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#CCCCCC' }} />
                      <span className="italic">Sin email</span>
                    </div>
                  )}

                  {client.phone ? (
                    <div className="flex items-center gap-2 text-sm rounded-lg p-2" style={{ backgroundColor: '#FFF9E8' }}>
                      <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#FFCC33' }} />
                      <a href={`tel:${client.phone}`} className="hover:underline" style={{ color: '#FFCC33' }}>
                        {client.phone}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm rounded-lg p-2" style={{ backgroundColor: '#F9F9F9', color: '#999999' }}>
                      <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#CCCCCC' }} />
                      <span className="italic">Sin teléfono</span>
                    </div>
                  )}

                  {client.address && (
                    <div className="flex items-center gap-2 text-sm rounded-lg p-2" style={{ backgroundColor: '#F9F9F9' }}>
                      <Building2 className="w-4 h-4 flex-shrink-0" style={{ color: '#666666' }} />
                      <span className="truncate" style={{ color: '#666666' }}>{client.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-3" style={{ borderColor: '#E5E5E5' }}>
                  <div className="text-center rounded-lg p-2" style={{ backgroundColor: '#F9F9F9' }}>
                    <p className="text-xs" style={{ color: '#666666' }}>Cotizaciones</p>
                    <p className="text-lg font-semibold" style={{ color: '#009933' }}>
                      {client._count?.quotes || 0}
                    </p>
                  </div>
                  <div className="text-center rounded-lg p-2" style={{ backgroundColor: '#FFF9E8' }}>
                    <p className="text-xs" style={{ color: '#666666' }}>Solicitudes</p>
                    <p className="text-lg font-semibold" style={{ color: '#FFCC33' }}>
                      {client._count?.requests || 0}
                    </p>
                  </div>
                </div>

                {(client._count?.quotes > 0 || client._count?.requests > 0) && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <Badge variant="utm_green">Activo</Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        client={clientToDelete}
      />
      <EditClientModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        client={clientToEdit}
        onSaved={loadClients}
      />
    </div>
  );
}