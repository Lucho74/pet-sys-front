import type { PageQuery } from "../IPaginated";

export interface ISpecies {
    id: number;
    name: string;
}

export interface IBreed {
    id: number;
    name: string;
    speciesId: number;
}

export interface BreedQuery extends PageQuery {
    speciesId?: number;
}
