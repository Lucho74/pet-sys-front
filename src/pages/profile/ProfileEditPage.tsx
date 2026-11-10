import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { UserForm } from '../../components/users/UserForm';
import { isProfessionalRole, type UserFormState } from '../../components/users/userTypes';
import { validateUserForm, type FormErrors } from '../../components/users/userValidation';
import { handleGetCurrentUser } from '../../services/auth/authService';
import { handleUpdateUser } from '../../services/users/userService';
import { errorMessage } from '../../utils/errors';
import { PROFILE_UPDATED_EVENT } from '../../utils/events';

const EMPTY_FORM: UserFormState = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  roleName: '',
  dni: '',
  registrationNumber: '',
};

export function ProfileEditPage() {
  const navigate = useNavigate();
  const { key, state } = useLocation();
  const [userId, setUserId] = useState<number | null>(null);
  const [form, setForm] = useState<UserFormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    handleGetCurrentUser()
      .then((user) => {
        if (!active) return;
        setUserId(user.id);
        setForm({
          fullName: user.fullName?.trim() || '',
          email: user.email?.trim() || '',
          phone: user.phone?.trim() || '',
          password: '',
          roleName: user.roleName || '',
          dni: user.dni?.trim() || '',
          registrationNumber: user.registrationNumber?.trim() || '',
        });
      })
      .catch((error) => {
        if (!active) return;
        const message = errorMessage(error, 'No se pudieron cargar tus datos.');
        setFormError(message);
        toast.error(message);
      })
      .finally(() => { if (active) setIsLoading(false); });

    return () => { active = false; };
  }, []);

  const handleChange = (field: keyof UserFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const returnToProfile = () => {
    if ((window.history.state?.key ?? 'default') !== key) return;

    if (state?.fromProfile === true) {
      navigate(-1);
    } else {
      navigate('/profile', { replace: true });
    }
  };

  const handleSave = async () => {
    const errors = validateUserForm(form, true);
    delete errors.roleName;
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      await handleUpdateUser(String(userId), {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password || null,
        dni: form.roleName === 'Client' ? form.dni.trim() : null,
        registrationNumber: isProfessionalRole(form.roleName) ? form.registrationNumber.trim() : null,
      });

      window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
      toast.success('Tus datos se actualizaron correctamente.');
      returnToProfile();
    } catch (error) {
      const message = errorMessage(error, 'No se pudieron guardar tus datos.');
      setFormError(message);
      toast.error(message);
      setIsSaving(false);
    }
  };

  return (
    <ScreenShell title="Editar mis datos" backTo="/profile">
      <UserForm
        form={form}
        formError={formError}
        fieldErrors={fieldErrors}
        canChangeRole={false}
        isPasswordOptional
        isLoading={isLoading}
        isSaving={isSaving}
        onChange={handleChange}
        onCancel={returnToProfile}
        onSave={handleSave}
        saveLabel="Guardar cambios"
        roleOptions={[]}
      />
    </ScreenShell>
  );
}
