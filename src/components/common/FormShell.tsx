import type { ReactNode } from 'react';
import { PRIMARY_BUTTON_CLASSES, SECONDARY_BUTTON_CLASSES } from './buttonStyles';

interface FormShellProps {
  children: ReactNode;
  formError: string;
  isLoading?: boolean;
  isSaving?: boolean;
  loadingLabel: string;
  onCancel: () => void;
  onSave: () => void;
  saveLabel: string;
}

export function FormShell({
  children,
  formError,
  isLoading = false,
  isSaving = false,
  loadingLabel,
  onCancel,
  onSave,
  saveLabel,
}: FormShellProps) {
  return (
    <div className="flex-1 overflow-auto px-5 pb-8 pt-5 lg:px-10 lg:pb-12 lg:pt-8">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="w-full max-w-[760px] lg:rounded-2xl lg:border lg:border-white lg:bg-white lg:p-8 lg:shadow-[0_1px_2px_rgba(39,55,77,0.06)]"
      >
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center rounded-2xl bg-white px-4 py-6 text-[14px] font-medium text-[#27374D] shadow-sm lg:shadow-none"
          >
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#9DB2BF] border-t-[#27374D]" />
            {loadingLabel}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">{children}</div>
        )}

        {formError ? (
          <div
            role="alert"
            className="mt-4 rounded-[10px] border border-[#9DB2BF] bg-white px-3 py-2.5 text-[13px] text-[#27374D] lg:bg-[#f4f7f9]"
          >
            {formError}
          </div>
        ) : null}

        <div className="mt-6 flex gap-2.5 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className={`flex-1 sm:min-w-[150px] sm:flex-none ${SECONDARY_BUTTON_CLASSES}`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className={`flex-1 sm:min-w-[150px] sm:flex-none ${PRIMARY_BUTTON_CLASSES}`}
          >
            {isSaving ? 'Guardando...' : saveLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
