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
- `pages/<feature>/` — una página por pantalla, montada por el router. Acá vive el estado, el fetch y el mapeo DTO↔UI.
- `components/<feature>/` — componentes de presentación de la feature (ej. `components/users/`), sin fetch propio.
- `components/common/` — piezas reutilizadas por todas las features: `FormShell`, `FormField`, `SelectField`, `SearchSelect`, `ListState`, `CreateButton`, `ActionSheet`, `DeleteDialog`, más los módulos de clases Tailwind compartidas (`buttonStyles.ts`, `fieldStyles.ts`, `listStyles.ts`).
- `components/layout/` — `ScreenShell` (header + layout de pantalla), `Sidebar` y `navigation.ts` (`NAV_ITEMS`).
- `services/<feature>/` — llamadas `fetch` a la API del backend y tipos de DTO.
- `router/` — definición de rutas (`createBrowserRouter`).
- `hooks/` — hooks genéricos compartidos (hoy solo `useEscapeKey`, que usan `ActionSheet` y `DeleteDialog` para cerrarse con Esc).
- `utils/` — helpers puros compartidos (`datetime`, `initials`, `search`).

Hay tres features implementadas con el mismo patrón — `users`, `pets` y `consultations` — y es el que hay que replicar al agregar una nueva:
- `services/<feature>/I<Entity>.ts` — DTOs de request/response tal como los devuelve la API.
- `services/<feature>/<entity>Service.ts` — funciones `handleXxx` que hacen `fetch` directo contra el backend. No hay cliente HTTP centralizado ni manejo de auth/token todavía — cada feature repite el boilerplate de `fetch`.
- `components/<feature>/<entity>Types.ts` — modelos de UI (distintos de los DTOs de la API), el `<Entity>FormState` del formulario, el tipo del outlet context y los `Record` de labels (`ROLE_LABELS`, `STATUS_LABELS`, ...).
- `components/<feature>/<entity>Validation.ts` — `validate<Entity>Form()` + el tipo `FormErrors`.
- `components/<feature>/<Entity>List.tsx` y `<Entity>Form.tsx` — presentación pura, todo por props.

**Convención de nombres:** el nombre del export tiene que coincidir con el del archivo (`PetForm.tsx` → `export function PetForm`, con props `PetFormProps`). Nada de exports genéricos `Form`/`List` aunque el archivo esté dentro de la carpeta de la feature.

Para elegir una entidad relacionada dentro de un form (dueño de una mascota, veterinario/mascota de una consulta) el patrón es envolver el `SearchSelect` de `common/` en un componente `<Entity>Select` de la feature, que solo mapea la entidad a `{ id, primary, secondary }` y arma los textos. `SearchSelect` filtra localmente sobre `primary` a partir de `MIN_SEARCH_LENGTH` (2) caracteres, usando `matchesSearch` de `utils/search` (ignora mayúsculas y acentos), así que `primary` tiene que ser el campo por el que el usuario busca: DNI en `OwnerSelect`, nombre en `VeterinarianSelect`.

### Ruteo

`router/index.tsx` sí decide la pantalla: cada ruta apunta a su propia página. La lista es una ruta padre y los overlays son rutas hijas que se renderizan en su `<Outlet>`:

```
/users            → UsersListPage        (padre)
  /users/:id        → UserActionsPage      (ActionSheet sobre la lista)
  /users/:id/delete → UserDeletePage       (DeleteDialog sobre la lista)
/users/new        → UserCreatePage       (pantalla completa, fuera del padre)
/users/:id/edit   → UserEditPage         (pantalla completa, fuera del padre)
```

`pets` y `consultations` siguen exactamente la misma forma. La página de lista pasa los datos ya cargados y un `remove<Entity>` a los hijos vía `<Outlet context={...}>`, y los hijos lo leen con `useOutletContext<<Entity>OutletContext>()` — así el ActionSheet y el DeleteDialog no vuelven a pedir la entidad a la API. Como el hijo depende de esos datos, hace `return null` si no encuentra el id en la lista.

Las páginas de create/edit quedan **fuera** de la ruta padre a propósito: son pantalla completa, no overlay.

### Estilado

Tailwind CSS 4 vía `@tailwindcss/vite`, con clases inline y una paleta de colores fija ya usada en toda la UI: `#27374D` (oscuro principal), `#526D82`, `#9DB2BF`, `#DDE6ED` (fondo claro). Mantener esta paleta al agregar pantallas nuevas para consistencia visual.

Las combinaciones de clases que se repiten están extraídas en `components/common/*Styles.ts` (`PRIMARY_BUTTON_CLASSES`, `CARD_CLASSES`, `GRID_CLASSES`, `FIELD_LABEL_CLASSES`, ...) — usar esas constantes en vez de recopiar los strings de Tailwind.

