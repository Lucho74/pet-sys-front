import { useId } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { initials } from '../../utils/initials';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import {
  DANGER_OUTLINE_BUTTON_CLASSES,
  GHOST_BUTTON_CLASSES,
  PRIMARY_BUTTON_CLASSES,
  SECONDARY_BUTTON_CLASSES,
} from './buttonStyles';
import { DELETED_BADGE_CLASSES } from './listStyles';

interface ActionSheetAction {
  label: string;
  onClick: () => void;
}

interface ActionSheetDetail {
  label: string;
  value: string;
}

interface ActionSheetProps {
  title: string;
  // Por defecto, las iniciales del título en un círculo.
  avatar?: ReactNode;
  subtitle: string;
  details?: ActionSheetDetail[];
  editLabel: string;
  deleteLabel?: string;
  extraActions?: ActionSheetAction[];
  // Pinta el encabezado como la tarjeta suspendida del listado.
  isDeleted?: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete?: () => void;
}

export function ActionSheet({
  title,
  avatar,
  subtitle,
  details = [],
  editLabel,
  deleteLabel,
  extraActions = [],
  isDeleted = false,
  onClose,
  onEdit,
  onDelete,
}: ActionSheetProps) {
  const titleId = useId();

  useEscapeKey(onClose);

  return (
    <>
      <div onClick={onClose} aria-hidden="true" className="fixed inset-0 z-40 bg-[#27374D]/45" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-[20px] bg-white px-5 pb-[max(28px,env(safe-area-inset-bottom))] pt-5 shadow-[0_-8px_24px_rgba(39,55,77,0.25)] sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[calc(100%-3rem)] sm:max-w-[560px] lg:max-w-[640px] 2xl:max-w-[720px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[20px] sm:p-8 lg:p-10 sm:shadow-[0_16px_40px_rgba(39,55,77,0.32)]"
      >
        <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-[#9DB2BF] sm:hidden" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 hidden h-11 w-11 cursor-pointer items-center justify-center rounded-full text-[#526D82] transition-colors hover:bg-[#27374D]/10 hover:text-[#27374D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] sm:flex"
        >
          <X size={19} strokeWidth={2.5} />
        </button>

        <div
          className={`mb-5 flex items-start gap-4 sm:mr-10 ${
            isDeleted ? 'rounded-xl border border-dashed border-[#9DB2BF] bg-white/50 p-3' : ''
          }`}
        >
          {avatar ?? (
            <div
              className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full ${
                isDeleted ? 'bg-[#9DB2BF]' : 'bg-[#27374D]'
              }`}
            >
              <span className={`text-[17px] font-semibold ${isDeleted ? 'text-[#27374D]' : 'text-white'}`}>
                {initials(title)}
              </span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                id={titleId}
                className={`break-words text-[18px] font-extrabold leading-6 ${isDeleted ? 'text-[#526D82]' : 'text-[#27374D]'}`}
              >
                {title}
              </h2>
              {isDeleted ? <span className={DELETED_BADGE_CLASSES}>Suspendido</span> : null}
            </div>
            <p className="mt-1 whitespace-pre-wrap break-words text-[15px] leading-6 text-[#27374D]">{subtitle}</p>
          </div>
        </div>

        {details.length > 0 ? (
          <dl className="mb-5 grid gap-x-4 gap-y-2 rounded-xl bg-[#F4F7F9] p-4 text-[15px] sm:grid-cols-[auto_1fr]">
            {details.map(({ label, value }) => (
              <div key={label} className="contents">
                <dt className="font-bold text-[#27374D]">{label}</dt>
                <dd className="mb-1 break-words text-[#27374D] sm:mb-0">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="flex flex-col gap-2.5">
          <button autoFocus type="button" onClick={onEdit} className={`w-full ${PRIMARY_BUTTON_CLASSES}`}>
            {editLabel}
          </button>
          {extraActions.map((action) => (
            <button key={action.label} type="button" onClick={action.onClick} className={`w-full ${SECONDARY_BUTTON_CLASSES}`}>
              {action.label}
            </button>
          ))}
          {onDelete ? (
            <button type="button" onClick={onDelete} className={`w-full ${DANGER_OUTLINE_BUTTON_CLASSES}`}>
              {deleteLabel}
            </button>
          ) : null}
          <button type="button" onClick={onClose} className={`w-full sm:hidden ${GHOST_BUTTON_CLASSES}`}>
            Cancelar
          </button>
        </div>
      </div>
    </>
  );
}
