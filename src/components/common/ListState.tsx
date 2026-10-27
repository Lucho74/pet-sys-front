import { PawPrint } from 'lucide-react';
import { SECONDARY_BUTTON_CLASSES } from './buttonStyles';

interface ListStateProps {
  isLoading: boolean;
  error: string;
  isEmpty: boolean;
  loadingLabel: string;
  emptyLabel: string;
}

export function ListState({ isLoading, error, isEmpty, loadingLabel, emptyLabel }: ListStateProps) {
  if (isLoading) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center" role="status" aria-live="polite">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-[15px] font-bold text-[#27374D] shadow-[0_1px_2px_rgba(39,55,77,0.06)]">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#DDE6ED] border-t-[#536FBA]" />
          {loadingLabel}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center px-2">
        <div
          role="alert"
          className="w-full max-w-[460px] rounded-[24px] border border-[#f5c2c7] bg-[#fff5f5] p-6 text-center text-[15px] text-[#7a1d1d]"
        >
          <p>{error}</p>
          {/* Recargar evita un refetch propio en cada página de lista. */}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className={`mt-4 ${SECONDARY_BUTTON_CLASSES}`}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center px-2">
        <div className="flex w-full max-w-[460px] flex-col items-center gap-3 rounded-[24px] border-2 border-dashed border-[#9DB2BF] bg-white p-7 text-center text-[15px] text-[#526D82]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EDF7]">
            <PawPrint size={22} strokeWidth={2.2} className="text-[#27374D]" aria-hidden="true" />
          </div>
          {emptyLabel}
        </div>
      </div>
    );
  }

  return null;
}
