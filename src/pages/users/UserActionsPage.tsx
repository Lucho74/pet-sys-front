import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ActionSheet } from '../../components/common/ActionSheet';
import { ROLE_LABELS } from '../../components/users/userTypes';
import type { UsersOutletContext } from '../../components/users/userTypes';
import { handleReactivateUser } from '../../services/users/userService';
import type { AssignableRole } from '../../services/users/IUser';
import { getManageableRoles } from '../../utils/roles';
import { useAuth } from '../../contexts/AuthenticationContext';

export function UserActionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, setUserDeleted } = useOutletContext<UsersOutletContext>();
  const { role } = useAuth();

  const selected = users.find((user) => String(user.id) === id);

  if (!selected) return null;

  const canSuspend = getManageableRoles(role).includes(selected.roleName as AssignableRole);
  const subtitle = `${ROLE_LABELS[selected.roleName]} · ${selected.email}`;

  if (selected.isDeleted) {
    const handleReactivate = async () => {
      try {
        await handleReactivateUser(String(selected.id));
        setUserDeleted(selected.id, false);
        toast.success('Usuario reactivado correctamente.');
      } catch {
        toast.error('No se pudo reactivar el usuario.');
      }

      navigate('/users');
    };

    return (
      <ActionSheet
        title={selected.fullName}
        subtitle={subtitle}
        isDeleted
        editLabel="Reactivar usuario"
        onClose={() => navigate('/users')}
        onEdit={handleReactivate}
      />
    );
  }

  return (
    <ActionSheet
      title={selected.fullName}
      subtitle={subtitle}
      editLabel="Editar usuario"
      deleteLabel="Eliminar usuario"
      onClose={() => navigate('/users')}
      onEdit={() => navigate(`/users/${selected.id}/edit`)}
      onDelete={canSuspend ? () => navigate(`/users/${selected.id}/delete`) : undefined}
    />
  );
}
