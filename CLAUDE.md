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
- `components/common/` — piezas reutilizadas por todas las features: `FormShell`, `FormField` (con `type="password"` agrega solo el botón de ojo para mostrar/ocultar), `SelectField`, `SearchSelect`, `ListState`, `CreateButton`, `ActionSheet`, `SuspendDialog`, más los módulos de clases Tailwind compartidas (`buttonStyles.ts`, `fieldStyles.ts`, `listStyles.ts`).
- `components/layout/` — `ScreenShell` (header + layout de pantalla; el texto chico sobre el título es el rol del usuario logueado, que calcula solo con `useAuth` + `ROLE_LABELS`, así que las páginas no lo pasan), `Sidebar` y `navigation.ts` (`NAV_ITEMS`).
- `services/<feature>/` — llamadas `fetch` a la API del backend y tipos de DTO.
- `router/` — definición de rutas (`createBrowserRouter`).
- `hooks/` — hooks genéricos compartidos (hoy solo `useEscapeKey`, que usan `ActionSheet` y `SuspendDialog` para cerrarse con Esc). El foco inicial de esos overlays va con `autoFocus` en el botón, no con `useEffect` + `ref`.
- `utils/` — helpers puros compartidos (`datetime`, `initials`, `search`, `errors`).

Hay tres features implementadas con el mismo patrón — `users`, `pets` y `consultations` — y es el que hay que replicar al agregar una nueva:
- `services/<feature>/I<Entity>.ts` — DTOs de request/response tal como los devuelve la API.
- `services/<feature>/<entity>Service.ts` — funciones `handleXxx` que llaman al backend. El cliente común es `services/apiClient.ts`: `apiFetch(path, options)` antepone la URL base (`https://localhost:7140/api`), agrega `Authorization: Bearer <token>` si hay token y `Content-Type: application/json` si hay body, y devuelve el `Response` sin procesar, así que cada service hace su `.json()`/`.text()`. Si la respuesta no es `ok`, `apiFetch` lee el `title` del body, lo traduce con `translateApiError` (`services/apiErrors.ts`, una tabla `[RegExp, string][]` con los títulos en inglés que manda el back) y lanza `ApiError` (`status` + mensaje en español, o `''` si el título no está en la tabla). Por eso los services **no** chequean `response.ok`: quedan como `return (await apiFetch(...)).json()`. En las páginas, los `catch` de guardar, cargar por id, suspender, reactivar y login arman el texto con `errorMessage(error, 'No se pudo …')` (`utils/errors.ts`), que devuelve el mensaje traducido o el genérico de la página (error de red, título desconocido: nunca se muestra inglés), y lo usan en el toast y en `formError`. Las cargas de las listas dejan su mensaje fijo, porque el back no devuelve ahí ningún título traducible. Un título nuevo del back se agrega a la tabla de `apiErrors.ts`. Todos los services usan `apiFetch`. Ninguno tiene que hacer `fetch` directo ni armar el header de auth a mano.
- `components/<feature>/<entity>Types.ts` — modelos de UI (distintos de los DTOs de la API), el `<Entity>FormState` del formulario, el tipo del outlet context y los `Record` de labels (`ROLE_LABELS`, ...).
- `components/<feature>/<entity>Validation.ts` — `validate<Entity>Form()` + el tipo `FormErrors`.
- `components/<feature>/<Entity>List.tsx` y `<Entity>Form.tsx` — presentación pura, todo por props.

**Convención de nombres:** el nombre del export tiene que coincidir con el del archivo (`PetForm.tsx` → `export function PetForm`, con props `PetFormProps`). Nada de exports genéricos `Form`/`List` aunque el archivo esté dentro de la carpeta de la feature.

Para elegir una entidad relacionada dentro de un form (dueño de una mascota, veterinario/mascota de una consulta) el patrón es envolver el `SearchSelect` de `common/` en un componente `<Entity>Select` de la feature, que solo mapea la entidad a `{ id, primary, secondary }` y arma los textos. `SearchSelect` filtra localmente sobre `primary` a partir de `MIN_SEARCH_LENGTH` (2) caracteres, usando `matchesSearch` de `utils/search` (ignora mayúsculas y acentos), así que `primary` tiene que ser el campo por el que el usuario busca: DNI en `OwnerSelect`, nombre en `VeterinarianSelect`.

