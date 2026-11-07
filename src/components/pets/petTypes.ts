import type { IPetResponse } from '../../services/pets/IPet';

export interface Pet {
  id: number;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  clientId: number;
  isSuspended: boolean;
}

export interface PetFormState {
  name: string;
  speciesId: string;
  breedId: string;
  birthDate: string;
  clientId: string;
}

export const toPet = (pet: IPetResponse): Pet => ({
  id: pet.id,
  name: pet.name?.trim() || 'Sin nombre',
  species: pet.speciesName || '',
  breed: pet.breedName || '',
  birthDate: pet.birthDate?.slice(0, 10) || '',
  clientId: pet.clientId,
  isSuspended: pet.isSuspended,
});