El layout es mobile-first con breakpoint `lg`: en mobile el botón de crear es una barra fija abajo (`CreateButton variant="bar"`, que renderiza el propio `List`) y en desktop va en el header (`variant="header"`, que lo pasa la página vía la prop `action` de `ScreenShell`).

Íconos: `lucide-react`. Notificaciones: `react-toastify` (`toast.error(...)` en los `catch` de fetch, además del estado `error` que se muestra inline en la lista).

`src/design/Sysadmin Users.dc.html` es un export/mockup de diseño, no código de la app.

### TypeScript

`verbatimModuleSyntax` está activo (`tsconfig.app.json`) — los imports de solo-tipos deben usar `import type`.

## Contexto del backend (`pet-sys-back`, repo separado)

Snapshot al 2026-09-08. Los contratos de abajo son los que el front consume hoy (fuente: los `I<Entity>.ts` de `services/`); el backend se va a seguir expandiendo — verificar contra `/swagger` o el repo real antes de asumir que algo de esto sigue vigente, sobre todo lo marcado como "no implementado".

**Implementado hoy** (endpoints en PascalCase: `api/User`, `api/Pet`, `api/Consultation`):
- `api/User` — CRUD completo. `POST` recibe `{ fullName, email, phone, password, userType, dni }`; `PUT` recibe `{ fullName, email, phone, password, roleName, dni }`. Ojo con la asimetría: **el create manda `userType` y el update manda `roleName`**, con los mismos valores (`'Client' | 'Veterinarian' | 'Admin'`). La respuesta trae `roleName`. `dni` solo aplica a `Client` (el form lo muestra únicamente para ese rol). `User` usa soft-delete (`isDeleted`), no hay delete físico visible al front.
- `api/Pet` — CRUD completo. Create y update comparten el mismo shape (`IPetRequest`): `{ name, specie, breed, birthDate, clientId }`. `birthDate` es `DateOnly` (`yyyy-MM-dd`, sin hora).
- `api/Consultation` — CRUD completo. `POST` recibe `{ description, date, petId, veterinarianId }` (sin `status`: las consultas nuevas nacen como `Pending`, por eso el form las crea con `canChangeStatus={false}`); `PUT` recibe lo mismo más `status` (`'Pending' | 'Completed' | 'Cancelled'`).
- IDs siempre `int`.
- `GET` de lista devuelve `404` cuando no hay registros — los `handleGetAll*` lo traducen a `[]` en vez de tirar error. Mantener ese manejo al agregar features.

**NO implementado todavía (no bloquear el front asumiendo que existen):**
- Auth: no hay login/JWT. Se planea JWT + hashing vía ASP.NET Identity, pero hoy el password se guarda tal cual se manda. Como no hay sesión, el front no filtra por usuario: todas las pantallas son de administración.
- Administración de veterinarios: `Admin`/`Veterinarian` existen como roles, pero sin endpoints propios ni filtro por rol en la API. El front pide **todos** los usuarios con `handleGetAllUser()` y filtra en cliente por `roleName` dentro de la página (`=== 'Veterinarian'` en las de consultas, `=== 'Client'` en las de mascotas); los componentes `VeterinarianSelect`/`OwnerSelect` reciben la lista ya filtrada por props. Si el backend agrega un filtro por rol, el cambio va en las páginas, no en los selects.
- Horarios/agenda: `Consultation` tiene `date` (día, sin hora) pero no hay slots ni disponibilidad.
- Cirugías/internaciones: sin decidir cómo se modelan (¿campo `Type` en `Consultation` o entidades separadas?).
- Historial médico como tal: hoy solo existe la lista de consultas.

**Convención de errores** (para el manejo de errores del front): 404 si el recurso no existe, 400 para input inválido o referencias cruzadas rotas (ej. `clientId` de una mascota que no existe), body en formato `ProblemDetails` estándar de ASP.NET. Las validaciones de modelo (`[Required]`, `[StringLength]`, `[EmailAddress]`, `[Phone]`, etc.) también devuelven 400 automático antes de llegar al controller — conviene espejar esas mismas restricciones en las validaciones de los formularios del front (largo de strings, formato de email/teléfono, password mínimo 6 caracteres, etc.).

**Otros detalles:** CORS todavía no configurado en el backend — hay que pedir que se habilite antes de integrar de verdad. No hay ambiente de staging/prod documentado, solo local (`https://localhost:7140`).

## Política de git

- Nunca agregar a Claude como co-autor ni ningún tipo de atribución/crédito a Claude en los mensajes de commit.
- Siempre pedir confirmación antes de hacer `git push`.
