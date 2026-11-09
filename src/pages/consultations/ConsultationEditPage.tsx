import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationForm } from '../../components/consultations/ConsultationForm';
import type { FormErrors } from '../../components/consultations/consultationValidation';
import type { ConsultationFormState } from '../../components/consultations/consultationTypes';
import { handleGetByIdConsultation, handleUpdateConsultation } from '../../services/consultation/consultationService';
import { validateConsultationForm } from '../../components/consultations/consultationValidation';
import { hasDateTime, toApiDate, toInputDate } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';

export function ConsultationEditPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const returnTo = state?.fromConsultationDetail === true ? `/consultations/${id}` : '/consultations';

    const [form, setForm] = useState<ConsultationFormState>({
        title: '',
        description: '',
        date: '',
        petId: '',
        veterinarianId: '',
    });
    const [initialDate, setInitialDate] = useState<string>();
    const [assignedVeterinarian, setAssignedVeterinarian] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        handleGetByIdConsultation(id)
            .then((consultation) => {
                if (consultation.isSuspended) {
                    toast.error('La consulta está suspendida y no se puede editar.');
                    navigate('/consultations', { replace: true });
                    return;
                }
                const date = hasDateTime(consultation.date) ? toInputDate(consultation.date.trim()) : '';

                const veterinarianId = consultation.veterinarianId === null ? '' : String(consultation.veterinarianId);

                setInitialDate(date);
                setAssignedVeterinarian(consultation.veterinarianName?.trim() || (veterinarianId ? `Veterinario #${veterinarianId}` : 'Sin registrar'));
                setForm({
                    title: consultation.title ?? '',
                    description: consultation.description?.trim() || '',
                    date,
                    petId: consultation.petId === null ? '' : String(consultation.petId),
                    veterinarianId,
                });
            })
            .catch((error) => {
                const message = errorMessage(error, 'No se pudo cargar la consulta.');
                setForm({
                    title: '',
                    description: '',
                    date: '',
                    petId: '',
                    veterinarianId: '',
                });
                setInitialDate(undefined);
                setAssignedVeterinarian('');
                setFieldErrors({});
                setFormError(message);
                toast.error(message);
            })
            .finally(() => setIsLoading(false));
    }, [id, navigate]);

    const handleChange = (field: keyof ConsultationFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setFieldErrors((current) => ({ ...current, [field]: '' }));
    };

    const handleSave = async () => {
        if (isLoading || isSaving || initialDate === undefined) return;

        const errors = validateConsultationForm(form, initialDate);
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.error('Revisa los campos marcados en rojo.');
            return;
        }

        setIsSaving(true);
        setFormError('');

        try {
            await handleUpdateConsultation(id, {
                title: form.title.trim(),
                description: form.description,
                date: toApiDate(form.date),
                petId: Number(form.petId),
            });

            toast.success('Consulta actualizada correctamente.');
            navigate(returnTo);
        } catch (error) {
            const message = errorMessage(error, 'No se pudo guardar la consulta.');
            setFormError(message);
            toast.error(message);
            setIsSaving(false);
        }
    };

    return (
        <ScreenShell title="Editar consulta" backTo="/consultations">
            <ConsultationForm
                form={form}
                formError={formError}
                fieldErrors={fieldErrors}
                assignedVeterinarian={assignedVeterinarian}
                isLoading={isLoading}
                isSaving={isSaving}
                onChange={handleChange}
                onCancel={() => navigate(returnTo)}
                onSave={handleSave}
                saveLabel="Guardar cambios"
            />
        </ScreenShell>
    );
}