### Ruteo

`router/index.tsx` sí decide la pantalla: cada ruta apunta a su propia página. La lista es una ruta padre y los overlays son rutas hijas que se renderizan en su `<Outlet>`:

```
/users            → UsersListPage        (padre)
  /users/:id        → UserActionsPage      (ActionSheet sobre la lista)
  /users/:id/delete → UserDeletePage       (SuspendDialog sobre la lista)
/users/new        → UserCreatePage       (pantalla completa, fuera del padre)
/users/:id/edit   → UserEditPage         (pantalla completa, fuera del padre)
```

`pets` y `consultations` siguen la misma forma, pero **sin** la ruta `:id/delete`: el back no tiene borrado de mascotas ni de consultas (la única baja es suspender al cliente, que las suspende en cascada). La página de lista pasa los datos ya cargados a los hijos vía `<Outlet context={...}>`, y los hijos lo leen con `useOutletContext<<Entity>OutletContext>()` — así el ActionSheet y el SuspendDialog no vuelven a pedir la entidad a la API. Como el hijo depende de esos datos, hace `return null` si no encuentra el id en la lista. `PetsOutletContext`/`ConsultationsOutletContext` solo tienen la lista; el de `users` suma `setUserDeleted(id, isDeleted)`, porque suspender es soft-delete y el usuario sigue en la lista. `SuspendDialog` (solo lo usa `UserDeletePage`) tiene los textos de suspender fijos: título, aviso de la cascada y botón "Suspender".

**Suspendidos (`isDeleted: true`)**: las tres listas los ordenan al final con `activeFirst()` y los pintan con `DELETED_CARD_CLASSES` + badge "Suspendido" (`DELETED_BADGE_CLASSES`), todo en `listStyles.ts`. Son de solo lectura: el `ActionSheet` (con `onDelete` opcional y `isDeleted` para repetir el encabezado gris de la tarjeta) muestra un único botón: "Reactivar usuario" para usuarios y "Ver dueño" (`/users/:clientId`) para mascotas y consultas. Las páginas de edit redirigen a la lista si lo cargado está suspendido.

Las páginas de create/edit quedan **fuera** de la ruta padre a propósito: son pantalla completa, no overlay.

Vistas del cliente (solo lectura, bajo un `RoleRoute` con `CLIENT_ROLES`, fuera del patrón CRUD):

```
/my-pets                          → MyPetsPage               (mascotas del cliente logueado, handleGetMyPets → GET api/Pet/me)
/my-pets/:petId/consultations     → MyPetConsultationsPage   (consultas de una mascota, handleGetConsultationsByPet → GET api/Consultation/pet/:petId)
```

`MyPetsPage` reusa `PetList` pasándole `itemTo` para que cada ítem navegue a las consultas en vez de abrir el ActionSheet; `MyPetConsultationsPage` usa `ClientConsultationList`, una lista propia sin acciones.

`MyPetConsultationsPage` también se monta para los roles clínicos en `/pets/:petId/consultations` (pantalla completa, fuera del padre `pets`), a la que se llega con el botón "Ver consultas" del ActionSheet de mascotas. La página recibe `backTo` por prop desde el router (`/my-pets` o `/pets`) y, para el nombre del título, usa `handleGetMyPets` si el rol es cliente y `handleGetByIdPet` si no, en un pedido aparte del de las consultas (sin `Promise.all`): si falla, el título queda en "Consultas" y la lista se muestra igual. `ActionSheet` acepta `extraActions?: { label, onClick }[]`, botones secundarios opcionales entre editar y suspender, y `avatar?` para el cuadro de la izquierda (por defecto las iniciales del título; las consultas pasan su id, como en la tarjeta).

### Estilado

Tailwind CSS 4 vía `@tailwindcss/vite`, con clases inline y una paleta de colores fija ya usada en toda la UI: `#27374D` (oscuro principal), `#526D82`, `#9DB2BF`, `#DDE6ED` (fondo claro). Mantener esta paleta al agregar pantallas nuevas para consistencia visual. Ojo con el contraste: `#526D82` como texto chico pasa AA sobre blanco (5.43:1) pero no sobre `#DDE6ED` (4.30:1); sobre ese fondo el texto va en `#27374D`.

