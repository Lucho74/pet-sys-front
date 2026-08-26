/** Deja el texto comparable: sin mayúsculas ni acentos, para que "José" encuentre a "jose". */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** Busca el texto dentro del valor ignorando mayúsculas y acentos. */
export function matchesSearch(value: string | null, search: string): boolean {
  if (!value) return false;
  return normalizeText(value).includes(normalizeText(search));
}
