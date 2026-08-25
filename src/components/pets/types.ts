export interface Pet {
  id: number;
  name: string;
  specie: string;
  breed: string;
  birthDate: string;
  clientId: number;
}

export interface PetOwner {
  id: number;
  fullName: string;
  email: string;
  dni: string;
}

export interface PetFormState {
  name: string;
  specie: string;
  breed: string;
  birthDate: string;
  clientId: string;
}
