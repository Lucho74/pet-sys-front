import type { User } from './types';
import { initials } from '../../utils/initials';

interface ActionSheetProps {
  selected: User | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionSheet({ selected, onClose, onEdit, onDelete }: ActionSheetProps) {
  if (!selected) return null;

  return (
    <>
      <div onClick={onClose} className="absolute inset-0 z-40 bg-[#27374D]/45" />
      <div className="absolute inset-x-0 bottom-0 z-41 rounded-t-[22px] bg-[#DDE6ED] px-[18px] pb-[34px] pt-5 shadow-[0_-8px_24px_rgba(39,55,77,0.25)]">
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#9DB2BF]" />
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#27374D]">
            <span className="text-[16px] font-semibold text-white">{initials(selected.fullName)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[15px] font-semibold text-[#27374D]">{selected.fullName}</div>
            <div className="truncate text-[13px] text-[#526D82]">{selected.email}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onEdit}
            className="w-full rounded-xl bg-[#27374D] px-4 py-[14px] text-center text-[15px] font-semibold text-[#DDE6ED]"
          >
            Editar usuario
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-xl border border-[#526D82] px-4 py-[14px] text-center text-[15px] font-semibold text-[#526D82]"
          >
            Eliminar usuario
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-4 py-[14px] text-center text-[14px] text-[#526D82]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
