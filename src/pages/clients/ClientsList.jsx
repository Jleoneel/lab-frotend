import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Users, Edit, Trash2, Mail, Phone,
  Search, MapPin, Building2, FileText, ClipboardList,
} from 'lucide-react';
import { clientService } from '../../services/clientService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import EditClientModal from '../../components/clients/EditClientModa';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import IconButton from '../../components/common/IconButton';
import DeleteConfirmModal from '../../components/common/DeleteConfirmModal';

export default function ClientsList() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showEditModal, setShowEditModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);

  useEffect(() => { loadClients(); }, []);

  const loadClients = async () => {
    try {
      const response = await clientService.getAll();
      setClients(response.data);
    } catch {
      // silently handled
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
    } catch {
      // silently handled
    }
  };

  const openDelete = (client) => { setClientToDelete(client); setShowDeleteModal(true); };
  const openEdit   = (client) => { setClientToEdit(client);   setShowEditModal(true);   };

  const filteredClients = clients
    .filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm) ||
        c.city?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      return (a[sortBy] > b[sortBy] ? 1 : -1) * dir;
    });

  if (loading) return <LoadingSpinner message="Cargando clientes..." />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PageHeader icon={Users} title="Clientes" subtitle="Gestiona tu cartera de clientes">
        <Link to="/clients/new">
          <Button className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Cliente
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}         label="Total clientes" value={clients.length}                               variant="green" />
        <StatCard icon={Mail}          label="Con email"      value={clients.filter(c => c.email).length}          variant="green" />
        <StatCard icon={FileText}      label="Cotizaciones"   value={clients.reduce((a, c) => a + (c._count?.quotes || 0), 0)}    variant="green" />
        <StatCard icon={ClipboardList} label="Solicitudes"    value={clients.reduce((a, c) => a + (c._count?.requests || 0), 0)}  variant="gold"  />
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#666666' }} />
            <Input
              placeholder="Buscar por nombre, email, teléfono o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          <select
            value={`${sortBy}-${sortDirection}`}
            onChange={(e) => {
              const [field, dir] = e.target.value.split('-');
              setSortBy(field);
              setSortDirection(dir);
            }}
            className="px-3 py-2 border rounded-xl bg-white text-sm focus:outline-none"
            style={{ borderColor: '#E5E5E5', color: '#333333' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#009933')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
          >
            <option value="name-asc">Nombre (A-Z)</option>
            <option value="name-desc">Nombre (Z-A)</option>
            <option value="city-asc">Ciudad (A-Z)</option>
            <option value="city-desc">Ciudad (Z-A)</option>
          </select>
        </div>
        {searchTerm && (
          <p className="text-sm mt-3" style={{ color: '#666666' }}>
            {filteredClients.length} resultado(s) para "{searchTerm}"
          </p>
        )}
      </div>

      {filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
          description={
            searchTerm
              ? 'Intenta con otros términos de búsqueda'
              : 'Comienza agregando tu primer cliente'
          }
          action={
            !searchTerm && (
              <Link to="/clients/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Cliente
                </Button>
              </Link>
            )
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onEdit={() => openEdit(client)}
              onDelete={() => openDelete(client)}
            />
          ))}
        </div>
      )}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        description={
          <>
            ¿Estás seguro que deseas eliminar al cliente{' '}
            <span className="font-semibold" style={{ color: '#DC2626' }}>
              "{clientToDelete?.name}"
            </span>
            ?
          </>
        }
        detail={clientToDelete?.email ? `Email: ${clientToDelete.email}` : undefined}
        confirmLabel="Eliminar Cliente"
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

function ClientCard({ client, onEdit, onDelete }) {
  return (
    <div
      className="group relative bg-white rounded-2xl border p-6 hover:shadow-lg transition-all duration-200"
      style={{ borderColor: '#E5E5E5' }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#009933')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#E5E5E5')}
    >
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
                {client.city ?? 'Ciudad no especificada'}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <IconButton icon={Edit}   onClick={onEdit}   title="Editar"    variant="green" />
            <IconButton icon={Trash2} onClick={onDelete} title="Eliminar"  variant="red"   />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <ContactRow
            icon={Mail}
            value={client.email}
            href={client.email ? `mailto:${client.email}` : undefined}
            bg={client.email ? '#E8F5E9' : '#F9F9F9'}
            color={client.email ? '#009933' : '#999999'}
            emptyLabel="Sin email"
          />
          <ContactRow
            icon={Phone}
            value={client.phone}
            href={client.phone ? `tel:${client.phone}` : undefined}
            bg={client.phone ? '#FFF9E8' : '#F9F9F9'}
            color={client.phone ? '#FFCC33' : '#999999'}
            emptyLabel="Sin teléfono"
          />
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
              {client._count?.quotes ?? 0}
            </p>
          </div>
          <div className="text-center rounded-lg p-2" style={{ backgroundColor: '#FFF9E8' }}>
            <p className="text-xs" style={{ color: '#666666' }}>Solicitudes</p>
            <p className="text-lg font-semibold" style={{ color: '#FFCC33' }}>
              {client._count?.requests ?? 0}
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
  );
}

//eslint-disable-next-line
function ContactRow({ icon: Icon, value, href, bg, color, emptyLabel }) {
  return (
    <div className="flex items-center gap-2 text-sm rounded-lg p-2" style={{ backgroundColor: bg }}>
      <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
      {value ? (
        href ? (
          <a href={href} className="hover:underline truncate" style={{ color }}>
            {value}
          </a>
        ) : (
          <span className="truncate" style={{ color }}>{value}</span>
        )
      ) : (
        <span className="italic" style={{ color }}>{emptyLabel}</span>
      )}
    </div>
  );
}
