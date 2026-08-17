import type { User } from './types';
import { initials } from '../../utils/initials';

interface ListProps {
  users: User[];
  onSelect: (userId: number) => void;
  onCreate: () => void;
}

export function List({ users, onSelect, onCreate }: ListProps) {
  return (
    <>
      <div className="flex-1 overflow-auto px-4 pb-[100px] pt-4">
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
