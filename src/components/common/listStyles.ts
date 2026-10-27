export const GRID_CLASSES = 'grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3';

export const WIDE_GRID_CLASSES = 'grid gap-3 lg:grid-cols-2 lg:gap-4 2xl:grid-cols-3';

export const CARD_CLASSES =
  'flex w-full cursor-pointer items-center gap-3.5 rounded-[20px] border border-[#E3E9EE] bg-white px-4 py-3.5 text-left transition-colors hover:border-[#526D82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2 lg:px-5 lg:py-4';

// Cuentas suspendidas y lo que cuelga de ellas: gris, sin sombra, borde punteado.
export const DELETED_CARD_CLASSES =
  'flex w-full cursor-pointer items-center gap-3.5 rounded-[20px] border border-dashed border-[#9DB2BF] bg-white/60 px-4 py-3.5 text-left transition-colors hover:border-[#526D82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2 lg:px-5 lg:py-4';

export const DELETED_BADGE_CLASSES =
  'shrink-0 rounded-full bg-[#DDE6ED] px-2 py-0.5 text-[11px] font-bold text-[#27374D]';

// Lo suspendido va al final; toSorted es estable, así que el resto mantiene el orden de la API.
export const activeFirst = <T extends { isDeleted: boolean }>(items: T[]) =>
  items.toSorted((a, b) => Number(a.isDeleted) - Number(b.isDeleted));

export const READONLY_CARD_CLASSES =
  'flex w-full items-start gap-3 rounded-[20px] border border-[#E3E9EE] bg-white px-4 py-3.5 text-left lg:px-5 lg:py-4';
