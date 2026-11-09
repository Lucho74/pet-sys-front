export interface IPaginatedResponse<T> {
  items: T[];
  pageIndex: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type Pagination = Omit<IPaginatedResponse<unknown>, 'items'>;

export const EMPTY_PAGINATION: Pagination = { pageIndex: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false };

export const PAGE_SIZE = 10;

export const PAGE_SIZE_OPTIONS = [10, 20, 50];

export interface PageQuery {
  pageIndex: number;
  pageSize: number;
  search: string;
  includeSuspended: boolean;
  sortBy: string;
  sortDesc: boolean;
}

export const DEFAULT_QUERY: PageQuery = {
  pageIndex: 1,
  pageSize: PAGE_SIZE,
  search: '',
  includeSuspended: true,
  sortBy: '',
  sortDesc: false,
};

export const toQueryString = (query: object) =>
  new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value !== '' && value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  ).toString();
