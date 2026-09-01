# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"4 Patas" — sistema de gestión de turnos/salud para una veterinaria 24hs. Reemplaza fichas en papel; clientes reservan turnos y ven historial médico de sus mascotas. También maneja internación y cirugías.

Roles del dominio (aún sin auth implementada): **Cliente** (se registra, reserva turnos, ve sus mascotas e historial), **Administrador** (CRUD de veterinarios, horarios, suspende cuentas), **Veterinario** (crea/edita mascotas, agenda cirugías/internaciones, gestiona historial médico).

Este repo es solo el **frontend**: React 19 + TypeScript + Vite + React Router 7 + Tailwind CSS 4, con React Compiler habilitado vía `@rolldown/plugin-babel`. El backend vive en el repo separado `pet-sys-back` (.NET 8, Clean Architecture), corriendo en dev en `https://localhost:7140`, con Swagger en `/swagger`.

## Comandos

Gestor de paquetes: **npm** (hay un `pnpm-lock.yaml` residual del commit inicial que ya no se usa — `node_modules` tiene layout de npm).

- `npm install`
- `npm run dev` — levanta el dev server de Vite
- `npm run build` — `tsc -b && vite build`
- `npm run lint` — ESLint (`eslint .`)
- `npm run preview` — sirve el build de producción localmente

No hay suite de tests configurada todavía en este repo.

## Arquitectura

### Estructura por feature

`src/` se organiza así:
- `pages/<feature>/` — una página por pantalla, montada directo por el router: `<Entity>ListPage`, `<Entity>CreatePage`, `<Entity>EditPage`, `<Entity>ActionsPage`, `<Entity>DeletePage`. **No hay un hook `use<Feature>Crud` centralizado** — cada página maneja su propio `useState`/`useEffect` y llama directo al service (ver `PetCreatePage.tsx` como ejemplo canónico).
- `components/<feature>/` — `types.ts` (modelo de dominio + `<Entity>FormState` + `<Feature>OutletContext`, este último para pasarle datos del list page a las rutas hijas vía `Outlet` context de React Router), `validation.ts` (función pura `validate<Entity>Form(form): FormErrors`), `Form.tsx` (presentación, envuelve `FormShell`), `List.tsx`.
- `components/common/` — kit de UI compartido entre features: `FormShell.tsx` (envoltorio de formulario con grid 2 columnas en `sm+`, error inline, botones cancelar/guardar), `FormField.tsx` + `fieldStyles.ts` (input controlado con label/error/`autoComplete`), `ListState.tsx` (loading/error/empty state de listas), `buttonStyles.ts` (`PRIMARY_BUTTON_CLASSES`, `SECONDARY_BUTTON_CLASSES`, `GHOST_BUTTON_CLASSES`). Reusar esto en vez de repetir clases Tailwind sueltas.
- `components/layout/` — `Sidebar.tsx` (nav fija con los ítems de `navigation.ts`, sin filtrado por rol ni por auth — se muestra siempre) y `ScreenShell.tsx` (header de página: props `eyebrow`/`title`/`icon`/`backTo`/`homeTo`/`action`).
- `services/<feature>/` — `I<Entity>.ts` (DTOs) + `<entity>Service.ts` (funciones `handleXxx` con `fetch` directo). Sigue sin haber cliente HTTP centralizado ni manejo de auth/token — cada función de cada feature repite `fetch('https://localhost:7140/api/...')` hardcodeado, y no hay ningún `.env` en el repo.
- `router/` — definición de rutas (`createBrowserRouter`).
- `utils/` — helpers puros compartidos.

Features existentes hoy siguiendo este patrón: `users`, `pets`, `consultations`.

### Ruteo

`router/index.tsx` ya **no** usa el hack viejo de "todas las rutas renderizan el mismo elemento y un hook parsea el pathname" (eso quedó obsoleto). Cada ruta tiene su propio elemento, con este patrón repetido por feature:
```
{ path: '<feature>', element: <FeatureListPage />, children: [
    { path: ':id', element: <FeatureActionsPage /> },
    { path: ':id/delete', element: <FeatureDeletePage /> },
]},
{ path: '<feature>/new', element: <FeatureCreatePage /> },
{ path: '<feature>/:id/edit', element: <FeatureEditPage /> },
```
El list page le pasa sus datos a las rutas hijas (`:id`, `:id/delete`) vía `Outlet` context (tipado como `<Feature>OutletContext` en `components/<feature>/types.ts`), no vía un hook central.

Nota: hay una duplicación pre-existente de las entradas `pets/new` y `pets/:id/edit` en `router/index.tsx` — no parece intencional; si se toca el router de `pets` conviene limpiarla.

`/login` (`pages/LoginPage.tsx`) es la única ruta que **no** cuelga de `{ path: '/', element: <App /> }` — está como hermana de nivel superior en `router/index.tsx` para no heredar el `Sidebar`/chrome de la app.

`App.tsx` ya no es un `Outlet` pelado: ahora arma el layout global (`Sidebar` + `<main>` + `Outlet` + `ToastContainer` de `react-toastify`). Sigue sin existir ningún guard de auth, ruta protegida o concepto de "usuario actual" — todas las rutas son accesibles sin loguearse.

### Estilado

