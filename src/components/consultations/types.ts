import type { StatusConsultation } from "../../services/consultation/IConsultation";

export interface Consultation {
  id: number;
  description: string;
  data: string;
  status: StatusConsultation;
}

export interface ConsultationFormState {
  description: string;
  data: string;
  status: StatusConsultation;
  petId: string;
  veterinarianId: string;
}

export interface ConsultationsOutletContext {
  consultations: Consultation[];
  removeConsultation: (consultationId: number) => void;
}
