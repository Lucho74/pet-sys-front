import { Link } from 'react-router-dom';
import type { User } from './userTypes';
import { ROLE_LABELS } from './userTypes';
import { initials } from '../../utils/initials';
import { CreateButton } from '../common/CreateButton';
import { ListState } from '../common/ListState';
import { CARD_CLASSES, GRID_CLASSES } from '../common/listStyles';

interface ListProps {
  users: User[];
  isLoading: boolean;
  error: string;
  createTo: string;
  createLabel: string;
  itemTo: (userId: number) => string;
}

export function List({ users, isLoading, error, createTo, createLabel, itemTo }: ListProps) {
  const hasUsers = !isLoading && !error && users.length > 0;

  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
        <div className="flex h-full w-full flex-col">
          {hasUsers ? (
            <ul className={GRID_CLASSES}>
              {users.map((user) => (
                <li key={user.id} className="flex">
                  <Link to={itemTo(user.id)} className={CARD_CLASSES}>
                    <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[#27374D]">
                      <span className="text-[15px] font-semibold text-white">{initials(user.fullName)}</span>
                    </div>

                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[15px] font-semibold text-[#27374D]">{user.fullName}</span>
                        <span className="shrink-0 rounded-full bg-[#DDE6ED] px-2 py-0.5 text-[11px] font-semibold text-[#526D82]">
                          {ROLE_LABELS[user.roleName]}
                        </span>
                      </div>
                      <div className="truncate text-[13px] text-[#526D82]">{user.email}</div>
                      {user.dni ? (
                        <div className="truncate text-[12px] text-[#526D82]">DNI {user.dni}</div>
                      ) : user.phone ? (
                        <div className="truncate text-[12px] text-[#526D82]">{user.phone}</div>
                      ) : null}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <ListState
              isLoading={isLoading}
              error={error}
              isEmpty={users.length === 0}
              loadingLabel="Cargando usuarios..."
              emptyLabel="No hay usuarios cargados."
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
