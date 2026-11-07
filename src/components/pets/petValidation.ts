import type { PetFormState } from './petTypes';
import { todayDate } from '../../utils/datetime';

export type FormErrors = Partial<Record<keyof PetFormState, string>>;

export function validatePetForm(form: PetFormState): FormErrors {
  const errors: FormErrors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  } else if (name.length > 50) {
    errors.name = 'El nombre no puede superar los 50 caracteres.';
  }

  if (!form.speciesId) {
    errors.speciesId = 'La especie es obligatoria.';
  }

  if (!form.breedId) {
    errors.breedId = 'La raza es obligatoria.';
  }

  if (!form.birthDate) {
    errors.birthDate = 'La fecha de nacimiento es obligatoria.';
  } else if (form.birthDate > todayDate()) {
    errors.birthDate = 'La fecha de nacimiento no puede ser futura.';
  }

  const clientId = Number(form.clientId);
  if (!form.clientId.trim() || !Number.isInteger(clientId) || clientId < 1) {
    errors.clientId = 'Busca el DNI y selecciona el dueño de la lista.';
  }

  return errors;
}
