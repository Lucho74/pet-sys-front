import { useEffect, useState } from 'react';
import { User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import { EMPTY_PAGINATION, PAGE_SIZE, type Pagination } from '../../services/IPaginated';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { CreateButton } from '../../components/common/CreateButton';
import { UserList } from '../../components/users/UserList';
import { handleGetUsersPage } from '../../services/users/userService';
import type { User } from '../../components/users/userTypes';
import { useAuth } from '../../contexts/AuthenticationContext';
import { canManage } from '../../utils/roles';
import { handleDeleteUser, handleReactivateUser } from '../../services/users/userService';
import { errorMessage } from '../../utils/errors';

const CREATE_TO = '/users/new';
const CREATE_LABEL = 'Nuevo usuario';

export function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const { role } = useAuth();

  useEffect(() => {
    handleGetUsersPage(page, pageSize)
      .then((response) => {
        setPagination(response);
        setUsers(
          response.items.map((user) => ({
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
        );
      })
      .catch(() => {
        setError('No se pudo cargar la lista de usuarios. Intenta nuevamente.');
        toast.error('No se pudo cargar la lista de usuarios.');
      })
      .finally(() => setIsLoading(false));
  }, [page, pageSize]);

  const setUserDeleted = (userId: number, isDeleted: boolean) => {
    setUsers((current) => current.map((user) => (user.id === userId ? { ...user, isDeleted } : user)));
  };

  const handleSuspend = async (user: User) => {
    try {
      await handleDeleteUser(String(user.id));
      setUserDeleted(user.id, true);
      toast.success('Usuario suspendido correctamente.');
    } catch (error) {
      toast.error(errorMessage(error, 'No se pudo suspender el usuario.'));
    }
  };

  const handleReactivate = async (user: User) => {
    try {
      await handleReactivateUser(String(user.id));
      setUserDeleted(user.id, false);
      toast.success('Usuario reactivado correctamente.');
    } catch (error) {
      toast.error(errorMessage(error, 'No se pudo reactivar el usuario.'));
    }
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
        canManageUser={(user) => canManage(role, user.roleName)}
        onSuspend={handleSuspend}
        onReactivate={handleReactivate}
        pagination={pagination}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />
    </ScreenShell>
  );
}
