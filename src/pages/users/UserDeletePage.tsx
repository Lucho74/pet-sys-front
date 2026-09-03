import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../components/common/DeleteDialog';
import { handleDeleteUser } from '../../services/users/userService';
import type { UsersOutletContext } from '../../components/users/userTypes';

export function UserDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { users, removeUser } = useOutletContext<UsersOutletContext>();
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = users.find((user) => String(user.id) === id);

  if (!selected) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      await handleDeleteUser(String(selected.id));
      removeUser(selected.id);
      toast.success('Usuario eliminado correctamente.');
    } catch {
      toast.error('No se pudo eliminar el usuario.');
    }

    navigate('/users');
  };

  return (
    <DeleteDialog
      title="Eliminar usuario"
      name={selected.fullName}
      isDeleting={isDeleting}
      onCancel={() => navigate(`/users/${selected.id}`)}
      onConfirm={handleConfirm}
    />
  );
}
