import type { LoginFormState } from "./authTypes";

export type FormErrors = Partial<Record<keyof LoginFormState, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginForm(form: LoginFormState): FormErrors {
    const errors: FormErrors = {};

    const email = form.email.trim();
    if(!email){
        errors.email = "El correo electrónico es obligatorio.";
    }else if(!EMAIL_PATTERN.test(email)){
        errors.email = "Ingrese un correo electrónico válido, por ejemplo: example@domain.com";
    }

    const password = form.password.trim();
    if(!password){
        errors.password = "La contraseña es obligatoria.";
    }else if(form.password.length < 6){
        errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }else if(form.password.length > 100){
        errors.password = "La contraseña no puede superar los 100 caracteres."; 
    }  

    return errors;
}