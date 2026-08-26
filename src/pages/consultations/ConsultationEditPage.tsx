import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Form } from '../../components/consultations/Form';
import { handleGetAllPet } from '../../services/pets/petService';
import { handleGetAllUser } from '../../services/users/userService';
import type { IUserResponse } from '../../services/users/IUser';
import type { FormErrors } from '../../components/consultations/validation';
import type { ConsultationFormState } from '../../components/consultations/types';
import { handleGetByIdConsultation, handleUpdateConsultation } from '../../services/consultation/consultationService';
import { validateConsultationForm } from '../../components/consultations/validation';
import type { IPetResponse } from '../../services/pets/IPet';
import { hasDateTime, toApiDate, toInputDate } from '../../utils/datetime';

export function ConsultationEditPage() {
    const { id = '' } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<ConsultationFormState>({
        description: '',
        date: '',
        status: 'Pending',
        petId: '',
        veterinarianId: '',
    });
    const [veterinarians, setVeterinarians] = useState<IUserResponse[]>([]);
    const [isLoadingVeterinarians, setIsLoadingVeterinarians] = useState(true);
    const [veterinariansError, setVeterinariansError] = useState('');
    const [pets, setPets] = useState<IPetResponse[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState(true);
    const [petsError, setPetsError] = useState('');
    const [initialDate, setInitialDate] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        handleGetByIdConsultation(id)
            .then((consultation) => {
                const date = hasDateTime(consultation.date) ? toInputDate(consultation.date.trim()) : '';

                setInitialDate(date);
                setForm({
                    description: consultation.description?.trim() || '',
                    date,
                    status: consultation.status,
                    petId: String(consultation.petId),
                    veterinarianId: String(consultation.veterinarianId),
                });
            })
            .catch(() => {
                setFormError('No se pudo cargar la consulta.');
                toast.error('No se pudo cargar la consulta.');
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        handleGetAllUser()
            .then((response) => setVeterinarians(response.filter((user) => user.roleName === 'Veterinarian')))
            .catch(() => setVeterinariansError('No se pudo cargar la lista de veterinarios.'))
            .finally(() => setIsLoadingVeterinarians(false));
        handleGetAllPet()
            .then((response) => setPets(response))
            .catch(() => setPetsError('No se pudo cargar la lista de mascotas.'))
            .finally(() => setIsLoadingPets(false));
    }, []);

    const handleChange = (field: keyof ConsultationFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setFieldErrors((current) => ({ ...current, [field]: '' }));
    };

    const handleSave = async () => {
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
                description: form.description,
                date: toApiDate(form.date),
                status: form.status,
                petId: Number(form.petId),
                veterinarianId: Number(form.veterinarianId),
            });

            toast.success('Consulta actualizada correctamente.');
            navigate('/consultations');
        } catch {
            setFormError('No se pudo guardar la consulta.');
            toast.error('No se pudo guardar la consulta.');
            setIsSaving(false);
        }
    };

    return (
        <ScreenShell eyebrow="Editar" title="Editar consulta" backTo="/consultations">
            <Form
                form={form}
                formError={formError}
                fieldErrors={fieldErrors}
                veterinarians={veterinarians}
                isLoadingVeterinarians={isLoadingVeterinarians}
                veterinariansError={veterinariansError}
                pets={pets}
                isLoadingPets={isLoadingPets}
                petsError={petsError}
                isLoading={isLoading}
                isSaving={isSaving}
                onChange={handleChange}
                onCancel={() => navigate('/consultations')}
                onSave={handleSave}
                saveLabel="Guardar cambios"
            />
        </ScreenShell>
    );
}