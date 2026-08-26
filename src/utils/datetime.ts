const pad = (value: number) => String(value).padStart(2, '0');

/** Fecha local de hoy en formato YYYY-MM-DD, para usar como mínimo de un input date. */
export function todayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** El backend devuelve DateTime.MinValue (0001-01-01) cuando la consulta no tiene fecha cargada. */
export function hasDateTime(value: string | null): value is string {
  return Boolean(value) && !value!.startsWith('0001-01-01');
}

/** Toma el date-time del backend y devuelve el valor para un input date (YYYY-MM-DD). */
export function toInputDate(value: string | null): string {
  if (!value) return '';
  return value.split('T')[0].slice(0, 10);
}

/** Arma el date-time que espera el backend a partir del valor de un input date. */
export function toApiDate(date: string): string {
  if (!date) return '';
  return `${date}T00:00:00`;
}

/** Formato legible (DD/MM/AAAA) para mostrar en listados y detalles. */
export function formatDate(value: string): string {
  const date = toInputDate(value);
  if (!date) return value;

  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
