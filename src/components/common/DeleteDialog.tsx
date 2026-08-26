import { useEffect, useId, useRef } from 'react';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from './buttonStyles';

interface DeleteDialogProps {
  title: string;
  name: string;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteDialog({ title, name, isDeleting = false, onCancel, onConfirm }: DeleteDialogProps) {
  const titleId = useId();
  const descriptionId = `${titleId}-description`;
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEscapeKey(onCancel);

  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#27374D]/50 p-7">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="w-full max-w-[420px] rounded-2xl bg-white p-[22px] shadow-[0_12px_30px_rgba(39,55,77,0.3)] sm:p-6"
      >
        <h2 id={titleId} className="mb-1.5 text-[16px] font-bold text-[#27374D]">
          {title}
        </h2>
        <p id={descriptionId} className="mb-5 text-[14px] leading-6 text-[#526D82]">
          ¿Confirmas que deseas eliminar a <strong className="text-[#27374D]">{name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2.5 sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className={`flex-1 sm:min-w-[130px] sm:flex-none ${SECONDARY_BUTTON_CLASSES}`}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className={`flex-1 sm:min-w-[130px] sm:flex-none ${PRIMARY_BUTTON_CLASSES}`}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}
