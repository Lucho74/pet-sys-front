import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationForm } from '../../components/consultations/ConsultationForm';
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
    const { role, token } = useAuth();
    const [searchParams] = useSearchParams();
    const presetPetId = searchParams.get('petId') ?? '';
    const presetVeterinarianId = searchParams.get('veterinarianId') ?? '';
    const adminId = role === 'Admin' && token ? jwtDecode(token).sub : undefined;
    const assignToSelf = role === 'Veterinarian';
    const backTo = presetPetId ? `/pets/${presetPetId}`
        : presetVeterinarianId ? `/users/${presetVeterinarianId}` : '/consultations';

    const [form, setForm] = useState<ConsultationFormState>({
        title: '',
        description: '',
        date: todayDate(),
        petId: presetPetId,
        veterinarianId: assignToSelf ? '' : presetVeterinarianId || adminId || '',
    });
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [professionalName, setProfessionalName] = useState('Cargando nombre...');

    useEffect(() => {
        if (!assignToSelf && !adminId) return;

        let active = true;
        handleGetCurrentUser()
            .then((user) => {
                if (active) setProfessionalName(user.fullName?.trim() || 'Mi usuario');
            })
            .catch(() => {
                if (active) setProfessionalName('Mi usuario');
            });

        return () => { active = false; };
    }, [assignToSelf, adminId]);

    const handleChange = (field: keyof ConsultationFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
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
        <ScreenShell title="Nueva consulta" backTo={backTo}>
            <ConsultationForm
                form={form}
                formError={formError}
                fieldErrors={fieldErrors}
                assignedVeterinarian={assignToSelf ? professionalName : undefined}
                ownProfessional={adminId ? { id: adminId, name: professionalName } : undefined}
                isSaving={isSaving}
                onChange={handleChange}
                onCancel={() => navigate(backTo)}
                onSave={handleSave}
                saveLabel="Crear consulta"
            />
        </ScreenShell>
    );
}
