export interface Consultation {
  id: number;
  description: string;
  date: string;
  petId: string;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
  // Dueño de la mascota: a donde lleva el action sheet cuando la consulta está suspendida.
  clientId: number | null;
  clientName: string;
  isDeleted: boolean;
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
