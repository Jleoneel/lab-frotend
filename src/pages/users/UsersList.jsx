import { useState, useEffect } from 'react';
import { Plus, Edit, KeyRound, Users, ShieldCheck, FlaskConical, ToggleLeft, ToggleRight } from 'lucide-react';
import { userService } from '../../services/userService';
import NuevoUsuarioModal from '../../components/users/NuevoUsuarioModal';
import EditUsuarioModal from '../../components/users/EditUsuarioModal';
import ResetPasswordModal from '../../components/users/ResetPasswordModal';

const ROLES = {
    ADMIN: { label: 'Administrador', color: '#009933', bg: '#E8F5E9', icon: ShieldCheck },
    ANALYST: { label: 'Analista', color: '#FFCC33', bg: '#FFF9E8', icon: FlaskConical }
};

export default function UsersList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNuevoModal, setShowNuevoModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [userSeleccionado, setUserSeleccionado] = useState(null);

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try {
            const response = await userService.getAll();
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalAdmins = users.filter(u => u.role === 'ADMIN').length;
    const totalAnalistas = users.filter(u => u.role === 'ANALYST').length;
    const totalActivos = users.filter(u => u.isActive).length;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 rounded-full animate-spin mx-auto mb-4"
                        style={{ borderColor: '#009933', borderTopColor: '#FFCC33' }}></div>
                    <p className="text-sm" style={{ color: '#666666' }}>Cargando usuarios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                        <Users className="w-5 h-5" style={{ color: '#009933' }} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ color: '#009933' }}>Gestión de Usuarios</h1>
                        <p className="text-sm" style={{ color: '#666666' }}>Administra los usuarios del sistema</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowNuevoModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white"
                    style={{ backgroundColor: '#009933' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00802b'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009933'}
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total usuarios', value: users.length, color: '#009933', bg: '#E8F5E9' },
                    { label: 'Administradores', value: totalAdmins, color: '#009933', bg: '#E8F5E9' },
                    { label: 'Analistas', value: totalAnalistas, color: '#FFCC33', bg: '#FFF9E8' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-xl border p-4 shadow-sm" style={{ borderColor: '#E5E5E5' }}>
                        <p className="text-sm" style={{ color: '#666666' }}>{stat.label}</p>
                        <p className="text-2xl font-bold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden" style={{ borderColor: '#E5E5E5' }}>
                <table className="w-full text-sm">
                    <thead className="border-b" style={{ backgroundColor: '#F9F9F9', borderColor: '#E5E5E5' }}>
                        <tr>
                            <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Usuario</th>
                            <th className="px-6 py-4 text-left font-medium" style={{ color: '#666666' }}>Rol</th>
                            <th className="px-6 py-4 text-center font-medium" style={{ color: '#666666' }}>Estado</th>
                            <th className="px-6 py-4 text-center font-medium" style={{ color: '#666666' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: '#E5E5E5' }}>
                        {users.map((user) => {
                            const rolInfo = ROLES[user.role] || ROLES.ANALYST;
                            const RolIcon = rolInfo.icon;
                            return (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                                                style={{ backgroundColor: '#009933' }}>
                                                {user.fullName.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium" style={{ color: '#333333' }}>{user.fullName}</p>
                                                <p className="text-xs" style={{ color: '#666666' }}>{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium w-fit"
                                            style={{ backgroundColor: rolInfo.bg, color: rolInfo.color }}>
                                            <RolIcon className="w-3 h-3" />
                                            {rolInfo.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {user ? (
                                            <span className="text-xs px-2 py-1 rounded-full"
                                                style={{ backgroundColor: '#E8F5E9', color: '#009933' }}>Activo</span>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded-full"
                                                style={{ backgroundColor: '#F5F5F5', color: '#666666' }}>Inactivo</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => { setUserSeleccionado(user); setShowEditModal(true); }}
                                                className="p-2 rounded-lg transition-colors"
                                                style={{ color: '#666666' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E8F5E9'; e.currentTarget.style.color = '#009933'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                                                title="Editar usuario"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { setUserSeleccionado(user); setShowResetModal(true); }}
                                                className="p-2 rounded-lg transition-colors"
                                                style={{ color: '#666666' }}
                                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FFF9E8'; e.currentTarget.style.color = '#FFCC33'; }}
                                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#666666'; }}
                                                title="Resetear contraseña"
                                            >
                                                <KeyRound className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <NuevoUsuarioModal isOpen={showNuevoModal} onClose={() => setShowNuevoModal(false)} onSaved={loadUsers} />
            <EditUsuarioModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} user={userSeleccionado} onSaved={loadUsers} />
            <ResetPasswordModal isOpen={showResetModal} onClose={() => setShowResetModal(false)} user={userSeleccionado} />
        </div>
    );
}