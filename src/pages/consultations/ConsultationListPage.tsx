import { useEffect, useState } from 'react';
import { Stethoscope, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { DEFAULT_QUERY, EMPTY_PAGINATION, type Pagination } from '../../services/IPaginated';
import { useAuth } from '../../contexts/AuthenticationContext';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CREATE_BUTTON_CLASSES } from '../../components/common/listStyles';
import { ConsultationList } from '../../components/consultations/ConsultationList';
import { handleGetConsultationsPage, handleReactivateConsultation, handleSuspendConsultation } from '../../services/consultation/consultationService';
import type { ConsultationQuery, IConsultationWithParticipantsResponse } from '../../services/consultation/IConsultation';
import type { Consultation } from '../../components/consultations/consultationTypes';
import { hasDateTime } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';

const CREATE_TO = '/consultations/new';
const CREATE_LABEL = 'Nueva consulta';

export function ConsultationListPage() {
    const { role } = useAuth();
    const [response, setResponse] = useState<IConsultationWithParticipantsResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState<ConsultationQuery>({ ...DEFAULT_QUERY, mine: role === 'Veterinarian' });
    const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        const timer = setTimeout(() => {
            handleGetConsultationsPage(query, signal)
                .then((result) => {
                    if (signal.aborted) return;

                    const lastPage = Math.max(result.totalPages, 1);
                    if (query.pageIndex > lastPage) {
                        setQuery({ ...query, pageIndex: lastPage });
                        return;
                    }

                    setPagination(result);
                    setResponse(result.items);
                })
                .catch(() => {
                    if (signal.aborted) return;
                    setError('No se pudo cargar la lista de consultas. Intenta nuevamente.');
                    toast.error('No se pudo cargar la lista de consultas.');
                })
                .finally(() => {
                    if (!signal.aborted) setIsLoading(false);
                });
        }, 300);
        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    const changeSuspension = async (id: number, isSuspended: boolean) => {
        try {
            if (isSuspended) await handleSuspendConsultation(id);
            else await handleReactivateConsultation(id);

            setResponse((current) => current.map((consultation) => consultation.id === id ? { ...consultation, isSuspended } : consultation));
            setQuery((current) => current.includeSuspended ? current : { ...current });
            toast.success(isSuspended ? 'Consulta suspendida correctamente.' : 'Consulta reactivada correctamente.');
        } catch (error) {
            toast.error(errorMessage(error, isSuspended ? 'No se pudo suspender la consulta.' : 'No se pudo reactivar la consulta.'));
        }
    };

    const consultations: Consultation[] = response.map((consultation) => ({
        id: consultation.id,
        description: consultation.description?.trim() || 'Sin título',
        date: hasDateTime(consultation.date) ? consultation.date.trim() : '',
        petId: String(consultation.petId),
        petName:
            consultation.petId === null
                ? 'sin asignar'
                : consultation.petName?.trim() || `Mascota #${consultation.petId}`,
        veterinarianId: String(consultation.veterinarianId),
        veterinarianName:
            consultation.veterinarianId === null
                ? 'sin asignar'
                : consultation.veterinarianName?.trim() || `Veterinario #${consultation.veterinarianId}`,
        isSuspended: consultation.isSuspended,
    }));

    return (
        <ScreenShell
            title="Consultas"
            icon={Stethoscope}
            homeTo="/"
            action={
        <Button asChild size="lg" className={CREATE_BUTTON_CLASSES}>
          <Link to={CREATE_TO}>
            <Plus /> {CREATE_LABEL}
          </Link>
        </Button>
      }
        >
            <ConsultationList
                consultations={query.includeSuspended ? consultations : consultations.filter((consultation) => !consultation.isSuspended)}
                isLoading={isLoading}
                error={error}
                createTo={CREATE_TO}
                createLabel={CREATE_LABEL}
                query={query}
                onQueryChange={setQuery}
                onSuspend={(id) => changeSuspension(id, true)}
                onReactivate={(id) => changeSuspension(id, false)}
                pagination={pagination}
            />
        </ScreenShell>
    );
}
