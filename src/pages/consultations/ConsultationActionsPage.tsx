import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ActionSheet } from '../../components/common/ActionSheet';
import { ConsultationDate } from '../../components/consultations/ConsultationDate';
import type { ConsultationsOutletContext } from '../../components/consultations/consultationTypes';
import { formatDate } from '../../utils/datetime';


export function ConsultationActionsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { consultations } = useOutletContext<ConsultationsOutletContext>();

    const selected = consultations.find((consultation) => String(consultation.id) === id);

    if (!selected) return null;

    const avatar = <ConsultationDate date={selected.date} isDeleted={selected.isDeleted} />;
    const details = [
        { label: 'Fecha', value: selected.date ? formatDate(selected.date) : 'Sin fecha asignada' },
        { label: 'Mascota', value: selected.petName },
        { label: 'Veterinario', value: selected.veterinarianName },
    ];

    if (selected.isDeleted) {
        const { clientId } = selected;

        return (
            <ActionSheet
                title={`Consulta de ${selected.petName}`}
                avatar={avatar}
                subtitle={`Suspendida junto con el dueño de ${selected.petName}`}
                details={details}
                isDeleted
                editLabel="Ver dueño"
                onClose={() => navigate('/consultations')}
                onEdit={() => (clientId === null ? navigate('/users') : navigate(`/users/${clientId}`))}
            />
        );
    }

    return (
        <ActionSheet
            title={`Consulta de ${selected.petName}`}
            avatar={avatar}
            subtitle={selected.description}
            details={details}
            editLabel="Editar consulta"
            onClose={() => navigate('/consultations')}
            onEdit={() => navigate(`/consultations/${selected.id}/edit`)}
        />
    );
}
