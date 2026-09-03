import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../components/common/DeleteDialog';
import { handleDeletePet } from '../../services/pets/petService';
import type { PetsOutletContext } from '../../components/pets/petTypes';

export function PetDeletePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets, removePet } = useOutletContext<PetsOutletContext>();
  const [isDeleting, setIsDeleting] = useState(false);

  const selected = pets.find((pet) => String(pet.id) === id);

  if (!selected) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);

    try {
      await handleDeletePet(String(selected.id));
      removePet(selected.id);
      toast.success('Mascota eliminada correctamente.');
    } catch {
      toast.error('No se pudo eliminar la mascota.');
    }

    navigate('/pets');
  };

  return (
    <DeleteDialog
      title="Eliminar mascota"
      name={selected.name}
      isDeleting={isDeleting}
      onCancel={() => navigate(`/pets/${selected.id}`)}
      onConfirm={handleConfirm}
    />
  );
}
