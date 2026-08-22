export interface Pet {
  id: number;
  name: string;
  specie: string;
  breed: string;
  birthDate: string;
  clientId: number;
}

export interface PetFormState {
  name: string;
  specie: string;
  breed: string;
  birthDate: string;
  clientId: string;
}
