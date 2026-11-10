import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { PetForm } from '../../components/pets/PetForm';
import type { PetPhotoChange } from '../../components/pets/PetPhotoField';
import { ApiError } from '../../services/apiClient';
import { handleDeletePetImage, handleGetByIdPet, handleGetPetImageUrl, handleUpdatePet, handleUpdatePetImage } from '../../services/pets/petService';
import type { PetFormState } from '../../components/pets/petTypes';
import { validatePetForm } from '../../components/pets/petValidation';
import type { FormErrors } from '../../components/pets/petValidation';
import { errorMessage } from '../../utils/errors';

export function PetEditPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { key, state } = useLocation();
  const fromDetail = state?.fromPetDetail === true;
  const returnTo = fromDetail ? `/pets/${id}` : '/pets';

  const returnToOrigin = () => {
    if (fromDetail) {
      if (window.history.state?.key === key) navigate(-1);
      return;
    }

    navigate(returnTo);
  };

  const [form, setForm] = useState<PetFormState>({
    name: '',
    speciesId: '',
    breedId: '',
    birthDate: '',
    clientId: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [loadedId, setLoadedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [photo, setPhoto] = useState<{ petId: string; url?: string; error?: string } | null>(null);
  const [photoChange, setPhotoChange] = useState<PetPhotoChange>(null);
  const [savedForm, setSavedForm] = useState<PetFormState | null>(null);
  const isLoading = loadedId !== id;
  const currentPhoto = photo?.petId === id ? photo : null;

  useEffect(() => {
    let active = true;

    handleGetByIdPet(id)
      .then((pet) => {
        if (!active) return;

        if (pet.isSuspended) {
          toast.error('La mascota está suspendida y no se puede editar.');
          navigate('/pets', { replace: true });
          return;
        }
        setForm({
          name: pet.name?.trim() || '',
          speciesId: String(pet.speciesId),
          breedId: String(pet.breedId),
          birthDate: pet.birthDate?.slice(0, 10) || '',
          clientId: String(pet.clientId),
        });
        setFormError('');
      })
      .catch((error) => {
        if (!active) return;

        const message = errorMessage(error, 'No se pudo cargar la mascota.');
        setForm({
          name: '',
          speciesId: '',
          breedId: '',
          birthDate: '',
          clientId: '',
        });
        setFormError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!active) return;

        setFieldErrors({});
        setPhotoChange(null);
        setSavedForm(null);
        setLoadedId(id);
      });

    return () => {
      active = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    if (loadedId !== id) return;

    const controller = new AbortController();
    const { signal } = controller;

    handleGetPetImageUrl(id, signal)
      .then((url) => {
        if (!signal.aborted) setPhoto({ petId: id, url });
      })
      .catch((error) => {
        if (signal.aborted) return;

        const message = error instanceof ApiError && error.status === 404 ? '' : 'No se pudo mostrar la foto.';
        setPhoto({ petId: id, error: message });
      });

    return () => controller.abort();
  }, [id, loadedId]);

  const handleChange = (field: keyof PetFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSave = async () => {
    if (isLoading || isSaving) return;

    const errors = validatePetForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      if (savedForm !== form) {
        await handleUpdatePet(id, {
          name: form.name,
          breedId: Number(form.breedId),
          birthDate: form.birthDate,
          clientId: Number(form.clientId),
        });
        setSavedForm(form);
      }
    } catch (error) {
      const message = errorMessage(error, 'No se pudo guardar la mascota.');
      setFormError(message);
      toast.error(message);
      setIsSaving(false);
      return;
    }

    try {
      if (photoChange?.kind === 'replace') {
        await handleUpdatePetImage(id, photoChange.file);
      } else if (photoChange?.kind === 'remove') {
        await handleDeletePetImage(id);
      }

      toast.success('Mascota actualizada correctamente.');
      returnToOrigin();
    } catch {
      const message = 'Los datos se guardaron, pero no se pudo guardar el cambio de foto. Volvé a guardar para reintentar.';
      setFormError(message);
      toast.error(message);
      setIsSaving(false);
    }
  };

  return (
    <ScreenShell title="Editar mascota" backTo={returnTo}>
      <PetForm
        photoUrl={currentPhoto?.url}
        photoChange={photoChange}
        isLoadingPhoto={currentPhoto === null}
        photoError={currentPhoto?.error}
        onPhotoChange={setPhotoChange}
        form={form}
        formError={formError}
        fieldErrors={fieldErrors}
        isLoading={isLoading}
        isSaving={isSaving}
        onChange={handleChange}
        onCancel={returnToOrigin}
        onSave={handleSave}
        saveLabel="Guardar cambios"
      />
    </ScreenShell>
  );
}
