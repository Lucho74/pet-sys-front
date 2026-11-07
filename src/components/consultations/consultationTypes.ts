export interface Consultation {
  id: number;
  description: string;
  date: string;
  petId: string;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
  isDeleted: boolean;
}

export interface ConsultationFormState {
  description: string;
  date: string;
  petId: string;
  veterinarianId: string;
}
