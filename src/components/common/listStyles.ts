export const activeFirst = <T extends { isSuspended: boolean }>(items: T[]) =>
  items.toSorted((a, b) => Number(a.isSuspended) - Number(b.isSuspended));
export const TABLE_CARD_CLASSES = 'overflow-hidden rounded-[14px] bg-white shadow-[0_6px_16px_rgba(39,55,77,0.10)]';

export const TABLE_HEADER_ROW_CLASSES = 'bg-[#27374D] hover:bg-[#27374D]';

export const TABLE_HEAD_CLASSES = 'px-4 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#DDE6ED]';

export const TABLE_ROW_CLASSES = 'border-[#DDE6ED] hover:bg-[#DDE6ED]/50';

