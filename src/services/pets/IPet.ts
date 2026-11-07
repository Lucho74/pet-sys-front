import type { PageQuery } from "../IPaginated";

export interface IPetResponse {
    id: number;
    name: string | null;
    specie: string | null;
    breed: string | null;
    birthDate: string | null;
    clientId: number;
    isSuspended: boolean;
}

export interface IPetRequest {
    name: string | null;
    specie: string | null;
    breed: string | null;
    birthDate: string | null;
    clientId: number;
}

export interface PetQuery extends PageQuery {
    specie?: string;
    breed?: string;
}
