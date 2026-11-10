export interface Consultation {
  id: number;
  title: string;
  date: string;
  petId: string;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
  isSuspended: boolean;
}

export interface ConsultationFormState {
  title: string;
  description: string;
  date: string;
  petId: string;
  veterinarianId: string;
}
