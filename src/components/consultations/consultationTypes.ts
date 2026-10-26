export interface Consultation {
  id: number;
  description: string;
  date: string;
  petId: string;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
}

export interface ConsultationFormState {
  description: string;
  date: string;
  petId: string;
  veterinarianId: string;
}

export interface ConsultationsOutletContext {
  consultations: Consultation[];
  removeConsultation: (consultationId: number) => void;
}
