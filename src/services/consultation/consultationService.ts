import type { IConsultationResponse, ICreateConsultationRequest, IUpdateConsultationRequest } from "./IConsultation";
import { apiFetch } from "../apiClient";

export const handleAddConsultation = async (newConsultation: ICreateConsultationRequest): Promise<IConsultationResponse> => {
    const response = await apiFetch('/Consultation', {
        method: 'POST',
        body: JSON.stringify(newConsultation)
    });

    return response.json();
};

export const handleDeleteConsultation = async (id: string): Promise<string> => {
    const response = await apiFetch(`/Consultation/${id}`, { 
        method: 'DELETE' 
    });

    return response.text();
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

export const handleGetAllConsultations = async (): Promise<IConsultationResponse[]> => {
    const response = await apiFetch('/Consultation');

    return response.json();
};

export const handleGetConsultationsByPet = async (petId: number): Promise<IConsultationResponse[]> => {
    const response = await apiFetch(`/Consultation/pet/${petId}`);

    return response.json();
};