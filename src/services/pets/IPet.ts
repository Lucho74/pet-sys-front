import type { PageQuery } from "../IPaginated";

export interface IPetResponse {
    id: number;
    name: string | null;
    speciesId: number;
    speciesName: string | null;
    breedId: number;
    breedName: string | null;
    birthDate: string | null;
    clientId: number;
    isSuspended: boolean;
}

export interface IPetRequest {
    name: string | null;
    breedId: number;
    birthDate: string | null;
    clientId: number;
}

export interface PetQuery extends PageQuery {
    speciesId?: number;
    breedId?: number;
}
