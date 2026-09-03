import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ActionSheet } from '../../components/common/ActionSheet';
import type { PetsOutletContext } from '../../components/pets/petTypes';

export function PetActionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets } = useOutletContext<PetsOutletContext>();

  const selected = pets.find((pet) => String(pet.id) === id);

  if (!selected) return null;

  return (
    <ActionSheet
      title={selected.name}
      subtitle={`${selected.specie} · ${selected.breed}`}
      editLabel="Editar mascota"
      deleteLabel="Eliminar mascota"
      onClose={() => navigate('/pets')}
      onEdit={() => navigate(`/pets/${selected.id}/edit`)}
      onDelete={() => navigate(`/pets/${selected.id}/delete`)}
    />
  );
}
