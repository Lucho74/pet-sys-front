import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { ConsultationForm } from '../../components/consultations/ConsultationForm';
import { handleGetAllPet } from '../../services/pets/petService';
import { handleGetAllUser } from '../../services/users/userService';
import type { IUserResponse } from '../../services/users/IUser';
import type { FormErrors } from '../../components/consultations/consultationValidation';
import { handleAddConsultation } from '../../services/consultation/consultationService';
import type { ConsultationFormState } from '../../components/consultations/consultationTypes';
import { validateConsultationForm } from '../../components/consultations/consultationValidation';
import type { IPetResponse } from '../../services/pets/IPet';
import { toApiDate } from '../../utils/datetime';
import { errorMessage } from '../../utils/errors';

export function ConsultationCreatePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<ConsultationFormState>({
        description: '',
        date: '',
        petId: '',
        veterinarianId: '',
    });
    const [veterinarians, setVeterinarians] = useState<IUserResponse[]>([]);
    const [isLoadingVeterinarians, setIsLoadingVeterinarians] = useState(true);
    const [veterinariansError, setVeterinariansError] = useState('');
    const [pets, setPets] = useState<IPetResponse[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState(true);
    const [petsError, setPetsError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        handleGetAllUser()
            .then((response) => setVeterinarians(response.filter((user) => user.roleName === 'Veterinarian' && !user.isDeleted)))
            .catch(() => setVeterinariansError('No se pudo cargar la lista de veterinarios.'))
            .finally(() => setIsLoadingVeterinarians(false));
        handleGetAllPet()
            .then((response) => setPets(response.filter((pet) => !pet.isDeleted)))
            .catch(() => setPetsError('No se pudo cargar la lista de mascotas.'))
            .finally(() => setIsLoadingPets(false));
            
    }, []);

    const handleChange = (field: keyof ConsultationFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setFieldErrors((current) => ({ ...current, [field]: '' }));
    };

    const handleSave = async () => {
        const errors = validateConsultationForm(form);
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0) {
            toast.error('Revisa los campos marcados en rojo.');
            return;
        }

        setIsSaving(true);
        setFormError('');

        try {
            await handleAddConsultation({
                description: form.description,
                date: toApiDate(form.date),
                petId: Number(form.petId),
                veterinarianId: Number(form.veterinarianId),
            });

            toast.success('Consulta creada correctamente.');
            navigate('/consultations');
        } catch (error) {
            const message = errorMessage(error, 'No se pudo guardar la consulta.');
            setFormError(message);
            toast.error(message);
            setIsSaving(false);
        }
    };

    return (
        <ScreenShell title="Nueva consulta" backTo="/consultations">
            <ConsultationForm
                form={form}
                formError={formError}
                fieldErrors={fieldErrors}
                veterinarians={veterinarians}
                isLoadingVeterinarians={isLoadingVeterinarians}
                veterinariansError={veterinariansError}
                pets={pets}
                isLoadingPets={isLoadingPets}
                petsError={petsError}
                isSaving={isSaving}
                onChange={handleChange}
                onCancel={() => navigate('/consultations')}
                onSave={handleSave}
                saveLabel="Crear consulta"
            />
        </ScreenShell>
    );
}