Las combinaciones de clases que se repiten están extraídas en `components/common/*Styles.ts` (`PRIMARY_BUTTON_CLASSES`, `CARD_CLASSES`, `GRID_CLASSES`, `FIELD_LABEL_CLASSES`, ...) — usar esas constantes en vez de recopiar los strings de Tailwind.

El layout es mobile-first con breakpoint `lg`: en mobile el botón de crear es una barra fija abajo (`CreateButton variant="bar"`, que renderiza el propio `List`) y en desktop va en el header (`variant="header"`, que lo pasa la página vía la prop `action` de `ScreenShell`).

Íconos: `lucide-react`. Notificaciones: `react-toastify` (`toast.error(...)` en los `catch` de fetch, además del estado `error` que se muestra inline en la lista).

`src/design/Sysadmin Users.dc.html` es un export/mockup de diseño, no código de la app.

### TypeScript

`verbatimModuleSyntax` está activo (`tsconfig.app.json`) — los imports de solo-tipos deben usar `import type`.

## Contexto del backend (`pet-sys-back`, repo separado)

Snapshot al 2026-09-08. Los contratos de abajo son los que el front consume hoy (fuente: los `I<Entity>.ts` de `services/`); el backend se va a seguir expandiendo — verificar contra `/swagger` o el repo real antes de asumir que algo de esto sigue vigente, sobre todo lo marcado como "no implementado".

**Implementado hoy** (endpoints en PascalCase: `api/User`, `api/Pet`, `api/Consultation`):
- `api/User` — CRUD completo. `POST` recibe `{ fullName, email, phone, password, userType, dni }`; `PUT` recibe `{ fullName, email, phone, password, dni }`: **el rol nunca cambia después de crear el usuario**, por eso el update no lo manda y el form de edición pasa `canChangeRole={false}`. La respuesta trae `roleName` y ya no trae `password`. En el `PUT` la password es opcional: `null` conserva la actual y `''` da 400 por el mínimo de 6, así que `UserEditPage` arranca con el campo vacío, valida con `validateUserForm(form, true)` y manda `null` si queda vacío. `dni` solo aplica a `Client` (el form lo muestra únicamente para ese rol). `User` usa soft-delete (`isDeleted`), no hay delete físico visible al front. `POST api/User/{id}/reactivate` lo revierte (`handleReactivateUser`). Suspender un cliente marca en cascada `isDeleted` en sus mascotas y las consultas de esas mascotas (rama `feature/soft-delete-cascade-main` del back, sin mergear al 2026-10-26).
- `api/Pet` — CRUD completo. Create y update comparten el mismo shape (`IPetRequest`): `{ name, specie, breed, birthDate, clientId }`. `birthDate` es `DateOnly` (`yyyy-MM-dd`, sin hora). La respuesta suma `isDeleted` (igual que `Consultation`). `DELETE api/Pet/{id}` y `DELETE api/Consultation/{id}` ya no existen (405): el front no tiene borrado de mascotas ni de consultas.
- `api/Pet/me` — `GET` con las mascotas del cliente logueado (`handleGetMyPets`).
- `api/Consultation` — CRUD completo. `POST` y `PUT` reciben el mismo shape: `{ description, date, petId, veterinarianId }`. Las consultas ya **no** tienen `status` (el back lo sacó). `GET api/Consultation/pet/{petId}` devuelve las consultas de una mascota (`handleGetConsultationsByPet`).
- Auth (`services/auth/authService.ts`): `POST api/Authentication/authenticate` recibe `{ email, password }` y devuelve el JWT como texto plano, no como JSON (`HandleLogin`). `GET api/User/me` devuelve el usuario logueado como `IUserResponse`, con `roleName` incluido (`handleGetCurrentUser`).
- IDs siempre `int`.
- `GET` de lista devuelve `200` con `[]` cuando no hay registros (antes era `404`; ya no hace falta traducirlo en los services).

