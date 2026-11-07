export const GRID_CLASSES = 'grid gap-2.5 sm:grid-cols-2 lg:gap-3 xl:grid-cols-3 2xl:grid-cols-4';

export const WIDE_GRID_CLASSES = 'grid gap-2.5 lg:grid-cols-2 lg:gap-3 2xl:grid-cols-3';

export const CARD_CLASSES =
  'flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-white bg-white px-3.5 py-3 text-left shadow-[0_1px_2px_rgba(39,55,77,0.06)] transition-[border-color,box-shadow,transform] hover:border-[#9DB2BF] hover:shadow-[0_6px_16px_rgba(39,55,77,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2 lg:px-4 lg:py-3.5 lg:hover:-translate-y-px';

// Cuentas suspendidas y lo que cuelga de ellas: gris, sin sombra, borde punteado.
export const DELETED_CARD_CLASSES =
  'flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-dashed border-[#9DB2BF] bg-white/50 px-3.5 py-3 text-left transition-colors hover:border-[#526D82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2 lg:px-4 lg:py-3.5';

export const DELETED_BADGE_CLASSES =
  'shrink-0 rounded-full bg-[#9DB2BF] px-2 py-0.5 text-[11px] font-semibold text-[#27374D]';

// Lo suspendido va al final; toSorted es estable, así que el resto mantiene el orden de la API.
export const activeFirst = <T extends { isDeleted: boolean }>(items: T[]) =>
  items.toSorted((a, b) => Number(a.isDeleted) - Number(b.isDeleted));

export const READONLY_CARD_CLASSES =
  'flex w-full items-start gap-3 rounded-[14px] border border-white bg-white px-3.5 py-3 text-left shadow-[0_1px_2px_rgba(39,55,77,0.06)] lg:px-4 lg:py-3.5';