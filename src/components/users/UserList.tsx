import { Link } from 'react-router-dom';
import type { User } from './userTypes';
import { ROLE_LABELS } from './userTypes';
import { initials } from '../../utils/initials';
import { CreateButton } from '../common/CreateButton';
import { ListState } from '../common/ListState';
import { activeFirst, CARD_CLASSES, DELETED_BADGE_CLASSES, DELETED_CARD_CLASSES, GRID_CLASSES } from '../common/listStyles';

interface UserListProps {
  users: User[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  itemTo: (user: User) => string | null;
  emptyLabel?: string;
}

export function UserList({ users, isLoading, error, createTo, createLabel, itemTo, emptyLabel = 'No hay usuarios cargados.' }: UserListProps) {
  const hasUsers = !isLoading && !error && users.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasUsers ? (
            <ul className={GRID_CLASSES}>
              {activeFirst(users).map((user) => {
                const to = itemTo(user);
                const className = user.isDeleted ? DELETED_CARD_CLASSES : CARD_CLASSES;
                const content = (
                  <>
                    <div className={`flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] ${user.isDeleted ? 'bg-[#9DB2BF]' : 'bg-[#27374D]'}`}>
                      <span className={`text-[15px] font-semibold ${user.isDeleted ? 'text-[#27374D]' : 'text-white'}`}>{initials(user.fullName)}</span>
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className={`truncate text-[15px] font-semibold ${user.isDeleted ? 'text-[#526D82]' : 'text-[#27374D]'}`}>{user.fullName}</span>
                        <span className="shrink-0 rounded-full bg-[#DDE6ED] px-2 py-0.5 text-[11px] font-semibold text-[#27374D]">
                          {ROLE_LABELS[user.roleName]}
                        </span>
                        {user.isDeleted ? <span className={DELETED_BADGE_CLASSES}>Suspendido</span> : null}
                      </div>
                      <div className="truncate text-[13px] text-[#526D82]">{user.email}</div>
                      {user.dni ? (
                        <div className="truncate text-[12px] text-[#526D82]">DNI {user.dni}</div>
                      ) : user.phone ? (
                        <div className="truncate text-[12px] text-[#526D82]">{user.phone}</div>
                      ) : null}
                    </div>
                  </>
                );

                // Sin destino la fila es solo lectura: un div no recibe foco y pointer-events-none apaga el hover de la tarjeta.
                return (
                  <li key={user.id} className="flex">
                    {to ? (
                      <Link to={to} className={className}>{content}</Link>
                    ) : (
                      <div className={`${className} pointer-events-none`}>{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={users.length === 0}
              loadingLabel="Cargando usuarios..."
              emptyLabel={emptyLabel}
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
