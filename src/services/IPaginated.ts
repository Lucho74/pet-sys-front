// Forma en que el back devuelve los listados paginados (GET api/User, api/Pet, api/Consultation).
export interface IPaginatedResponse<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Lo que la tabla necesita para el pie de paginado: tal cual viene del back, sin los items.
export type Pagination = Omit<IPaginatedResponse<unknown>, 'items'>;

export const EMPTY_PAGINATION: Pagination = { pageIndex: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false };

export const PAGE_SIZE = 10;

// Opciones de "Filas por página" en las tablas.
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

// El back no acepta más de 50 por página.
const MAX_PAGE_SIZE = 50;

/** Pide página por página hasta la última. Solo para los selects de los formularios, que necesitan todo. */
export async function fetchAllPages<T>(
  getPage: (pageIndex: number, pageSize: number) => Promise<IPaginatedResponse<T>>,
): Promise<T[]> {
  const all: T[] = [];
  let pageIndex = 1;
  let page: IPaginatedResponse<T>;

  do {
    page = await getPage(pageIndex, MAX_PAGE_SIZE);
    all.push(...page.items);
    pageIndex++;
  } while (page.hasNextPage);

  return all;
}
