import { STATUS_LABELS } from './types';
import type { ConsultationFormState } from './types';
import { todayDate } from '../../utils/datetime';

const VALID_STATUSES = Object.keys(STATUS_LABELS);

export type FormErrors = Partial<Record<keyof ConsultationFormState, string>>;

/**
 * `initialDate` es el día que ya tenía la consulta al abrir el formulario.
 * Si no se modifica, no se exige que sea futuro: una consulta pasada se sigue pudiendo editar.
 */
export function validateConsultationForm(
  form: ConsultationFormState,
  initialDate?: string,
): FormErrors {
  const errors: FormErrors = {};

  const description = form.description.trim();
  if (!description) {
    errors.description = 'La descripción es obligatoria.';
  } else if (description.length > 500) {
    errors.description = 'La descripción no puede superar los 500 caracteres.';
  }

  if (!form.date) {
    errors.date = 'El día de la consulta es obligatorio.';
  } else if (form.date !== initialDate && form.date < todayDate()) {
    errors.date = 'No se puede agendar una consulta en el pasado.';
  }

  const status = form.status;
  if (!status) {
    errors.status = 'El estado es obligatorio.';
  } else if (!VALID_STATUSES.includes(status)) {
    errors.status = 'Selecciona un estado válido.';
  }

  const petId = form.petId;
  if (petId === null) {
    errors.petId = 'La mascota es obligatoria.';
  }

  const veterinarianId = form.veterinarianId;
  if (veterinarianId === null) {
    errors.veterinarianId = 'El veterinario es obligatorio.';
  }

  return errors;
}
