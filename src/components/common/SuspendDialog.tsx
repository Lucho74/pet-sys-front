import { useId } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { DANGER_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from './buttonStyles';

interface SuspendDialogProps {
  name: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SuspendDialog({ name, isDeleting = false, onCancel, onConfirm }: SuspendDialogProps) {
  const titleId = useId();
  const descriptionId = `${titleId}-description`;

  useEscapeKey(onCancel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#27374D]/50 p-4 sm:p-7">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-[560px] lg:max-w-[640px] 2xl:max-w-[720px] rounded-[20px] bg-white p-6 shadow-[0_12px_30px_rgba(39,55,77,0.3)] sm:p-8 lg:p-10"
      >
        <h2 id={titleId} className="mb-2 text-[20px] font-extrabold text-[#27374D]">
          Suspender usuario
        </h2>
        <p id={descriptionId} className="mb-6 text-[16px] leading-7 text-[#526D82]">
          ¿Confirmás que querés suspender a <strong className="text-[#27374D]">{name}</strong>? No va a poder iniciar
          sesión, y sus mascotas y consultas quedan suspendidas. Podés reactivarlo después.
        </p>
        <div className="flex gap-2.5 sm:justify-end">
          <button
            autoFocus
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className={`flex-1 sm:min-w-[150px] sm:flex-none ${SECONDARY_BUTTON_CLASSES}`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`flex-1 sm:min-w-[150px] sm:flex-none ${DANGER_BUTTON_CLASSES}`}
          >
            {isDeleting ? 'Suspendiendo...' : 'Suspender'}
          </button>
        </div>
      </div>
    </div>
  );
}
