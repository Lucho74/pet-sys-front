export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function matchesSearch(value: string | null, search: string): boolean {
  if (!value) return false;
  return normalizeText(value).includes(normalizeText(search));
}
