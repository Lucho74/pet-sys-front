export const activeFirst = <T extends { isSuspended: boolean }>(items: T[]) =>
  items.toSorted((a, b) => Number(a.isSuspended) - Number(b.isSuspended));
export const TABLE_CARD_CLASSES = 'overflow-hidden rounded-[14px] bg-white shadow-[0_6px_16px_rgba(39,55,77,0.10)]';

export const TABLE_HEADER_ROW_CLASSES = 'bg-[#27374D] hover:bg-[#27374D]';

export const TABLE_HEAD_CLASSES = 'h-12 px-5 text-[13px] font-semibold uppercase tracking-[0.05em] text-[#DDE6ED]';

export const TABLE_ACTION_WIDTH = 72;

export const TABLE_CELL_CLASSES = 'px-5 py-4 whitespace-normal wrap-anywhere';

export const TABLE_ROW_CLASSES = 'text-[15px] border-[#DDE6ED] hover:bg-[#DDE6ED]/50';

export const DETAIL_LIST_LINK_CLASSES =
  'flex-nowrap gap-4 rounded-none border-0 px-5 py-4 no-underline duration-150 [a]:hover:bg-muted/50 focus-visible:ring-0 focus-visible:outline-solid focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring';


export const CREATE_BUTTON_CLASSES = 'h-11 rounded-xl bg-[#526D82] px-5 text-[15px] font-semibold text-white hover:bg-[#27374D] [&_svg]:size-5';

export const CREATE_BAR_CLASSES = 'h-14 w-full rounded-xl bg-[#526D82] text-[16px] text-white hover:bg-[#27374D] font-semibold shadow-[0_6px_16px_rgba(39,55,77,0.35)] [&_svg]:size-5';
