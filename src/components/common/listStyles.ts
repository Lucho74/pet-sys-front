// Lo suspendido va al final; toSorted es estable, así que el resto mantiene el orden de la API.
export const activeFirst = <T extends { isDeleted: boolean }>(items: T[]) =>
  items.toSorted((a, b) => Number(a.isDeleted) - Number(b.isDeleted));
// Tablas de gestión (usuarios, mascotas, consultas).
export const TABLE_CARD_CLASSES = 'overflow-hidden rounded-[14px] bg-white shadow-[0_6px_16px_rgba(39,55,77,0.10)]';

export const TABLE_HEADER_ROW_CLASSES = 'bg-[#27374D] hover:bg-[#27374D]';

export const TABLE_HEAD_CLASSES = 'px-4 text-[12px] font-semibold uppercase tracking-[0.05em] text-[#DDE6ED]';

export const TABLE_ROW_CLASSES = 'border-[#DDE6ED] hover:bg-[#DDE6ED]/50';

