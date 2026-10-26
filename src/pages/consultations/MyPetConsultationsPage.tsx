import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { useAuth } from '../../contexts/AuthenticationContext';
import { ROLE_LABELS } from '../../components/users/userTypes';
import { handleGetConsultationsByPet } from '../../services/consultation/consultationService';
import { handleGetMyPets } from '../../services/pets/petService';
import { hasDateTime } from '../../utils/datetime';
import { ClientConsultationList } from '../../components/consultations/ClientConsultationList';

export function MyPetConsultationsPage() {
	const { petId } = useParams();
	const { role } = useAuth();
	const [petName, setPetName] = useState('');
	const [consultations, setConsultations] = useState<{ id: number; description: string; date: string }[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const id = Number(petId);

		// El nombre de la mascota solo adorna el título: si falla, la lista se muestra igual.
		Promise.all([handleGetConsultationsByPet(id), handleGetMyPets().catch(() => [])])
			.then(([response, pets]) => {
				setPetName(pets.find((pet) => pet.id === id)?.name?.trim() || '');
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
	}, [petId]);

	return (
		<ScreenShell
			eyebrow={role ? ROLE_LABELS[role] : ''}
			title={petName ? `Consultas de ${petName}` : 'Consultas'}
			icon={Stethoscope}
			backTo="/my-pets"
			homeTo="/"
		>
			<ClientConsultationList consultations={consultations} isLoading={isLoading} error={error} />
		</ScreenShell>
	);
}