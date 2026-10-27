import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ActionSheet } from '../../components/common/ActionSheet';
import type { ConsultationsOutletContext } from '../../components/consultations/consultationTypes';
import { formatDate } from '../../utils/datetime';


export function ConsultationActionsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { consultations } = useOutletContext<ConsultationsOutletContext>();

    const selected = consultations.find((consultation) => String(consultation.id) === id);

    if (!selected) return null;

    if (selected.isDeleted) {
        const { clientId } = selected;

        return (
            <ActionSheet
                title={`Consulta de ${selected.petName}`}
                avatar={String(selected.id)}
                subtitle={`Suspendida junto con el dueño de ${selected.petName}`}
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
            avatar={String(selected.id)}
            subtitle={`${selected.description} · ${selected.date ? formatDate(selected.date) : 'Sin fecha asignada'}`}
            editLabel="Editar consulta"
            onClose={() => navigate('/consultations')}
            onEdit={() => navigate(`/consultations/${selected.id}/edit`)}
        />
    );
}