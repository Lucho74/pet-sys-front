import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ScreenShell } from '../../components/layout/ScreenShell';
import { Form } from '../../components/users/UserForm';
import { handleGetByIdUser, handleUpdateUser } from '../../services/users/userService';
import type { UserRole } from '../../services/users/IUser';
import type { UserFormState } from '../../components/users/userTypes';
import { validateUserForm } from '../../components/users/userValidation';
import type { FormErrors } from '../../components/users/userValidation';

export function UserEditPage() {
  const { id = '' } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    handleGetByIdUser(id)
      .then((user) =>
        setForm({
          fullName: user.fullName?.trim() || '',
          email: user.email?.trim() || '',
          phone: user.phone?.trim() || '',
          password: user.password?.trim() || '',
          roleName: user.roleName || 'Client',
          dni: user.dni?.trim() || '',
        }),
      )
      .catch(() => {
        setFormError('No se pudo cargar el usuario.');
        toast.error('No se pudo cargar el usuario.');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

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
      await handleUpdateUser(id, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        roleName: form.roleName as UserRole,
        dni: form.roleName === 'Client' ? form.dni : null,
      });

      toast.success('Usuario actualizado correctamente.');
      navigate('/users');
    } catch {
      setFormError('No se pudo guardar el usuario.');
      toast.error('No se pudo guardar el usuario.');
      setIsSaving(false);
    }
  };

  return (
    <ScreenShell eyebrow="Editar" title="Editar usuario" backTo="/users">
      <Form
        form={form}
        formError={formError}
        fieldErrors={fieldErrors}
        canChangeRole={false}
        isLoading={isLoading}
        isSaving={isSaving}
        onChange={handleChange}
        onCancel={() => navigate('/users')}
        onSave={handleSave}
        saveLabel="Guardar cambios"
      />
    </ScreenShell>
  );
}
