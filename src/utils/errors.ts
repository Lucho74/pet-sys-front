import { ApiError } from '../services/apiClient';

export function errorMessage(error: unknown, fallback: string): string {
    return error instanceof ApiError && error.message ? error.message : fallback;
}