Tailwind CSS 4 vía `@tailwindcss/vite`, con una paleta de colores fija: `#27374D` (oscuro principal), `#526D82`, `#9DB2BF`, `#DDE6ED` (fondo claro), y para estados de error `#c0392b` (borde/texto) y `#f5c2c7`/`#fff5f5`/`#7a1d1d` (fondo/texto en `ListState`). Mantener esta paleta al agregar pantallas nuevas. Los estilos de botones e inputs están centralizados en `components/common/buttonStyles.ts` y `fieldStyles.ts` — reusar esas constantes en vez de repetir clases sueltas. `src/design/Sysadmin Users.dc.html` es un export/mockup de diseño, no código de la app.

Feedback (toasts): la convención es mostrar **siempre los dos canales juntos** en errores de guardado — `toast.error(...)` de `react-toastify` (montado una vez en `App.tsx`) *además* del error inline que ya renderiza `FormShell`/`FormField`, nunca uno en vez del otro. Éxito solo lleva `toast.success(...)` (la página navega enseguida).

### Dependencias relevantes

Se agregaron `react-toastify` (toasts) y `lucide-react` (íconos) desde el snapshot original. Sigue sin haber cliente HTTP centralizado, librería de forms/validación (la validación es a mano por feature en `validation.ts`), librería de state management, ni manejo de variables de entorno (`.env`).

### Feature `auth` (login)

`auth` no sigue el patrón CRUD de `pets`/`consultations`/`users` porque es una sola pantalla: `services/auth/{IAuth.ts,authService.ts}` + `components/auth/{types.ts,validation.ts,LoginForm.tsx}` + `pages/LoginPage.tsx` (estado local, sin hook dedicado, mismo estilo que `PetCreatePage.tsx`). `LoginForm` reusa `FormField`/`buttonStyles` de `components/common/` pero **no** usa `FormShell` (ese fuerza un botón "Cancelar" que no aplica pre-login).

El backend todavía no tiene login (ver sección de backend más abajo), así que `authService.ts` apunta a un contrato **asumido**: `POST /api/Auth/login` con `{ email, password }` → `200 { token }`. Ajustar ahí (y en `IAuth.ts`) el día que el contrato real esté definido. El token se guarda en `localStorage` (`authToken`) y navega a `/` en éxito; **no hay route guards ni protección de otras rutas todavía** — cualquier ruta sigue siendo accesible sin loguearse.

### Roles: no confundir con auth

`UserRole` (`'Client' | 'Veterinarian' | 'Admin'`) vive en `services/users/IUser.ts` y es un **campo de dominio del User** (con un campo DNI condicional en el form cuando el rol es `Client`) — no es un mecanismo de autorización/permisos. No hay roles de auth ni control de acceso todavía en ningún lado del front.

### TypeScript

`verbatimModuleSyntax` está activo (`tsconfig.app.json`) — los imports de solo-tipos deben usar `import type`.

## Contexto del backend (`pet-sys-back`, repo separado)

Snapshot al 2026-08-18. El backend se va a seguir expandiendo — verificar contra `/swagger` o el repo real antes de asumir que algo de esto sigue vigente, sobre todo lo marcado como "no implementado".

**Implementado hoy:**
- `api/user` — CRUD completo. `POST` recibe `CreateUserDTO { fullName, email, phone, password }`; `PUT` recibe `UserDTO { id, fullName, email, phone, password?, isDeleted }`. `User` usa soft-delete (`isDeleted`), no hay delete físico visible al front.
- `api/pet` — CRUD completo. `POST` recibe `CreatePetDTO { name, specie, breed, birthDate, clientId }`; `PUT` recibe `PetDTO { id, name, specie, breed, birthDate, clientId }`. `Pet.birthDate` es `DateOnly` (`yyyy-MM-dd`, sin hora).
- IDs siempre `int`.

**NO implementado todavía (no bloquear el front asumiendo que existen):**
- Auth: no hay login/JWT real. Se planea JWT + hashing vía ASP.NET Identity, pero hoy el password se guarda tal cual se manda. El front ya tiene una pantalla de login (`/login`, ver "Feature `auth`" arriba) construida contra un contrato asumido (`POST /api/Auth/login`) — verificar y ajustar cuando el endpoint real exista.
- Turnos (`Consultation`): la entidad y el repo existen en el dominio, pero no hay service ni controller — sin endpoint todavía.
- Administración de veterinarios: `Admin`/`Veterinarian` existen como roles en el modelo, pero sin endpoints propios ni diferenciación real en la API.
- Cirugías/internaciones: sin decidir cómo se modelan (¿campo `Type` en `Consultation` o entidades separadas?).

**Convención de errores** (para el manejo de errores del front): 404 si el recurso no existe, 400 para input inválido o referencias cruzadas rotas (ej. `clientId` de una mascota que no existe), body en formato `ProblemDetails` estándar de ASP.NET. Las validaciones de modelo (`[Required]`, `[StringLength]`, `[EmailAddress]`, `[Phone]`, etc.) también devuelven 400 automático antes de llegar al controller — conviene espejar esas mismas restricciones en las validaciones de los formularios del front (largo de strings, formato de email/teléfono, password mínimo 6 caracteres, etc.).

**Otros detalles:** CORS todavía no configurado en el backend — hay que pedir que se habilite antes de integrar de verdad. No hay ambiente de staging/prod documentado, solo local (`https://localhost:7140`).

## Política de git

- Nunca agregar a Claude como co-autor ni ningún tipo de atribución/crédito a Claude en los mensajes de commit.
- Siempre pedir confirmación antes de hacer `git push`.
