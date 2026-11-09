import type { IDashboardResponse } from "./IDashboard";
import { apiFetch } from "../apiClient";

export const handleGetDashboard = async (): Promise<IDashboardResponse> => {
    const response = await apiFetch('/Dashboard');

    return response.json();
};
