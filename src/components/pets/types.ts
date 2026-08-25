export interface Pet {
  id: number;
  name: string;
  specie: string;
  breed: string;
  birthDate: string;
}

export interface PetFormState {
  name: string;
  specie: string;
  breed: string;
  birthDate: string;
  clientId: string;
}

export interface PetsOutletContext {
  pets: Pet[];
  removePet: (petId: number) => void;
}
