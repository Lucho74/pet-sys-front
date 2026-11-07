const pad = (value: number) => String(value).padStart(2, '0');

export function todayDate(): string {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function hasDateTime(value: string | null): value is string {
  return Boolean(value) && !value!.startsWith('0001-01-01');
}

export function toInputDate(value: string | null): string {
  if (!value) return '';
  return value.split('T')[0].slice(0, 10);
}

export function toApiDate(date: string): string {
  if (!date) return '';
  return `${date}T00:00:00`;
}

export function formatDate(value: string): string {
  const date = toInputDate(value);
  if (!date) return value;

  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}
