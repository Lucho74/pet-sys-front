import type { PetFormState } from './petTypes';

export type FormErrors = Partial<Record<keyof PetFormState, string>>;

export function validatePetForm(form: PetFormState): FormErrors {
  const errors: FormErrors = {};

  const name = form.name.trim();
  if (!name) {
    errors.name = 'El nombre es obligatorio.';
  } else if (name.length > 50) {
    errors.name = 'El nombre no puede superar los 50 caracteres.';
  }

  const specie = form.specie.trim();
  if (!specie) {
    errors.specie = 'La especie es obligatoria.';
  } else if (specie.length > 50) {
    errors.specie = 'La especie no puede superar los 50 caracteres.';
  }

  const breed = form.breed.trim();
  if (!breed) {
    errors.breed = 'La raza es obligatoria.';
  } else if (breed.length > 50) {
    errors.breed = 'La raza no puede superar los 50 caracteres.';
  }

  if (!form.birthDate) {
    errors.birthDate = 'La fecha de nacimiento es obligatoria.';
  } else {
    const birthDate = new Date(form.birthDate);

    if (Number.isNaN(birthDate.getTime())) {
      errors.birthDate = 'La fecha de nacimiento no es válida.';
    } else if (birthDate > new Date()) {
      errors.birthDate = 'La fecha de nacimiento no puede ser futura.';
    }
  }

  const clientId = Number(form.clientId);
  if (!form.clientId.trim() || !Number.isInteger(clientId) || clientId < 1) {
    errors.clientId = 'Busca el DNI y selecciona el dueño de la lista.';
  }

  return errors;
}
