import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { ActionSheet } from '../../components/common/ActionSheet';
import type { ConsultationsOutletContext } from '../../components/consultations/types';


export function ConsultationActionsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { consultations } = useOutletContext<ConsultationsOutletContext>();

    const selected = consultations.find((consultation) => String(consultation.id) === id);

    if (!selected) return null;

    return (
        <ActionSheet
            title={"Consulta #" + selected.id}
            subtitle={`${selected.description} · ${selected.data} · ${selected.status}`}
            editLabel="Editar consulta"
            deleteLabel="Eliminar consulta"
            onClose={() => navigate('/consultations')}
            onEdit={() => navigate(`/consultations/${selected.id}/edit`)}
            onDelete={() => navigate(`/consultations/${selected.id}/delete`)}
        />
    );
}