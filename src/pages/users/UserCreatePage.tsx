import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Form } from '../../components/users/UserForm';
import { handleAddUser } from '../../services/users/userService';
import type { UserRole } from '../../services/users/IUser';
import type { UserFormState } from '../../components/users/userTypes';
import { validateUserForm } from '../../components/users/userValidation';
import type { FormErrors } from '../../components/users/userValidation';

export function UserCreatePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<UserFormState>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    roleName: 'Client',
    dni: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: keyof UserFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSave = async () => {
    const errors = validateUserForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      await handleAddUser({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        userType: form.roleName as UserRole,
        dni: form.roleName === 'Client' ? form.dni : null,
      });

      toast.success('Usuario creado correctamente.');
      navigate('/users');
    } catch {
      setFormError('No se pudo guardar el usuario.');
      toast.error('No se pudo guardar el usuario.');
      setIsSaving(false);
    }
  };

  return (
    <ScreenShell eyebrow="Nuevo" title="Nuevo usuario" backTo="/users">
      <Form
        form={form}
        formError={formError}
        fieldErrors={fieldErrors}
        isSaving={isSaving}
        onChange={handleChange}
        onCancel={() => navigate('/users')}
        onSave={handleSave}
        saveLabel="Crear usuario"
      />
    </ScreenShell>
  );
}
