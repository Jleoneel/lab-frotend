import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  KeyRound,
  Users,
  ShieldCheck,
  FlaskConical,
  MessageSquare,
} from "lucide-react";
import { userService } from "../../services/userService";
import NuevoUsuarioModal from "../../components/users/NuevoUsuarioModal";
import EditUsuarioModal from "../../components/users/EditUsuarioModal";
import ResetPasswordModal from "../../components/users/ResetPasswordModal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import IconButton from "../../components/common/IconButton";
import Button from "../../components/ui/Button";
import ConversacionModal from "../../components/layouts/ConversacionModal";

const ROLES = {
  ADMIN: {
    label: "Administrador",
    color: "#009933",
    bg: "#E8F5E9",
    icon: ShieldCheck,
  },
  ANALYST: {
    label: "Analista",
    color: "#FFCC33",
    bg: "#FFF9E8",
    icon: FlaskConical,
  },
};

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNuevoModal, setShowNuevoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userSeleccionado, setUserSeleccionado] = useState(null);
  const [conversacionAbierta, setConversacionAbierta] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAll();
      setUsers(Array.isArray(response.data) ? response.data : []);
      //eslint-disable-next-line
    } catch {
      // silently handled
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (user) => {
    setUserSeleccionado(user);
    setShowEditModal(true);
  };
  const openReset = (user) => {
    setUserSeleccionado(user);
    setShowResetModal(true);
  };

  if (loading) return <LoadingSpinner message="Cargando usuarios..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <PageHeader
        icon={Users}
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios del sistema"
      >
        <Button onClick={() => setShowNuevoModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Usuario
        </Button>
      </PageHeader>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total usuarios"
          value={users.length}
          variant="green"
        />
        <StatCard
          icon={ShieldCheck}
          label="Administradores"
          value={users.filter((u) => u.role === "ADMIN").length}
          variant="green"
        />
        <StatCard
          icon={FlaskConical}
          label="Analistas"
          value={users.filter((u) => u.role === "ANALYST").length}
          variant="gold"
        />
      </div>

      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "#E5E5E5" }}
      >
        <table className="w-full text-sm">
          <thead
            className="border-b"
            style={{ backgroundColor: "#F9F9F9", borderColor: "#E5E5E5" }}
          >
            <tr>
              {["Usuario", "Rol", "Estado", "Acciones"].map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 font-medium ${i >= 2 ? "text-center" : "text-left"}`}
                  style={{ color: "#666666" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "#E5E5E5" }}>
            {users.map((user) => {
              const rolInfo = ROLES[user.role] ?? ROLES.ANALYST;
              const RolIcon = rolInfo.icon;
              return (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: "#009933" }}
                      >
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: "#333333" }}>
                          {user.fullName}
                        </p>
                        <p className="text-xs" style={{ color: "#666666" }}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full font-medium w-fit"
                      style={{
                        backgroundColor: rolInfo.bg,
                        color: rolInfo.color,
                      }}
                    >
                      <RolIcon className="w-3 h-3" />
                      {rolInfo.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#E8F5E9", color: "#009933" }}
                    >
                      Activo
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <IconButton
                        icon={Edit}
                        onClick={() => openEdit(user)}
                        title="Editar usuario"
                        variant="green"
                      />
                      <IconButton
                        icon={KeyRound}
                        onClick={() => openReset(user)}
                        title="Resetear contraseña"
                        variant="gold"
                      />
                      <IconButton
                        icon={MessageSquare}
                        onClick={() =>
                          setConversacionAbierta({
                            otroUserId: user.id,
                            otroUserName: user.fullName,
                          })
                        }
                        title="Conversacion"
                        variant="green"
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <NuevoUsuarioModal
        isOpen={showNuevoModal}
        onClose={() => setShowNuevoModal(false)}
        onSaved={loadUsers}
      />
      <EditUsuarioModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={userSeleccionado}
        onSaved={loadUsers}
      />
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        user={userSeleccionado}
      />
      <ConversacionModal
        isOpen={!!conversacionAbierta}
        onClose={() => setConversacionAbierta(null)}
        otroUserId={conversacionAbierta?.otroUserId}
        otroUserName={conversacionAbierta?.otroUserName}
      />
    </div>
  );
}
