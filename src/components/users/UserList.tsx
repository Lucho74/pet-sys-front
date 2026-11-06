import type { User } from './userTypes';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListState } from '../common/ListState';
import { UserTable } from './UserTable';
import type { Pagination } from '../../services/IPaginated';
import type { UserQuery } from '../../services/users/IUser';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  canManageUser: (user: User) => boolean;
  onSuspend: (user: User) => void;
  onReactivate: (user: User) => void;
  query: UserQuery;
  onQueryChange: (query: UserQuery) => void;
  pagination: Pagination;
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
  query,
  onQueryChange,
  pagination,
}: UserListProps) {

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {!isLoading && !error ? (
            <UserTable
              users={users}
              canManageUser={canManageUser}
              onSuspend={onSuspend}
              onReactivate={onReactivate}
              query={query}
              onQueryChange={onQueryChange}
              pagination={pagination}
            />
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={false}
              loadingLabel="Cargando usuarios..."
              emptyLabel=""
            />
          )}
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-7 lg:hidden">
        <Button asChild size="lg" className="h-12 w-full shadow-[0_6px_16px_rgba(39,55,77,0.35)]">
          <Link to={createTo}>
            <Plus /> {createLabel}
          </Link>
        </Button>
      </div>
    </>
  );
}
