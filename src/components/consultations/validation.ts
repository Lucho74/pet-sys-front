import type { ConsultationFormState } from './types';

export type FormErrors = Partial<Record<keyof ConsultationFormState, string>>;

export function validateConsultationForm(form: ConsultationFormState): FormErrors {
  const errors: FormErrors = {};

  const description = form.description.trim();
  if (!description) {
    errors.description = 'La descripción es obligatoria.';
  } else if (description.length > 500) {
    errors.description = 'La descripción no puede superar los 500 caracteres.';
  }

  const data = form.data.trim();
  if (!data) {
    errors.data = 'Los datos son obligatorios.';
  } else if (data.length > 1000) {
    errors.data = 'Los datos no pueden superar los 1000 caracteres.';
  }

  const status = form.status;
  if (!status) {
    errors.status = 'El estado es obligatorio.';
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
