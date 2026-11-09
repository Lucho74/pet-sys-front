import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { PetForm } from '../../components/pets/PetForm';
import type { PetPhotoChange } from '../../components/pets/PetPhotoField';
import { handleAddPet, handleUpdatePetImage } from '../../services/pets/petService';
import type { PetFormState } from '../../components/pets/petTypes';
import { validatePetForm } from '../../components/pets/petValidation';
import type { FormErrors } from '../../components/pets/petValidation';
import { errorMessage } from '../../utils/errors';

export function PetCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<PetFormState>({
    name: '',
    speciesId: '',
    breedId: '',
    birthDate: '',
    clientId: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [photoChange, setPhotoChange] = useState<PetPhotoChange>(null);

  const handleChange = (field: keyof PetFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSave = async () => {
    if (isSaving) return;

    const errors = validatePetForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }

    setIsSaving(true);
    setFormError('');
    let petId: string;

    try {
      const pet = await handleAddPet({
        name: form.name,
        breedId: Number(form.breedId),
        birthDate: form.birthDate,
        clientId: Number(form.clientId),
      });
      petId = String(pet.id);
    } catch (error) {
      const message = errorMessage(error, 'No se pudo guardar la mascota.');
      setFormError(message);
      toast.error(message);
      setIsSaving(false);
      return;
    }

    if (photoChange?.kind === 'replace') {
      try {
        await handleUpdatePetImage(petId, photoChange.file);
      } catch {
        toast.warn('La mascota se creó, pero no se pudo subir la foto. Volvé a elegirla y guardá los cambios.');
        navigate(`/pets/${petId}/edit`, { replace: true });
        return;
      }
    }

    toast.success('Mascota creada correctamente.');
    navigate('/pets');
  };

  return (
    <ScreenShell title="Nueva mascota" backTo="/pets">
      <PetForm
        photoChange={photoChange}
        onPhotoChange={setPhotoChange}
        form={form}
        formError={formError}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        onChange={handleChange}
        onCancel={() => navigate('/pets')}
        onSave={handleSave}
        saveLabel="Crear mascota"
      />
    </ScreenShell>
  );
}
