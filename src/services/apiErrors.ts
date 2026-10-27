// Títulos que devuelve el back (`Web/ExceptionHandling/AppExceptionHandler.cs`), en inglés.
const TRANSLATIONS: [RegExp, string][] = [
    [/^Invalid email or password\.$/, 'Email o contraseña incorrectos.'],
    [/^A user with email .+ already exists\.$/, 'Ya existe un usuario con ese email.'],
    [/^Role .+ cannot manage users of role .+\.$/, 'No tenés permiso para gestionar usuarios de ese rol.'],
    [/^User with id .+ was not found\.$/, 'El usuario no existe.'],
    [/^User with id .+ is suspended\.$/, 'El usuario está suspendido. Reactivalo para editarlo.'],
    [/^Dni is required for clients\.$/, 'El DNI es obligatorio para los clientes.'],
    [/^ClientId does not reference an existing client\.$/, 'El dueño elegido no existe.'],
    [/^Client with id .+ is suspended\.$/, 'El dueño elegido está suspendido.'],
    [/^Pet with id .+ belongs to a suspended client\.$/, 'La mascota pertenece a un cliente suspendido.'],
    [/^Pet with id .+ was not found\.$/, 'La mascota no existe.'],
    [/^PetId does not reference an existing pet\.$/, 'La mascota elegida no existe.'],
    [/^VeterinarianId does not reference an existing veterinarian\.$/, 'El veterinario elegido no existe.'],
    [/^Veterinarian with id .+ is suspended\.$/, 'El veterinario elegido está suspendido.'],
    [/^Consultation with id .+ belongs to a suspended client\.$/, 'La consulta pertenece a un cliente suspendido.'],
    [/^Consultation with id .+ was not found\.$/, 'La consulta no existe.'],
    [/^One or more validation errors occurred\.$/, 'Revisá los datos ingresados.'],
];

/** Devuelve '' si el título no está en la tabla, para que la página use su mensaje genérico. */
export function translateApiError(title: string): string {
    return TRANSLATIONS.find(([pattern]) => pattern.test(title))?.[1] ?? '';
}
