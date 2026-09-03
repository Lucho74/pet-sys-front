import { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DeleteDialog } from '../../components/common/DeleteDialog';
import type { ConsultationsOutletContext } from '../../components/consultations/consultationTypes';
import { handleDeleteConsultation } from '../../services/consultation/consultationService';

export function ConsultationDeletePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { consultations, removeConsultation } = useOutletContext<ConsultationsOutletContext>();
    const [isDeleting, setIsDeleting] = useState(false);

    const selected = consultations.find((consultation) => String(consultation.id) === id);

    if (!selected) return null;

    const handleConfirm = async () => {
        setIsDeleting(true);

        try {
            await handleDeleteConsultation(String(selected.id));
            removeConsultation(selected.id);
            toast.success('Consulta eliminada correctamente.');
        } catch {
            toast.error('No se pudo eliminar la consulta.');
        }

        navigate('/consultations');
    };

    return (
        <DeleteDialog
            title="Eliminar consulta"
            name={`#${selected.id.toString()}`}
            isDeleting={isDeleting}
            onCancel={() => navigate(`/consultations/${selected.id}`)}
            onConfirm={handleConfirm}
        />
    );
}