import type { IConsultationResponse, IConsultationWithParticipantsResponse, ICreateConsultationRequest, IUpdateConsultationRequest } from "./IConsultation";
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

export const handleGetByIdConsultation = async (id: string): Promise<IConsultationWithParticipantsResponse> => {
    const response = await apiFetch(`/Consultation/${id}`);

    return response.json();
};

export const handleSuspendConsultation = async (id: number): Promise<void> => {
    await apiFetch(`/Consultation/${id}`, { method: 'DELETE' });
};

export const handleReactivateConsultation = async (id: number): Promise<void> => {
    await apiFetch(`/Consultation/${id}/reactivate`, { method: 'POST' });
};

export const handleGetConsultationAttachmentUrl = async (id: string, blobName: string): Promise<string> => {
    const query = toQueryString({ blobName });
    const response = await apiFetch(`/Consultation/${id}/attachments?${query}`);
    const { url }: { url: string } = await response.json();
    return url;
};

export const handleUploadConsultationAttachment = async (id: string, file: File): Promise<void> => {
    const body = new FormData();
    body.append('file', file);
    await apiFetch(`/Consultation/${id}/attachments`, { method: 'POST', body });
};

export const handleDeleteConsultationAttachment = async (id: string, blobName: string): Promise<void> => {
    const query = toQueryString({ blobName });
    await apiFetch(`/Consultation/${id}/attachments?${query}`, { method: 'DELETE' });
};

export const handleGetConsultationsPage = async (query: PageQuery): Promise<IPaginatedResponse<IConsultationWithParticipantsResponse>> => {
    const response = await apiFetch(`/Consultation?${toQueryString(query)}`);

    return response.json();
};

export const handleGetConsultationsByPet = async (petId: number): Promise<IConsultationResponse[]> => {
    const response = await apiFetch(`/Consultation/pet/${petId}`);

    return response.json();
};

export const handleGetConsultationsByVeterinarian = async (veterinarianId: number): Promise<IConsultationResponse[]> => {
    const response = await apiFetch(`/Consultation/veterinarian/${veterinarianId}`);

    return response.json();
};
