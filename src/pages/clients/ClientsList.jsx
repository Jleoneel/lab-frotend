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

// Modal de confirmación para eliminar (mejorado)
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
          {/* Header con color de advertencia */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
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
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
              <p className="text-gray-700">
                ¿Estás seguro que deseas eliminar al cliente{" "}
                <span className="font-semibold text-red-600">
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

  // Filtrar y ordenar clientes
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

  // Estadísticas
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
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con título y botón nuevo cliente */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
            <p className="text-sm text-gray-500">
              Gestiona tu cartera de clientes
            </p>
          </div>
        </div>

        <Link to="/clients/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total clientes</p>
              <p className="text-xl font-bold text-gray-800">{totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Con email</p>
              <p className="text-xl font-bold text-gray-800">
                {clientsWithEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cotizaciones</p>
              <p className="text-xl font-bold text-gray-800">{totalQuotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Solicitudes</p>
              <p className="text-xl font-bold text-gray-800">{totalRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
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
              className="px-3 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Nombre (A-Z)</option>
              <option value="name-desc">Nombre (Z-A)</option>
              <option value="city-asc">Ciudad (A-Z)</option>
              <option value="city-desc">Ciudad (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Resultados de búsqueda */}
        {searchTerm && (
          <p className="text-sm text-gray-500 mt-3">
            {filteredClients.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Lista de clientes */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm
              ? "No se encontraron clientes"
              : "No hay clientes registrados"}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Intenta con otros términos de búsqueda"
              : "Comienza agregando tu primer cliente"}
          </p>
          {!searchTerm && (
            <Link to="/clients/new">
              <Button>
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
              className="group relative bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
            >
              {/* Icono decorativo de fondo */}
              <div className="absolute bottom-4 right-4 opacity-5">
                <Users className="w-24 h-24 text-blue-600" />
              </div>

              <div className="relative">
                {/* Header con nombre y acciones */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {client.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">
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
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setClientToDelete(client);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Información de contacto en formato tarjeta */}
                <div className="space-y-2 mt-4">
                  {client.email ? (
                    <div className="flex items-center gap-2 text-sm bg-blue-50 rounded-lg p-2">
                      <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <a
                        href={`mailto:${client.email}`}
                        className="text-blue-600 hover:underline truncate"
                      >
                        {client.email}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2 text-gray-400">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="italic">Sin email</span>
                    </div>
                  )}

                  {client.phone ? (
                    <div className="flex items-center gap-2 text-sm bg-green-50 rounded-lg p-2">
                      <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <a
                        href={`tel:${client.phone}`}
                        className="text-green-600 hover:underline"
                      >
                        {client.phone}
                      </a>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2 text-gray-400">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span className="italic">Sin teléfono</span>
                    </div>
                  )}

                  {client.address && (
                    <div className="flex items-center gap-2 text-sm bg-gray-50 rounded-lg p-2">
                      <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span className="text-gray-600 truncate">
                        {client.address}
                      </span>
                    </div>
                  )}
                </div>

                {/* Estadísticas rápidas */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Cotizaciones</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {client._count?.quotes || 0}
                    </p>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Solicitudes</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {client._count?.requests || 0}
                    </p>
                  </div>
                </div>

                {/* Badge de actividad (opcional) */}
                {(client._count?.quotes > 0 || client._count?.requests > 0) && (
                  <div className="absolute top-0 right-0 -mt-2 -mr-2">
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Activo
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
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
