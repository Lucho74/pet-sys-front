import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { SuspendDialog } from '../../components/common/SuspendDialog';
import { handleDeleteUser } from '../../services/users/userService';
import type { UsersOutletContext } from '../../components/users/userTypes';
import { canManage } from '../../utils/roles';
import { errorMessage } from '../../utils/errors';
import { useAuth } from '../../contexts/AuthenticationContext';

export function UserDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, setUserDeleted } = useOutletContext<UsersOutletContext>();
  const { role } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = users.find((user) => String(user.id) === id);

  if (!selected || !canManage(role, selected.roleName)) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      await handleDeleteUser(String(selected.id));
      setUserDeleted(selected.id, true);
      toast.success('Usuario suspendido correctamente.');
    } catch (error) {
      toast.error(errorMessage(error, 'No se pudo suspender el usuario.'));
    }

    navigate('/users');
  };

  return (
    <SuspendDialog
      name={selected.fullName}
      isDeleting={isDeleting}
      onCancel={() => navigate(`/users/${selected.id}`)}
      onConfirm={handleConfirm}
    />
  );
}
