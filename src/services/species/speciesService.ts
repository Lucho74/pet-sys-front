import type { BreedQuery, IBreed, ISpecies } from "./ISpecies";
import { apiFetch } from "../apiClient";
import { fetchAllPages, toQueryString, type IPaginatedResponse, type PageQuery } from "../IPaginated";

export const handleGetSpeciesPage = async (query: PageQuery): Promise<IPaginatedResponse<ISpecies>> => {
    const response = await apiFetch(`/Species?${toQueryString(query)}`);

    return response.json();
};

export const handleGetAllSpecies = (): Promise<ISpecies[]> => fetchAllPages(handleGetSpeciesPage);

export const handleAddSpecies = async (name: string): Promise<ISpecies> => {
    const response = await apiFetch('/Species', {
        method: 'POST',
        body: JSON.stringify({ name })
    });

    return response.json();
};

export const handleUpdateSpecies = async (id: number, name: string): Promise<ISpecies> => {
    const response = await apiFetch(`/Species/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name })
    });

    return response.json();
};

export const handleDeleteSpecies = async (id: number): Promise<void> => {
    await apiFetch(`/Species/${id}`, { method: 'DELETE' });
};

export const handleGetBreedsPage = async (query: BreedQuery): Promise<IPaginatedResponse<IBreed>> => {
    const response = await apiFetch(`/Breed?${toQueryString(query)}`);

    return response.json();
};

export const handleGetBreedsBySpecies = async (speciesId: number): Promise<IBreed[]> => {
    const response = await apiFetch(`/Breed/species/${speciesId}`);

    return response.json();
};

export const handleAddBreed = async (name: string, speciesId: number): Promise<IBreed> => {
    const response = await apiFetch('/Breed', {
        method: 'POST',
        body: JSON.stringify({ name, speciesId })
    });

    return response.json();
};

export const handleUpdateBreed = async (id: number, name: string): Promise<IBreed> => {
    const response = await apiFetch(`/Breed/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name })
    });

    return response.json();
};

export const handleDeleteBreed = async (id: number): Promise<void> => {
    await apiFetch(`/Breed/${id}`, { method: 'DELETE' });
};
