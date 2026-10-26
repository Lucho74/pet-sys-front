import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { useAuth } from '../../contexts/AuthenticationContext';
import { handleGetConsultationsByPet } from '../../services/consultation/consultationService';
import { handleGetByIdPet, handleGetMyPets } from '../../services/pets/petService';
import { hasDateTime } from '../../utils/datetime';
import { CLIENT_ROLES } from '../../utils/roles';
import { ClientConsultationList } from '../../components/consultations/ClientConsultationList';

interface MyPetConsultationsPageProps {
	backTo: string;
}

export function MyPetConsultationsPage({ backTo }: MyPetConsultationsPageProps) {
	const { petId } = useParams();
	const { role } = useAuth();
	const [petName, setPetName] = useState('');
	const [consultations, setConsultations] = useState<{ id: number; description: string; date: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const id = Number(petId);
		const isClient = role !== null && CLIENT_ROLES.includes(role);

		// El cliente solo puede leer sus propias mascotas (api/Pet/me); los roles clínicos piden la mascota por id.
		const petNameRequest = isClient
			? handleGetMyPets().then((pets) => pets.find((pet) => pet.id === id)?.name)
			: handleGetByIdPet(String(id)).then((pet) => pet.name);

		// El nombre de la mascota solo adorna el título: si falla, la lista se muestra igual.
		Promise.all([handleGetConsultationsByPet(id), petNameRequest.catch(() => '')])
			.then(([response, name]) => {
				setPetName(name?.trim() || '');
				setConsultations(
					response.map((consultation) => ({
						id: consultation.id,
						description: consultation.description?.trim() || 'Sin descripción',
						date: hasDateTime(consultation.date) ? consultation.date.trim() : '',
					})),
				);
			})
			.catch(() => {
				setError('No se pudieron cargar las consultas. Intenta nuevamente.');
				toast.error('No se pudieron cargar las consultas.');
			})
			.finally(() => setIsLoading(false));
	}, [petId, role]);

	return (
		<ScreenShell
			title={petName ? `Consultas de ${petName}` : 'Consultas'}
			icon={Stethoscope}
			backTo={backTo}
			homeTo="/"
		>
			<ClientConsultationList consultations={consultations} isLoading={isLoading} error={error} />
		</ScreenShell>
	);
}