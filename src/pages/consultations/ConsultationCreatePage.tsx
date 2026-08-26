import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Form } from '../../components/consultations/Form';
import { handleGetAllPet } from '../../services/pets/petService';
import { handleGetAllUser } from '../../services/users/userService';
import type { IUserResponse } from '../../services/users/IUser';
import type { FormErrors } from '../../components/consultations/validation';
import { handleAddConsultation } from '../../services/consultation/consultationService';
import type { ConsultationFormState } from '../../components/consultations/types';
import { validateConsultationForm } from '../../components/consultations/validation';
import type { IPetResponse } from '../../services/pets/IPet';

export function ConsultationCreatePage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<ConsultationFormState>({
        description: '',
        data: '',
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
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [formError, setFormError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

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
                data: form.data,
                petId: Number(form.petId),
                veterinarianId: Number(form.veterinarianId),
            });

            toast.success('Consulta creada correctamente.');
            navigate('/consultations');
        } catch {
            setFormError('No se pudo guardar la consulta.');
            toast.error('No se pudo guardar la consulta.');
            setIsSaving(false);
        }
    };

    return (
        <ScreenShell eyebrow="Nueva" title="Nueva consulta" backTo="/consultations">
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
                isSaving={isSaving}
                onChange={handleChange}
                onCancel={() => navigate('/consultations')}
                onSave={handleSave}
                saveLabel="Crear consulta"
            />
        </ScreenShell>
    );
}