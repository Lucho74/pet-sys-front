import type { User } from './types';
import { initials } from '../../utils/initials';

interface ListProps {
  users: User[];
  isLoading: boolean;
  error: string;
  onSelect: (userId: number) => void;
  onCreate: () => void;
}

export function List({ users, isLoading, error, onSelect, onCreate }: ListProps) {
  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4">
        {isLoading ? (
          <div className="flex h-full min-h-[220px] items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[14px] font-medium text-[#27374D] shadow-sm">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#9DB2BF] border-t-[#27374D]" />
              Cargando usuarios...
            </div>
          </div>
        ) : error ? (
          <div className="flex h-full min-h-[220px] items-center justify-center px-2">
            <div className="w-full rounded-2xl border border-[#f5c2c7] bg-[#fff5f5] p-4 text-center text-[14px] text-[#7a1d1d] shadow-sm">
              {error}
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-full min-h-[220px] items-center justify-center px-2">
            <div className="w-full rounded-2xl border border-dashed border-[#9DB2BF] bg-white p-5 text-center text-[14px] text-[#526D82] shadow-sm">
              No hay usuarios cargados.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => onSelect(user.id)}
                className="flex cursor-pointer items-center gap-3 rounded-[14px] border border-white bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(39,55,77,0.06)]"
              >
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[11px] bg-[#27374D]">
                  <span className="text-[15px] font-semibold text-white">{initials(user.fullName)}</span>
                </div>

                <div className="min-w-0 flex-1 text-left">
                  <div className="truncate text-[15px] font-semibold text-[#27374D]">{user.fullName}</div>
                  <div className="truncate text-[13px] text-[#526D82]">{user.email}</div>
                  {user.phone ? <div className="truncate text-[12px] text-[#526D82]">{user.phone}</div> : null}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-x-4 bottom-7">
        <button
          type="button"
          onClick={onCreate}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] bg-[#27374D] px-4 py-[15px] shadow-[0_6px_16px_rgba(39,55,77,0.35)]"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#DDE6ED" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span className="text-[15px] font-semibold text-[#DDE6ED]">Nuevo usuario</span>
        </button>
      </div>
    </>
  );
}
