import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationForm } from '../../components/consultations/ConsultationForm';
import type { ProfessionalOption } from '../../components/consultations/VeterinarianSelect';
import type { FormErrors } from '../../components/consultations/consultationValidation';
import { useAuth } from '../../contexts/AuthenticationContext';
import { handleGetCurrentUser } from '../../services/auth/authService';
import { handleAddConsultation } from '../../services/consultation/consultationService';
import type { ConsultationFormState } from '../../components/consultations/consultationTypes';
import { validateConsultationForm } from '../../components/consultations/consultationValidation';
import { toApiDate, todayDate } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';

export function ConsultationCreatePage() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const fromHome = state?.fromHome === true;
    const canReturnToOrigin = fromHome || state?.fromDetail === true;
    const { role } = useAuth();
    const [searchParams] = useSearchParams();
    const presetPetId = searchParams.get('petId') ?? '';
    const presetVeterinarianId = searchParams.get('veterinarianId') ?? '';
    const isAdmin = role === 'Admin';
    const assignToSelf = role === 'Veterinarian';
    const backTo = presetPetId ? `/pets/${presetPetId}`
        : presetVeterinarianId ? `/users/${presetVeterinarianId}` : '/consultations';

    const [draft, setDraft] = useState<Omit<ConsultationFormState, 'veterinarianId'> & { veterinarianId?: string }>({
        title: '',
        description: '',
        date: todayDate(),
        petId: presetPetId,
    });
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [professional, setProfessional] = useState<ProfessionalOption | null>();
    const ownProfessional = isAdmin ? professional ?? undefined : undefined;
    const professionalName = professional?.name ?? (professional === null ? 'Mi usuario' : 'Cargando nombre...');
    const defaultVeterinarianId = presetVeterinarianId || ownProfessional?.id || '';
    const form: ConsultationFormState = {
        ...draft,
        veterinarianId: assignToSelf ? '' : draft.veterinarianId ?? defaultVeterinarianId,
    };

    useEffect(() => {
        if (!assignToSelf && !isAdmin) return;

        let active = true;
        handleGetCurrentUser()
            .then((user) => {
                if (active) setProfessional({ id: String(user.id), name: user.fullName?.trim() || 'Mi usuario' });
            })
            .catch(() => {
                if (active) setProfessional(null);
            });

        return () => { active = false; };
    }, [assignToSelf, isAdmin]);

    const handleChange = (field: keyof ConsultationFormState, value: string) => {
        setDraft((current) => ({ ...current, [field]: value }));
        setFieldErrors((current) => ({ ...current, [field]: '' }));
    };

    const handleSave = async () => {
        if (isSaving) return;

        const errors = validateConsultationForm(form, undefined, !assignToSelf);
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.error('Revisa los campos marcados en rojo.');
            return;
        }

        setIsSaving(true);
        setFormError('');

        try {
            const consultation = await handleAddConsultation({
                title: form.title.trim(),
                description: form.description,
                date: toApiDate(form.date),
                petId: Number(form.petId),
                veterinarianId: assignToSelf ? null : Number(form.veterinarianId),
            });

            toast.success('Consulta creada correctamente.');
            navigate(`/consultations/${consultation.id}`, { replace: true });
        } catch (error) {
            const message = errorMessage(error, 'No se pudo guardar la consulta.');
            setFormError(message);
            toast.error(message);
            setIsSaving(false);
        }
    };

    return (
        <ScreenShell title="Nueva consulta" backTo={fromHome ? '/' : backTo}>
            <ConsultationForm
                form={form}
                formError={formError}
                fieldErrors={fieldErrors}
                assignedVeterinarian={assignToSelf ? professionalName : undefined}
                ownProfessional={ownProfessional}
                isSaving={isSaving}
                onChange={handleChange}
                onCancel={() => canReturnToOrigin ? navigate(-1) : navigate(backTo, { replace: true })}
                onSave={handleSave}
                saveLabel="Crear consulta"
            />
        </ScreenShell>
    );
}
