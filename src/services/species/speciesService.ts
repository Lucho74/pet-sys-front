import type { BreedQuery, IBreed, ISpecies } from "./ISpecies";
import { apiFetch } from "../apiClient";
import { DEFAULT_QUERY, toQueryString, type IPaginatedResponse, type PageQuery } from "../IPaginated";

const SPECIES_PAGE_SIZE = 50;

let speciesCache: Promise<ISpecies[]> | undefined;
const breedsCache = new Map<number, Promise<IBreed[]>>();

export const handleGetSpeciesPage = async (query: PageQuery): Promise<IPaginatedResponse<ISpecies>> => {
    const response = await apiFetch(`/Species?${toQueryString(query)}`);

    return response.json();
};

export const handleGetAllSpecies = (): Promise<ISpecies[]> => {
    if (speciesCache) return speciesCache;

    const request = (async () => {
        const species: ISpecies[] = [];

        for (let pageIndex = 1; ; pageIndex++) {
            const page = await handleGetSpeciesPage({ ...DEFAULT_QUERY, pageIndex, pageSize: SPECIES_PAGE_SIZE });
            species.push(...page.items);
            if (!page.hasNextPage) return species;
        }
    })().catch((error) => {
        if (speciesCache === request) speciesCache = undefined;
        throw error;
    });

    speciesCache = request;
    return request;
};

export const handleAddSpecies = async (name: string): Promise<ISpecies> => {
    const response = await apiFetch('/Species', {
        method: 'POST',
        body: JSON.stringify({ name })
    });

    speciesCache = undefined;
    return response.json();
};

export const handleUpdateSpecies = async (id: number, name: string): Promise<ISpecies> => {
    const response = await apiFetch(`/Species/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name })
    });

    speciesCache = undefined;
    return response.json();
};

export const handleDeleteSpecies = async (id: number): Promise<void> => {
    await apiFetch(`/Species/${id}`, { method: 'DELETE' });
    speciesCache = undefined;
    breedsCache.delete(id);
};

export const handleGetBreedsPage = async (query: BreedQuery): Promise<IPaginatedResponse<IBreed>> => {
    const response = await apiFetch(`/Breed?${toQueryString(query)}`);

    return response.json();
};

export const handleGetBreedsBySpecies = (speciesId: number): Promise<IBreed[]> => {
    const cached = breedsCache.get(speciesId);
    if (cached) return cached;

    const request: Promise<IBreed[]> = apiFetch(`/Breed/species/${speciesId}`)
        .then((response) => response.json())
        .catch((error) => {
            if (breedsCache.get(speciesId) === request) breedsCache.delete(speciesId);
            throw error;
        });

    breedsCache.set(speciesId, request);
    return request;
};

export const handleAddBreed = async (name: string, speciesId: number): Promise<IBreed> => {
    const response = await apiFetch('/Breed', {
        method: 'POST',
        body: JSON.stringify({ name, speciesId })
    });

    breedsCache.delete(speciesId);
    return response.json();
};

export const handleUpdateBreed = async (id: number, name: string): Promise<IBreed> => {
    const response = await apiFetch(`/Breed/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name })
    });

    const updated: IBreed = await response.json();
    breedsCache.delete(updated.speciesId);
    return updated;
};

export const handleDeleteBreed = async (id: number, speciesId: number): Promise<void> => {
    await apiFetch(`/Breed/${id}`, { method: 'DELETE' });
    breedsCache.delete(speciesId);
};
