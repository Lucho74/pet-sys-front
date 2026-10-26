import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { CreateButton } from '../../components/common/CreateButton';
import { ConsultationList } from '../../components/consultations/ConsultationList';
import { SearchBar } from '../../components/common/SearchBar';
import { matchesSearch } from '../../utils/search';
import { handleGetAllConsultations } from '../../services/consultation/consultationService';
import { handleGetAllPet } from '../../services/pets/petService';
import { handleGetAllUser } from '../../services/users/userService';
import type { Consultation } from '../../components/consultations/consultationTypes';
import { hasDateTime } from '../../utils/datetime';

const CREATE_TO = '/consultations/new';
const CREATE_LABEL = 'Nueva consulta';

export function ConsultationListPage() {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Las mascotas y los usuarios solo aportan los nombres: si fallan, la lista se muestra igual.
        Promise.all([
            handleGetAllConsultations(),
            handleGetAllPet().catch(() => []),
            handleGetAllUser().catch(() => []),
        ])
            .then(([response, pets, users]) => {
                const petNames = new Map(pets.map((pet) => [pet.id, pet.name?.trim() || 'Sin nombre']));
                const petOwners = new Map(pets.map((pet) => [pet.id, pet.clientId]));
                // Veterinarios y clientes son usuarios: el mismo mapa da los dos nombres.
                const userNames = new Map(users.map((user) => [user.id, user.fullName?.trim() || 'Sin nombre']));
                
                setConsultations(
                    response.map((consultation) => {
                        const clientId =
                            consultation.petId === null ? null : petOwners.get(consultation.petId) ?? null;

                        return {
                            id: consultation.id,
                            description: consultation.description?.trim() || 'Sin descripción',
                            date: hasDateTime(consultation.date) ? consultation.date.trim() : '',
                            petId: String(consultation.petId),
                            petName:
                                consultation.petId === null
                                    ? 'sin asignar'
                                    : petNames.get(consultation.petId) || `Mascota #${consultation.petId}`,
                            veterinarianId: String(consultation.veterinarianId),
                            veterinarianName:
                                consultation.veterinarianId === null
                                    ? 'sin asignar'
                                    : userNames.get(consultation.veterinarianId) ||
                                      `Veterinario #${consultation.veterinarianId}`,
                            clientId,
                            clientName:
                                clientId === null ? 'sin asignar' : userNames.get(clientId) || `Cliente #${clientId}`,
                            isDeleted: consultation.isDeleted,
                        };
                    }),
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

    const filteredConsultations = consultations.filter((consultation) =>
        matchesSearch(`${consultation.petName} ${consultation.clientName}`, search.trim()),
    );

    return (
        <ScreenShell
            title="Consultas"
            icon={Stethoscope}
            homeTo="/"
            action={<CreateButton to={CREATE_TO} label={CREATE_LABEL} variant="header" />}
        >
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar por mascota o cliente" />

            <ConsultationList
                consultations={filteredConsultations}
                isLoading={isLoading}
                error={error}
                createTo={CREATE_TO}
                createLabel={CREATE_LABEL}
                itemTo={(consultationId) => `/consultations/${consultationId}`}
                emptyLabel={consultations.length > 0 ? 'Ninguna consulta coincide con la búsqueda.' : undefined}
            />

            <Outlet context={{ consultations, removeConsultation }} />
        </ScreenShell>
    );
}
