import { FormField } from '../common/FormField';
import type { LoginFormState } from './authTypes';
import type { FormErrors } from './loginValidation';

interface LoginFormProps {
    form: LoginFormState;
    formError: string;
    fieldErrors: FormErrors;
    isLoggingIn: boolean;
    onChange: (field: keyof LoginFormState, value: string) => void;
    onLogin: () => void;
}

export function LoginForm({
    form,
    formError  ,
    fieldErrors,
    isLoggingIn = false,
    onChange,
    onLogin,
}: LoginFormProps) {
    return (
        <section className="w-full max-w-[490px] rounded-3xl bg-white px-8 py-8 shadow-[0_12px_40px_rgba(39,55,77,0.12)] sm:px-14">
            <header className="mb-7 text-center">
            <h1 className="text-3xl font-medium text-[#27374D]">
                Iniciar sesión
            </h1>
            <p className="mt-2 text-sm text-[#526D82]">
                Completá el inicio de sesión para acceder.
            </p>
            </header>

            <form
            noValidate
            onSubmit={(event) => {
                event.preventDefault();
                onLogin();
            }}
            className="grid gap-6"
            >
            <FormField
                label="Email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(value) => onChange('email', value)}
                error={fieldErrors.email}
                disabled={isLoggingIn}
            />

            <FormField
                label="Contraseña"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={(value) => onChange('password', value)}
                error={fieldErrors.password}
                disabled={isLoggingIn}
            />

            {formError ? (
                <p role="alert" className="text-center text-sm text-red-700">
                {formError}
                </p>
            ) : null}

            <button
                type="submit"
                disabled={isLoggingIn}
                className="mx-auto mt-1 min-w-[147px] rounded-[18px] bg-[#536FBA] px-8 py-2.5 text-lg text-white transition-colors hover:bg-[#435FA9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#536FBA] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isLoggingIn ? 'Ingresando...' : 'Ingresar'}
            </button>
            </form>

        </section>
    )
}