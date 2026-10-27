import { useEffect, useState } from 'react';
import { PawPrint } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { PetList } from '../../components/pets/PetList';
import { handleGetMyPets } from '../../services/pets/petService';
import type { Pet } from '../../components/pets/petTypes';

export function MyPetsPage() {
	const [pets, setPets] = useState<Pet[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		handleGetMyPets()
			.then((response) =>
				setPets(
					response.map((pet) => ({
						id: pet.id,
						name: pet.name?.trim() || 'Sin nombre',
						specie: pet.specie?.trim() || '',
						breed: pet.breed?.trim() || '',
						birthDate: pet.birthDate?.slice(0, 10) || '',
						clientId: pet.clientId,
						isDeleted: pet.isDeleted,
					})),
				),
			)
			.catch(() => {
				setError('No se pudieron cargar tus mascotas. Intenta nuevamente.');
				toast.error('No se pudieron cargar tus mascotas.');
			})
			.finally(() => setIsLoading(false));
	}, []);

	return (
		<ScreenShell
			title="Mis mascotas"
			icon={PawPrint}
			homeTo="/"
		>
			<PetList
				pets={pets}
				isLoading={isLoading}
				error={error}
				itemTo={(petId) => `/my-pets/${petId}/consultations`}
				emptyLabel="Todavía no tenés mascotas registradas. Pedile a la veterinaria que las cargue."
			/>
		</ScreenShell>
	);
}