import type { User } from './userTypes';
import { CreateButton } from '../common/CreateButton';
import { ListState } from '../common/ListState';
import { UserTable } from './UserTable';
import { activeFirst } from '../common/listStyles';
import type { Pagination } from '../../services/IPaginated';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  canManageUser: (user: User) => boolean;
  onSuspend: (user: User) => void;
  onReactivate: (user: User) => void;
  pagination: Pagination;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
}

export function UserList({
  users,
  isLoading,
  error,
  createTo,
  createLabel,
  canManageUser,
  onSuspend,
  onReactivate,
  pagination,
  onPageChange,
  pageSize,
  onPageSizeChange,
}: UserListProps) {
  const hasUsers = !isLoading && !error && users.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasUsers ? (
            <UserTable
              users={activeFirst(users)}
              canManageUser={canManageUser}
              onSuspend={onSuspend}
              onReactivate={onReactivate}
              pagination={pagination}
              onPageChange={onPageChange}
              pageSize={pageSize}
              onPageSizeChange={onPageSizeChange}
            />
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={users.length === 0}
              loadingLabel="Cargando usuarios..."
              emptyLabel="Todavía no hay usuarios. Creá el primero con «Nuevo usuario»."
            />
          )}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-7 lg:hidden">
        <CreateButton to={createTo} label={createLabel} />
      </div>
    </>
  );
}
