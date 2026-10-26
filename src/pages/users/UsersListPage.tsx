import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { CreateButton } from '../../components/common/CreateButton';
import { UserList } from '../../components/users/UserList';
import { handleGetAllUser } from '../../services/users/userService';
import type { User } from '../../components/users/userTypes';
import { useAuth } from '../../contexts/AuthenticationContext';
import { canManage } from '../../utils/roles';

const CREATE_TO = '/users/new';
const CREATE_LABEL = 'Nuevo usuario';

export function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { role } = useAuth();

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
              user.roleName === 'SysAdmin' || user.roleName === 'Admin' || user.roleName === 'Veterinarian'
                ? user.roleName
                : 'Client',
            dni: user.dni?.trim() || '',
            isDeleted: user.isDeleted,
          })),
        ),
      )
      .catch(() => {
        setError('No se pudo cargar la lista de usuarios. Intenta nuevamente.');
        toast.error('No se pudo cargar la lista de usuarios.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setUserDeleted = (userId: number, isDeleted: boolean) => {
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, isDeleted } : user)));
  };

  return (
    <ScreenShell
      title="Usuarios"
      icon={UserIcon}
      homeTo="/"
      action={<CreateButton to={CREATE_TO} label={CREATE_LABEL} variant="header" />}
    >
      <UserList
        users={users}
        isLoading={isLoading}
        error={error}
        createTo={CREATE_TO}
        createLabel={CREATE_LABEL}
        itemTo={(user) => (canManage(role, user.roleName) ? `/users/${user.id}` : null)}
      />

      <Outlet context={{ users, setUserDeleted }} />
    </ScreenShell>
  );
}
