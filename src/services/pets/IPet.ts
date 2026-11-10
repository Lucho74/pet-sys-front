import type { PageQuery } from "../IPaginated";

export interface IPetResponse {
    id: number;
    name: string;
    speciesId: number;
    speciesName: string;
    breedId: number;
    breedName: string;
    birthDate: string;
    clientId: number;
    isSuspended: boolean;
}

export interface IPetDetailResponse extends IPetResponse {
    clientName: string;
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
