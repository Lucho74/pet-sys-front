import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ActionSheet } from '../../components/common/ActionSheet';
import { ROLE_LABELS } from '../../components/users/types';
import type { UsersOutletContext } from '../../components/users/types';

export function UserActionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users } = useOutletContext<UsersOutletContext>();

  const selected = users.find((user) => String(user.id) === id);

  if (!selected) return null;

  return (
    <ActionSheet
      title={selected.fullName}
      subtitle={`${ROLE_LABELS[selected.roleName]} · ${selected.email}`}
      editLabel="Editar usuario"
      deleteLabel="Eliminar usuario"
      onClose={() => navigate('/users')}
      onEdit={() => navigate(`/users/${selected.id}/edit`)}
      onDelete={() => navigate(`/users/${selected.id}/delete`)}
    />
  );
}
