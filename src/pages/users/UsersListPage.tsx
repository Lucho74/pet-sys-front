import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { List } from '../../components/users/List';
import { handleGetAllUser } from '../../services/users/userService';
import type { User } from '../../components/users/types';

export function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    handleGetAllUser()
      .then((response) =>
        setUsers(
          response.map((user) => ({
            id: user.id,
            fullName: user.fullName?.trim() || 'Sin nombre',
            email: user.email?.trim() || '',
            phone: user.phone?.trim() || '',
            roleName:
              user.roleName === 'Admin' || user.roleName === 'Veterinarian' ? user.roleName : 'Client',
            dni: user.dni?.trim() || '',
          })),
        ),
      )
      .catch(() => {
        setError('No se pudo cargar la lista de usuarios. Intenta nuevamente.');
        toast.error('No se pudo cargar la lista de usuarios.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const removeUser = (userId: number) => {
    setUsers((current) => current.filter((user) => user.id !== userId));
  };

  return (
    <ScreenShell eyebrow="Sysadmin" title="Usuarios" icon={UserIcon} homeTo="/">
      <List
        users={users}
        isLoading={isLoading}
        error={error}
        createTo="/users/new"
        itemTo={(userId) => `/users/${userId}`}
      />

      <Outlet context={{ users, removeUser }} />
    </ScreenShell>
  );
}