**NO implementado todavía (no bloquear el front asumiendo que existen):**
- Auth: ya hay login y logout con JWT. `AuthenticationContextProvider` guarda el token en `localStorage` bajo la clave `TOKEN_KEY` (`'pet-sys-token'`, definida en `utils/auth.ts`). `apiFetch` lee el token con esa misma constante y, si una request con token responde 401, lo borra y manda a `/login` (el back rechaza los tokens de usuarios suspendidos aunque no hayan vencido). El contexto expone `role` (`UserRole | null`): el provider llama a `/me` cada vez que cambia el token y guarda `roleName`, y vale `null` sin sesión o mientras `/me` no respondió. El filtrado por rol ya está en el front: `router/RoleRoute.tsx` recibe `allowedRoles` y redirige a `/` si el rol no está incluido (o devuelve `null` mientras `role` es `null`), y cada `NavItem` de `navigation.ts` declara `roles` opcional (`getVisibleNavItems(role)` filtra el menú). Los grupos de roles viven en `utils/roles.ts` (`ADMIN_ROLES = ['SysAdmin', 'Admin']`, `CLINICAL_ROLES = [...ADMIN_ROLES, 'Veterinarian']`, `CLIENT_ROLES = ['Client']`), y tanto rutas como menú tienen que usar esas mismas constantes. `users`, `pets` y `consultations` están bajo un único `RoleRoute` con `CLINICAL_ROLES`. Qué usuarios puede gestionar cada rol lo decide `getManageableRoles(role)` (también en `utils/roles.ts`): `SysAdmin` → `Client`/`Veterinarian`/`Admin`, `Admin` → `Client`/`Veterinarian`, veterinario → solo `Client` (espeja la matriz del back, que responde 403 fuera de ella). `UserForm` recibe esas opciones por la prop obligatoria `roleOptions`, `UserEditPage` redirige a `/users` si el usuario cargado tiene un rol fuera de esa lista, y para el resto de las acciones se usa `canManage(role, targetRole)` (mismo archivo): en `UsersListPage` las filas que no se pueden gestionar no son link (`UserList` recibe `itemTo(user)` que devuelve `string | null`, y con `null` pinta la tarjeta como `div` sin hover ni foco), y `UserActionsPage`/`UserDeletePage` devuelven `null` si se entra por URL. Esto incluye la propia fila del usuario logueado: el back no deja que nadie se edite, suspenda ni reactive a sí mismo. La lista de usuarios **no** se filtra por rol en el front. En el backend el veterinario tiene los mismos permisos que el admin; el límite "solo clientes" es una decisión del front. `UserRole` incluye además `SysAdmin`, que no es asignable desde el form (`AssignableRole`).
- Administración de veterinarios: `Admin`/`Veterinarian` existen como roles, pero sin endpoints propios ni filtro por rol en la API. El front pide **todos** los usuarios con `handleGetAllUser()` y filtra en cliente por `roleName` dentro de la página (`=== 'Veterinarian'` en las de consultas, `=== 'Client'` en las de mascotas); los componentes `VeterinarianSelect`/`OwnerSelect` reciben la lista ya filtrada por props. Si el backend agrega un filtro por rol, el cambio va en las páginas, no en los selects.
- Horarios/agenda: `Consultation` tiene `date` (día, sin hora) pero no hay slots ni disponibilidad.
- Cirugías/internaciones: sin decidir cómo se modelan (¿campo `Type` en `Consultation` o entidades separadas?).
- Historial médico como tal: hoy solo existe la lista de consultas (el cliente la ve por mascota en `/my-pets/:petId/consultations`).

**Convención de errores** (para el manejo de errores del front): 404 si el recurso no existe, 400 para input inválido o referencias cruzadas rotas (ej. `clientId` de una mascota que no existe), 401/403 para auth y permisos. El body es `{ "title": "<mensaje en inglés>" }` (`Web/ExceptionHandling/AppExceptionHandler.cs`), que `apiFetch` traduce con `apiErrors.ts`. El login con credenciales incorrectas da 401: por eso `apiFetch` no cierra la sesión ante un 401 de `/Authentication/authenticate`. Las validaciones de modelo (`[Required]`, `[StringLength]`, `[EmailAddress]`, `[Phone]`, etc.) también devuelven 400 automático antes de llegar al controller — conviene espejar esas mismas restricciones en las validaciones de los formularios del front (largo de strings, formato de email/teléfono, password mínimo 6 caracteres, etc.).

**Otros detalles:** CORS todavía no configurado en el backend — hay que pedir que se habilite antes de integrar de verdad. No hay ambiente de staging/prod documentado, solo local (`https://localhost:7140`).

## Política de git

- Nunca agregar a Claude como co-autor ni ningún tipo de atribución/crédito a Claude en los mensajes de commit.
- Siempre pedir confirmación antes de hacer `git push`.
