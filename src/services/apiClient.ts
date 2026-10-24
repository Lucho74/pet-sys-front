import { TOKEN_KEY } from '../utils/auth';

const API_URL = 'https://localhost:7140/api';

export const apiFetch = (path: string, options: RequestInit = {}): Promise<Response> => {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    if (options.body) {
        headers.set('Content-Type', 'application/json');
    }

    return fetch(`${API_URL}${path}`, { ...options, headers });
};
