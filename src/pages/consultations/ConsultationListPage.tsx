import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { List } from '../../components/consultations/List';
import { handleGetAllConsultations } from '../../services/consultation/consultationService';
import { handleGetAllPet } from '../../services/pets/petService';
import { handleGetAllUser } from '../../services/users/userService';
import type { Consultation } from '../../components/consultations/types';
import { hasDateTime } from '../../utils/datetime';

export function ConsultationsListPage() {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Las mascotas y los veterinarios solo aportan los nombres: si fallan, la lista se muestra igual.
        Promise.all([
            handleGetAllConsultations(),
            handleGetAllPet().catch(() => []),
            handleGetAllUser().catch(() => []),
        ])
            .then(([response, pets, users]) => {
                const petNames = new Map(pets.map((pet) => [pet.id, pet.name?.trim() || 'Sin nombre']));
                const veterinarianNames = new Map(
                    users.map((user) => [user.id, user.fullName?.trim() || 'Sin nombre']),
                );

                setConsultations(
                    response.map((consultation) => ({
                        id: consultation.id,
                        description: consultation.description?.trim() || 'Sin descripción',
                        date: hasDateTime(consultation.date) ? consultation.date.trim() : '',
                        status: consultation.status,
                        petId: String(consultation.petId),
                        petName:
                            consultation.petId === null
                                ? 'sin asignar'
                                : petNames.get(consultation.petId) || `Mascota #${consultation.petId}`,
                        veterinarianId: String(consultation.veterinarianId),
                        veterinarianName:
                            consultation.veterinarianId === null
                                ? 'sin asignar'
                                : veterinarianNames.get(consultation.veterinarianId) ||
                                  `Veterinario #${consultation.veterinarianId}`,
                    })),
                );
            })
            .catch(() => {
                setError('No se pudo cargar la lista de consultas. Intenta nuevamente.');
                toast.error('No se pudo cargar la lista de consultas.');
            })
            .finally(() => setIsLoading(false));
    }, []);

    const removeConsultation = (consultationId: number) => {
        setConsultations((current) => current.filter((consultation) => consultation.id !== consultationId));
    };

    return (
        <ScreenShell eyebrow="Sysadmin" title="Consultas" icon={PawPrint} homeTo="/">
            <List
                consultations={consultations}
                isLoading={isLoading}
                error={error}
                createTo="/consultations/new"
                itemTo={(consultationId) => `/consultations/${consultationId}`}
            />

            <Outlet context={{ consultations, removeConsultation }} />
        </ScreenShell>
    );
}
