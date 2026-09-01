import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginForm } from '../components/auth/LoginForm';
import { handleLogin } from '../services/auth/authService';
import type { LoginFormState } from '../components/auth/types';
import { validateLoginForm } from '../components/auth/validation';
import type { FormErrors } from '../components/auth/validation';

export function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginFormState>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof LoginFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = async () => {
    const errors = validateLoginForm(form);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error('Revisa los campos marcados en rojo.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    try {
      const response = await handleLogin(form);
      localStorage.setItem('authToken', response.token);
      toast.success('Bienvenido.');
      navigate('/');
    } catch {
      setFormError('Correo o contraseña incorrectos.');
      toast.error('Correo o contraseña incorrectos.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#e9edf1] px-5">
      <div className="w-full max-w-[380px] overflow-hidden rounded-2xl bg-[#DDE6ED] shadow-sm">
        <div className="flex flex-col gap-0.5 bg-[#27374D] px-6 py-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9DB2BF]">
            4 Patas
          </div>
          <div className="text-[26px] font-bold tracking-[-0.3px] text-[#DDE6ED]">
            Iniciar sesión
          </div>
        </div>

        <div className="px-6 py-6">
          <LoginForm
            form={form}
            fieldErrors={fieldErrors}
            isSubmitting={isSubmitting}
            onEmailChange={(value) => handleChange('email', value)}
            onPasswordChange={(value) => handleChange('password', value)}
            onSubmit={handleSubmit}
          />

          {formError ? (
            <div className="mt-4 rounded-[10px] border border-[#9DB2BF] bg-white px-3 py-2.5 text-[13px] text-[#27374D]">
              {formError}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
