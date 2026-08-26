import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { initials } from '../../utils/initials';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import {
  GHOST_BUTTON_CLASSES,
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from './buttonStyles';

interface ActionSheetProps {
  title: string;
  subtitle: string;
  editLabel: string;
  deleteLabel: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ActionSheet({
  title,
  subtitle,
  editLabel,
  deleteLabel,
  onClose,
  onEdit,
  onDelete,
}: ActionSheetProps) {
  const titleId = useId();
  const editButtonRef = useRef<HTMLButtonElement>(null);

  useEscapeKey(onClose);

  useEffect(() => {
    editButtonRef.current?.focus();
  }, []);

  return (
    <>
      <div onClick={onClose} aria-hidden="true" className="fixed inset-0 z-40 bg-[#27374D]/45" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[22px] bg-[#DDE6ED] px-[18px] pb-[34px] pt-5 shadow-[0_-8px_24px_rgba(39,55,77,0.25)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-3rem)] sm:max-w-[420px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[18px] sm:p-6 sm:shadow-[0_16px_40px_rgba(39,55,77,0.32)]"
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#9DB2BF] sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 hidden h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[#526D82] transition-colors hover:bg-[#27374D]/10 hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] sm:flex"
        >
          <X size={17} strokeWidth={2.5} />
        </button>

        <div className="mb-4 flex items-center gap-3 sm:pr-8">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#27374D]">
            <span className="text-[16px] font-semibold text-white">{initials(title)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div id={titleId} className="truncate text-[15px] font-semibold text-[#27374D]">
              {title}
            </div>
            <div className="truncate text-[13px] text-[#526D82]">{subtitle}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button ref={editButtonRef} type="button" onClick={onEdit} className={`w-full ${PRIMARY_BUTTON_CLASSES}`}>
            {editLabel}
          </button>
          <button type="button" onClick={onDelete} className={`w-full ${SECONDARY_BUTTON_CLASSES}`}>
            {deleteLabel}
          </button>
          <button type="button" onClick={onClose} className={`w-full sm:hidden ${GHOST_BUTTON_CLASSES}`}>
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
