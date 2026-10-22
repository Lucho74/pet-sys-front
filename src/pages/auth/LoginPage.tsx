import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginFormState } from "../../components/auth/authTypes";
import { validateLoginForm, type FormErrors } from "../../components/auth/loginValidation";
import { toast } from "react-toastify";
import { HandleLogin } from "../../services/auth/authService";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { LoginForm } from "../../components/auth/LoginForm";
import type { ILoginResponse } from "../../services/auth/IAuth";
import { useAuth } from "../../contexts/AuthenticationContext";


export function LoginPage() {
    const navigate = useNavigate();
    const { handleUserLogin } = useAuth();

    const [form, setForm] = useState<LoginFormState>({
        email: '',
        password: '',
    });
    const [formError, setFormError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleChange = (field: keyof LoginFormState, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setFieldErrors((current) => ({ ...current, [field]: '' }));
    }

    const handleLogin = async () => {
        const errors = validateLoginForm(form);
        setFieldErrors(errors);

        if (Object.keys(errors).length > 0){
            toast.error('Revisa los campos marcados en rojo.');
            return;
        }

        setIsLoggingIn(true);
        setFormError('');

        

        try {
            const response: ILoginResponse = await HandleLogin({
                email: form.email,
                password: form.password,
            });

            if(!handleUserLogin(response.token)) {
                throw new Error('El token de autenticación no es válido.');
            }

            toast.success('Inicio de sesión exitoso.');
            navigate('/');
        } catch {
            setFormError('No se pudo iniciar sesión. Verifica tus credenciales.');
            toast.error('No se pudo iniciar sesión. Verifica tus credenciales.');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <AuthLayout>
            <LoginForm
                form={form}
                formError={formError}
                fieldErrors={fieldErrors}
                isLoggingIn={isLoggingIn}
                onChange={handleChange}
                onLogin={handleLogin}
            />
        </AuthLayout>
    )
}