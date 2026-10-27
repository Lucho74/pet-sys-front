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
    <div className="flex-1 overflow-auto px-4 pb-8 pt-4 lg:px-10 lg:pb-12 lg:pt-6">
      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          onSave();
        }}
        className="w-full max-w-[760px] rounded-[24px] border border-[#E3E9EE] bg-white p-5 shadow-[0_1px_2px_rgba(39,55,77,0.05)] lg:p-8"
      >
        {isLoading ? (
          <div
            role="status"
            aria-live="polite"
            className="flex items-center justify-center px-4 py-6 text-[15px] font-bold text-[#27374D]"
          >
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#DDE6ED] border-t-[#536FBA]" />
            {loadingLabel}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:gap-6">{children}</div>
        )}

        {formError ? (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-[#f5c2c7] bg-[#fff5f5] px-3.5 py-3 text-[14px] text-[#7a1d1d]"
          >
            {formError}
          </div>
        ) : null}

        <div className="mt-7 flex gap-2.5 border-t border-[#E3E9EE] pt-5 sm:justify-end">
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
