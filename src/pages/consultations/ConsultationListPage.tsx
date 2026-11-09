import { useEffect, useState } from 'react';
import { Stethoscope, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { DEFAULT_QUERY, EMPTY_PAGINATION, type PageQuery, type Pagination } from '../../services/IPaginated';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ConsultationList } from '../../components/consultations/ConsultationList';
import { handleGetConsultationsPage } from '../../services/consultation/consultationService';
import { handleGetAllPet } from '../../services/pets/petService';
import { handleGetAllUser } from '../../services/users/userService';
import type { IConsultationResponse } from '../../services/consultation/IConsultation';
import type { Consultation } from '../../components/consultations/consultationTypes';
import { hasDateTime } from '../../utils/datetime';

const CREATE_TO = '/consultations/new';
const CREATE_LABEL = 'Nueva consulta';

export function ConsultationListPage() {
    const [response, setResponse] = useState<IConsultationResponse[]>([]);
    const [petNames, setPetNames] = useState(new Map<number, string>());
    const [veterinarianNames, setVeterinarianNames] = useState(new Map<number, string>());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState<PageQuery>(DEFAULT_QUERY);
    const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);

    useEffect(() => {
        handleGetAllPet()
            .then((pets) => setPetNames(new Map(pets.map((pet) => [pet.id, pet.name?.trim() || 'Sin nombre']))))
            .catch(() => {});
        handleGetAllUser()
            .then((users) =>
                setVeterinarianNames(new Map(users.map((user) => [user.id, user.fullName?.trim() || 'Sin nombre']))),
            )
            .catch(() => {});
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleGetConsultationsPage(query)
                .then((result) => {
                    setPagination(result);
                    setResponse(result.items);
                })
                .catch(() => {
                    setError('No se pudo cargar la lista de consultas. Intenta nuevamente.');
                    toast.error('No se pudo cargar la lista de consultas.');
                })
                .finally(() => setIsLoading(false));
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const consultations: Consultation[] = response.map((consultation) => ({
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
                : veterinarianNames.get(consultation.veterinarianId) || `Veterinario #${consultation.veterinarianId}`,
        isSuspended: consultation.isSuspended,
    }));

    return (
        <ScreenShell
            title="Consultas"
            icon={Stethoscope}
            homeTo="/"
            action={
        <Button asChild>
          <Link to={CREATE_TO}>
            <Plus /> {CREATE_LABEL}
          </Link>
        </Button>
      }
        >
            <ConsultationList
                consultations={consultations}
                isLoading={isLoading}
                error={error}
                createTo={CREATE_TO}
                createLabel={CREATE_LABEL}
                query={query}
                onQueryChange={setQuery}
                pagination={pagination}
            />
        </ScreenShell>
    );
}
