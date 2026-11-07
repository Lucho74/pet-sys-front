import { TOKEN_KEY } from '../utils/auth';
import { translateApiError } from './apiErrors';

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7140/api';
const LOGIN_PATH = '/Authentication/authenticate';

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export const apiFetch = async (path: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });

    if (response.status === 401 && token && path !== LOGIN_PATH) {
        localStorage.removeItem(TOKEN_KEY);
        window.location.assign('/login');
    }

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const title = body.title ?? '';
        throw new ApiError(response.status, translateApiError(title));
    }

    return response;
};
