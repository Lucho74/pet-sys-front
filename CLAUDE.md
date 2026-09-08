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
- `pages/` — componentes de página de alto nivel, montados por el router.
- `components/<feature>/` — UI y hooks de una feature (ej. `components/users/`).
- `services/<feature>/` — llamadas `fetch` a la API del backend y tipos de DTO.
- `router/` — definición de rutas (`createBrowserRouter`).
- `utils/` — helpers puros compartidos.

El patrón se ve completo en `users/` (y se replica en `pets/` y `consultation/`), y es el que hay que seguir al agregar features nuevas:
- `services/<feature>/I<Entity>.ts` — DTOs de request/response tal como los devuelve la API.
- `services/<feature>/<entity>Service.ts` — funciones `handleXxx` que hacen `fetch` directo contra el backend. No hay cliente HTTP centralizado ni manejo de auth/token todavía — cada feature repite el boilerplate de `fetch`.
- `components/<feature>/<entity>Types.ts` — modelos de UI (distintos de los DTOs de la API) más constantes derivadas (ej. `ROLE_LABELS` en `userTypes.ts`) y el tipo de `UsersOutletContext` que comparten las rutas hijas.
- `components/<feature>/<entity>Validation.ts` — validación de formulario en el front, pensada para espejar las restricciones del modelo del backend (ver convención de errores más abajo).
- Componentes de presentación puros por feature (`List`, `Form`, ...) que reciben todo por props, sin fetch propio, construidos sobre los bloques compartidos de `components/common/` (`FormShell`, `FormField`, `SelectField`, `SearchSelect`, `ListState`, `ActionSheet`, `DeleteDialog`, `CreateButton`).
- **No hay hook `use<Feature>Crud` ni componente `<Feature>Management` centralizador** — cada pantalla es una página independiente en `pages/<feature>/` que hace su propio fetch, con estado local (`useState`/`useEffect`) para loading/error/formulario. Ver ruteo abajo.

### Ruteo real de las pantallas de `users` (y `pets`, `consultations`, que siguen el mismo esquema)

El router (`router/index.tsx`) usa rutas anidadas reales, no una pantalla única que parsea `pathname`:
- `users` (`UsersListPage`) es la ruta padre: hace el fetch de la lista y expone `{ users, removeUser }` vía `<Outlet context={...}>` a sus rutas hijas.
  - `users/:id` (`UserActionsPage`) — lee `users` del outlet context con `useOutletContext` y muestra el `ActionSheet` como overlay sobre la lista.
  - `users/:id/delete` (`UserDeletePage`) — mismo mecanismo, muestra el `DeleteDialog`, hace el `fetch` de borrado y llama a `removeUser` del contexto.
- `users/new` (`UserCreatePage`) y `users/:id/edit` (`UserEditPage`) son rutas top-level independientes (no hijas de `users`), con su propio `useState` de formulario y su propio `handleSave`.

Al tocar la navegación de una de estas features hay que editar las rutas en `router/index.tsx` directamente — no existe lógica de parsing manual de `location.pathname` en ningún hook.

### Estilado

Tailwind CSS 4 vía `@tailwindcss/vite`, con clases inline y una paleta de colores fija ya usada en toda la UI de usuarios: `#27374D` (oscuro principal), `#526D82`, `#9DB2BF`, `#DDE6ED` (fondo claro). Mantener esta paleta al agregar pantallas nuevas para consistencia visual. `src/design/Sysadmin Users.dc.html` es un export/mockup de diseño, no código de la app.

### TypeScript

`verbatimModuleSyntax` está activo (`tsconfig.app.json`) — los imports de solo-tipos deben usar `import type`.

## Contexto del backend (`pet-sys-back`, repo separado)

Snapshot al 2026-09-06 (ver `src/services/*/I*.ts` para los tipos exactos que asume hoy el front — son la fuente de verdad más reciente si esto vuelve a desalinearse). El backend se va a seguir expandiendo — verificar contra `/swagger` o el repo real antes de asumir que algo de esto sigue vigente, sobre todo lo marcado como "no implementado".

**Implementado hoy:**
- `api/User` — CRUD completo. `POST` recibe `ICreateUserRequest { fullName, email, phone, password, userType, dni }` (`userType: 'Client' | 'Veterinarian' | 'Admin'`); `PUT` recibe `IUpdateUserRequest { fullName, email, phone, password, roleName, dni }`. La respuesta (`IUserResponse`) agrega `id`, `isDeleted`, `roleName`, `dni`. `User` usa soft-delete (`isDeleted`), no hay delete físico visible al front.
- `api/Pet` — CRUD completo. `POST`/`PUT` reciben `IPetRequest { name, specie, breed, birthDate, clientId }`; la respuesta agrega `id`. `Pet.birthDate` es `DateOnly` (`yyyy-MM-dd`, sin hora).
- `api/Consultation` — CRUD completo (ya no es "sin endpoint"). `POST` recibe `ICreateConsultationRequest { description, date, petId, veterinarianId }`; `PUT` recibe `IUpdateConsultationRequest { description, date, status, petId, veterinarianId }` con `status: 'Pending' | 'Completed' | 'Cancelled'`; la respuesta agrega `id`.
- IDs siempre `int`.

**NO implementado todavía (no bloquear el front asumiendo que existen):**
- Auth: no hay login/JWT. Se planea JWT + hashing vía ASP.NET Identity, pero hoy el password se guarda tal cual se manda.
- Administración de veterinarios: `Admin`/`Veterinarian` ya son valores de rol en el `User` (`userType`/`roleName`), pero sin endpoints propios de gestión ni diferenciación de permisos real en la API.
- Cirugías/internaciones: sin decidir cómo se modelan (¿campo en `Consultation` o entidades separadas?) — `Consultation` hoy solo cubre turnos comunes.

**Convención de errores** (para el manejo de errores del front): 404 si el recurso no existe, 400 para input inválido o referencias cruzadas rotas (ej. `clientId` de una mascota que no existe), body en formato `ProblemDetails` estándar de ASP.NET. Las validaciones de modelo (`[Required]`, `[StringLength]`, `[EmailAddress]`, `[Phone]`, etc.) también devuelven 400 automático antes de llegar al controller — conviene espejar esas mismas restricciones en las validaciones de los formularios del front (largo de strings, formato de email/teléfono, password mínimo 6 caracteres, etc.).

**Otros detalles:** CORS todavía no configurado en el backend — hay que pedir que se habilite antes de integrar de verdad. No hay ambiente de staging/prod documentado, solo local (`https://localhost:7140`).

## Política de git

- Nunca agregar a Claude como co-autor ni ningún tipo de atribución/crédito a Claude en los mensajes de commit.
- Siempre pedir confirmación antes de hacer `git push`.
