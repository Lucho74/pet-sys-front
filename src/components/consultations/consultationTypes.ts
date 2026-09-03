import type { StatusConsultation } from "../../services/consultation/IConsultation";

export const STATUS_LABELS: Record<StatusConsultation, string> = {
  Pending: 'Pendiente',
  Completed: 'Completada',
  Cancelled: 'Cancelada',
};

export const STATUS_BADGE_CLASSES: Record<StatusConsultation, string> = {
  Pending: 'bg-[#DDE6ED] text-[#526D82]',
  Completed: 'bg-[#e6f4ea] text-[#1e7a4b]',
  Cancelled: 'bg-[#fff5f5] text-[#c0392b]',
};

export interface Consultation {
  id: number;
  description: string;
  date: string;
  status: StatusConsultation;
  petId: string;
  petName: string;
  veterinarianId: string;
  veterinarianName: string;
}

export interface ConsultationFormState {
  description: string;
  date: string;
  status: StatusConsultation;
  petId: string;
  veterinarianId: string;
}

export interface ConsultationsOutletContext {
  consultations: Consultation[];
  removeConsultation: (consultationId: number) => void;
}
