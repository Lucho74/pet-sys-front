import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Form } from '../../components/pets/Form';
import { handleAddPet } from '../../services/pets/petService';
import { handleGetAllUser } from '../../services/users/userService';
import type { IUserResponse } from '../../services/users/IUser';
import type { PetFormState } from '../../components/pets/types';
import { validatePetForm } from '../../components/pets/validation';
import type { FormErrors } from '../../components/pets/validation';

export function PetCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<PetFormState>({
    name: '',
    specie: '',
    breed: '',
    birthDate: '',
    clientId: '',
  });
  const [owners, setOwners] = useState<IUserResponse[]>([]);
  const [isLoadingOwners, setIsLoadingOwners] = useState(true);
  const [ownersError, setOwnersError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    handleGetAllUser()
      .then((response) => setOwners(response.filter((user) => user.roleName === 'Client')))
      .catch(() => setOwnersError('No se pudo cargar la lista de clientes.'))
      .finally(() => setIsLoadingOwners(false));
  }, []);

  const handleChange = (field: keyof PetFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSave = async () => {
    const errors = validatePetForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      await handleAddPet({
        name: form.name,
        specie: form.specie,
        breed: form.breed,
        birthDate: form.birthDate,
        clientId: Number(form.clientId),
      });

      toast.success('Mascota creada correctamente.');
      navigate('/pets');
    } catch {
      setFormError('No se pudo guardar la mascota.');
      toast.error('No se pudo guardar la mascota.');
      setIsSaving(false);
    }
  };

  return (
    <ScreenShell eyebrow="Nueva" title="Nueva mascota" backTo="/pets">
      <Form
        form={form}
        formError={formError}
        fieldErrors={fieldErrors}
        owners={owners}
        isLoadingOwners={isLoadingOwners}
        ownersError={ownersError}
        isSaving={isSaving}
        onChange={handleChange}
        onCancel={() => navigate('/pets')}
        onSave={handleSave}
        saveLabel="Crear mascota"
      />
    </ScreenShell>
  );
}
