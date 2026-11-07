import type { IConsultationResponse, ICreateConsultationRequest, IUpdateConsultationRequest } from "./IConsultation";
import { apiFetch } from "../apiClient";
import { toQueryString, type IPaginatedResponse, type PageQuery } from "../IPaginated";

export const handleAddConsultation = async (newConsultation: ICreateConsultationRequest): Promise<IConsultationResponse> => {
    const response = await apiFetch('/Consultation', {
        method: 'POST',
        body: JSON.stringify(newConsultation)
    });

    return response.json();
};

export const handleUpdateConsultation = async (id: string, updatedConsultation: IUpdateConsultationRequest): Promise<IConsultationResponse> => {
    const response = await apiFetch(`/Consultation/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedConsultation)
    });

    return response.json();
};

export const handleGetByIdConsultation = async (id: string): Promise<IConsultationResponse> => {
    const response = await apiFetch(`/Consultation/${id}`);

    return response.json();
};

export const handleGetConsultationsPage = async (query: PageQuery): Promise<IPaginatedResponse<IConsultationResponse>> => {
    const response = await apiFetch(`/Consultation?${toQueryString(query)}`);

    return response.json();
};

export const handleGetConsultationsByPet = async (petId: number): Promise<IConsultationResponse[]> => {
    const response = await apiFetch(`/Consultation/pet/${petId}`);

    return response.json();
};