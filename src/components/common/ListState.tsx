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
        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-[14px] font-medium text-[#27374D] shadow-sm">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#9DB2BF] border-t-[#27374D]" />
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
          className="w-full max-w-[460px] rounded-2xl border border-[#f5c2c7] bg-[#fff5f5] p-4 text-center text-[14px] text-[#7a1d1d] shadow-sm"
        >
          {error}
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex h-full min-h-[220px] items-center justify-center px-2">
        <div className="w-full max-w-[460px] rounded-2xl border border-dashed border-[#9DB2BF] bg-white p-5 text-center text-[14px] text-[#526D82] shadow-sm">
          {emptyLabel}
        </div>
      </div>
    );
  }

  return null;
}
