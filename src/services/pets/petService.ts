import { type PetQuery, type IPetRequest, type IPetResponse } from "./IPet"
import { apiFetch } from "../apiClient";
import { fetchAllPages, toQueryString, type IPaginatedResponse } from "../IPaginated";

export const handleAddPet = async (newPet: IPetRequest): Promise<IPetResponse> => {
    const response = await apiFetch('/Pet', {
        method: 'POST',
        body: JSON.stringify(newPet)
    });

    return response.json();
};

export const handleUpdatePet = async (id: string, updatedPet: IPetRequest): Promise<IPetResponse> => {
    const response = await apiFetch(`/Pet/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedPet)
    });

    return response.json();
};

export const handleGetByIdPet = async (id: string): Promise<IPetResponse> => {
    const response = await apiFetch(`/Pet/${id}`);

    return response.json();
};

export const handleGetPetsPage = async (query: PetQuery): Promise<IPaginatedResponse<IPetResponse>> => {
    const response = await apiFetch(`/Pet?${toQueryString(query)}`);

    return response.json();
};

export const handleGetAllPet = (): Promise<IPetResponse[]> => fetchAllPages(handleGetPetsPage);

export const handleGetMyPets = async (): Promise<IPetResponse[]> => {
    const response = await apiFetch('/Pet/me');

    return response.json();
};
