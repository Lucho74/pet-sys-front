import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  handleAddPet,
  handleDeletePet,
  handleGetAllPet,
  handleGetByIdPet,
  handleUpdatePet,
} from '../../services/pets/petService';
import type { IPetRequest, IPetResponse } from '../../services/pets/IPet';
import type { Pet, PetFormState } from './types';
import { validatePetForm } from './validation';
import type { FormErrors } from './validation';

const emptyForm = (): PetFormState => ({
  name: '',
  specie: '',
  breed: '',
  birthDate: '',
  clientId: '',
});

const toPet = (petFromApi: IPetResponse): Pet => ({
  id: Number(petFromApi.id),
  name: petFromApi.name?.trim() || 'Sin nombre',
  specie: petFromApi.specie?.trim() || '',
  breed: petFromApi.breed?.trim() || '',
  birthDate: petFromApi.birthDate?.slice(0, 10) || '',
  clientId: Number(petFromApi.clientId) || 0,
});

const toRequest = (form: PetFormState): IPetRequest => ({
  name: form.name,
  specie: form.specie,
  breed: form.breed,
  birthDate: form.birthDate,
  clientId: Number(form.clientId),
});

export function usePetsCrud() {
  const navigate = useNavigate();
  const location = useLocation();

  const [pets, setPets] = useState<Pet[]>([]);
  const [form, setForm] = useState<PetFormState>(emptyForm());
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [loadError, setLoadError] = useState('');
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [isLoadingPet, setIsLoadingPet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const selectedId = pathParts[0] === 'pets' && pathParts[1] && !Number.isNaN(Number(pathParts[1]))
    ? Number(pathParts[1])
    : null;

  const screen: 'list' | 'create' | 'edit' =
    pathParts[0] === 'pets' && pathParts[1] === 'new'
      ? 'create'
      : pathParts[0] === 'pets' && pathParts[2] === 'edit'
        ? 'edit'
        : 'list';

  const selectedPet = pets.find((pet) => pet.id === selectedId) ?? null;
  const isListScreen = screen === 'list';
  const isFormScreen = screen === 'create' || screen === 'edit';
  const showSheet = pathParts[0] === 'pets' && pathParts[1] && !Number.isNaN(Number(pathParts[1])) && pathParts.length === 2;
  const showDeleteConfirm = pathParts[0] === 'pets' && pathParts[1] && !Number.isNaN(Number(pathParts[1])) && pathParts[2] === 'delete';

  useEffect(() => {
    let isMounted = true;

    const loadPets = async () => {
      setIsLoadingPets(true);
      setLoadError('');

      try {
        const response = await handleGetAllPet();
        if (!isMounted) return;
        setPets(response.map(toPet));
      } catch {
        if (!isMounted) return;
        setPets([]);
        setLoadError('No se pudo cargar la lista de mascotas. Intenta nuevamente.');
        toast.error('No se pudo cargar la lista de mascotas.');
      } finally {
        if (isMounted) {
          setIsLoadingPets(false);
        }
      }
    };

    loadPets();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (screen !== 'edit' || selectedId === null) return;

    let isMounted = true;

    const loadOnePet = async () => {
      setIsLoadingPet(true);
      setError('');

      try {
        const petFromApi = await handleGetByIdPet(String(selectedId));
        if (!isMounted) return;

        const pet = toPet(petFromApi);
        setForm({
          name: pet.name,
          specie: pet.specie,
          breed: pet.breed,
          birthDate: pet.birthDate,
          clientId: String(pet.clientId),
        });
      } catch {
        if (!isMounted) return;
        setError('No se pudo cargar la mascota.');
        toast.error('No se pudo cargar la mascota.');
      } finally {
        if (isMounted) {
          setIsLoadingPet(false);
        }
      }
    };

    loadOnePet();

    return () => {
      isMounted = false;
    };
  }, [screen, selectedId]);

  const setField = (field: keyof PetFormState) => (value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFieldErrors((current) => {
      if (!(field in current)) return current;
      const rest = { ...current };
      delete rest[field];
      return rest;
    });
  };

  const resetForm = () => {
    setForm(emptyForm());
    setError('');
    setFieldErrors({});
  };

  const openCreate = () => {
    resetForm();
    navigate('/pets/new');
  };

  const openEditSelected = () => {
    if (!selectedPet) return;

    setForm({
      name: selectedPet.name,
      specie: selectedPet.specie,
      breed: selectedPet.breed,
      birthDate: selectedPet.birthDate,
      clientId: String(selectedPet.clientId),
    });
    setError('');
    setFieldErrors({});
    navigate(`/pets/${selectedPet.id}/edit`);
  };

  const cancelForm = () => {
    setError('');
    setFieldErrors({});
    navigate('/pets');
  };

  const goToPets = () => navigate('/pets');
  const goToPet = (petId: number) => navigate(`/pets/${petId}`);

  const savePet = async () => {
    const errors = validatePetForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('');
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (screen === 'edit' && selectedId !== null) {
        const updated = await handleUpdatePet(String(selectedId), toRequest(form));
        setPets((current) => current.map((pet) => (pet.id === selectedId ? toPet(updated) : pet)));
        toast.success('Mascota actualizada correctamente.');
        navigate('/pets');
        return;
      }

      const created = await handleAddPet(toRequest(form));
      setPets((current) => [...current, toPet(created)]);
      toast.success('Mascota creada correctamente.');
      navigate('/pets');
    } catch {
      setError('No se pudo guardar la mascota.');
      toast.error('No se pudo guardar la mascota.');
    } finally {
      setIsSaving(false);
    }
  };

  const requestDelete = () => {
    if (selectedId === null) return;
    navigate(`/pets/${selectedId}/delete`);
  };

  const cancelDelete = () => {
    if (selectedId === null) {
      navigate('/pets');
      return;
    }

    navigate(`/pets/${selectedId}`);
  };

  const confirmDelete = async () => {
    if (selectedId === null) {
      navigate('/pets');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await handleDeletePet(String(selectedId));
      setPets((current) => current.filter((pet) => pet.id !== selectedId));
      toast.success('Mascota eliminada correctamente.');
      navigate('/pets');
    } catch {
      setError('No se pudo eliminar la mascota.');
      toast.error('No se pudo eliminar la mascota.');
      navigate('/pets');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    pets,
    form,
    formError: error,
    fieldErrors,
    loadError,
    isLoadingPets,
    isLoadingPet,
    isSaving,
    isDeleting,
    screen,
    selected: selectedPet,
    showSheet,
    showDeleteConfirm,
    isListScreen,
    isFormScreen,
    openCreate,
    openEditSelected,
    cancelForm,
    setField,
    savePet,
    requestDelete,
    cancelDelete,
    confirmDelete,
    goToPets,
    goToPet,
  };
}
