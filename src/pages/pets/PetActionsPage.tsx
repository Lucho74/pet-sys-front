import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ActionSheet } from '../../components/common/ActionSheet';
import type { PetsOutletContext } from '../../components/pets/petTypes';

export function PetActionsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pets } = useOutletContext<PetsOutletContext>();

  const selected = pets.find((pet) => String(pet.id) === id);

  if (!selected) return null;

  if (selected.isDeleted) {
    return (
      <ActionSheet
        title={selected.name}
        subtitle="Suspendida junto con su dueño"
        isDeleted
        editLabel="Ver dueño"
        onClose={() => navigate('/pets')}
        onEdit={() => navigate(`/users/${selected.clientId}`)}
      />
    );
  }

  return (
    <ActionSheet
      title={selected.name}
      subtitle={`${selected.specie} · ${selected.breed}`}
      editLabel="Editar mascota"
      deleteLabel="Eliminar mascota"
      extraActions={[
        { label: 'Ver consultas', onClick: () => navigate(`/pets/${selected.id}/consultations`) },
      ]}
      onClose={() => navigate('/pets')}
      onEdit={() => navigate(`/pets/${selected.id}/edit`)}
      onDelete={() => navigate(`/pets/${selected.id}/delete`)}
    />
  );
}
