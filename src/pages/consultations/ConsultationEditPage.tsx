import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationForm } from '../../components/consultations/ConsultationForm';
import type { ProfessionalOption } from '../../components/consultations/VeterinarianSelect';
import type { FormErrors } from '../../components/consultations/consultationValidation';
import type { ConsultationFormState } from '../../components/consultations/consultationTypes';
import { useAuth } from '../../contexts/AuthenticationContext';
import { handleGetCurrentUser } from '../../services/auth/authService';
import { handleGetByIdConsultation, handleUpdateConsultation } from '../../services/consultation/consultationService';
import { validateConsultationForm } from '../../components/consultations/consultationValidation';
import { hasDateTime, toApiDate, toInputDate } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';

export function ConsultationEditPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();
    const { role } = useAuth();
    const canReassign = role === 'Admin' || role === 'SysAdmin';
    const { key, state } = useLocation();
    const fromDetail = state?.fromConsultationDetail === true;
    const returnTo = fromDetail ? `/consultations/${id}` : '/consultations';

    const returnToOrigin = () => {
      if (fromDetail) {
        if (window.history.state?.key === key) navigate(-1);
        return;
      }

      navigate(returnTo);
    };

    const [form, setForm] = useState<ConsultationFormState>({
        title: '',
        description: '',
        date: '',
        petId: '',
        veterinarianId: '',
    });
    const [initialDate, setInitialDate] = useState<string>();
    const [initialProfessional, setInitialProfessional] = useState<ProfessionalOption>();
    const [ownProfessional, setOwnProfessional] = useState<ProfessionalOption>();
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (role !== 'Admin') return;

        let active = true;
        handleGetCurrentUser()
            .then((user) => {
                if (active) setOwnProfessional({ id: String(user.id), name: user.fullName?.trim() || 'Mi usuario' });
            })
            .catch(() => {});

        return () => { active = false; };
    }, [role]);

    useEffect(() => {
        handleGetByIdConsultation(id)
            .then((consultation) => {
                if (consultation.isSuspended) {
                    toast.error('La consulta está suspendida y no se puede editar.');
                    navigate('/consultations', { replace: true });
                    return;
                }
                const date = hasDateTime(consultation.date) ? toInputDate(consultation.date.trim()) : '';

                const veterinarianId = consultation.veterinarianId == null ? '' : String(consultation.veterinarianId);

                setInitialDate(date);
                setInitialProfessional(veterinarianId ? {
                    id: veterinarianId,
                    name: consultation.veterinarianName?.trim() || `Veterinario #${veterinarianId}`,
                } : undefined);
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
                setInitialProfessional(undefined);
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

        const errors = validateConsultationForm(form, initialDate, canReassign);
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
                veterinarianId: canReassign && form.veterinarianId !== initialProfessional?.id
                    ? Number(form.veterinarianId)
                    : undefined,
            });

            toast.success('Consulta actualizada correctamente.');
            returnToOrigin();
        } catch (error) {
            const message = errorMessage(error, 'No se pudo guardar la consulta.');
            setFormError(message);
            toast.error(message);
            setIsSaving(false);
        }
    };

    return (
        <ScreenShell title="Editar consulta" backTo={returnTo}>
            <ConsultationForm
                form={form}
                formError={formError}
                fieldErrors={fieldErrors}
                assignedVeterinarian={canReassign ? undefined : initialProfessional?.name || 'Sin registrar'}
                initialProfessional={initialProfessional}
                ownProfessional={ownProfessional}
                includeAdmins={role === 'SysAdmin'}
                isLoading={isLoading}
                isSaving={isSaving}
                onChange={handleChange}
                onCancel={returnToOrigin}
                onSave={handleSave}
                saveLabel="Guardar cambios"
            />
        </ScreenShell>
    );
}
