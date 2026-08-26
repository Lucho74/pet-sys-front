import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { List } from '../../components/consultations/List';
import { handleGetAllConsultations } from '../../services/consultation/consultationService';
import type { Consultation } from '../../components/consultations/types';

export function ConsultationsListPage() {
    const [consultations, setConsultations] = useState<Consultation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        handleGetAllConsultations()
            .then((response) =>
                setConsultations(
                    response.map((consultation) => ({
                        id: consultation.id,
                        description: consultation.description?.trim() || 'Sin descripción',
                        data: consultation.data?.trim() || '',
                        status: consultation.status,
                        petId: String(consultation.petId),
                        veterinarianId: String(consultation.veterinarianId),
                    })),
                ),
            )
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
