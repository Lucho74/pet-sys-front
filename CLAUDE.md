# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

"4 Patas" — sistema de gestión de turnos/salud para una veterinaria 24hs. Reemplaza fichas en papel; clientes reservan turnos y ven historial médico de sus mascotas. También maneja internación y cirugías.

Roles del dominio (aún sin auth implementada): **Cliente** (se registra, reserva turnos, ve sus mascotas e historial), **Administrador** (CRUD de veterinarios, horarios, suspende cuentas), **Veterinario** (crea/edita mascotas, agenda cirugías/internaciones, gestiona historial médico).

Este repo es solo el **frontend**: React 19 + TypeScript + Vite + React Router 7 + Tailwind CSS 4, con React Compiler habilitado vía `@rolldown/plugin-babel`. El backend vive en el repo separado `pet-sys-back` (.NET 8, Clean Architecture), corriendo en dev en `https://localhost:7140`, con Swagger en `/swagger`.

## Comandos

Gestor de paquetes: **npm**.

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
- `components/common/` — composiciones chicas hechas **solo con componentes de shadcn**, reutilizadas por todas las features:
  - `FormShell`: `Card` + `Alert` + `Spinner` + `Button`.
  - `FormField`: `Field` + `Input`. Con `type="password"` usa `InputGroup` y agrega el botón de ojo para mostrar u ocultar.
  - `SearchSelect`: combobox con `Popover` + `Command`.
  - `ListState`: `Spinner` / `Alert` / `Empty`.
  - `listStyles.ts`: `activeFirst` y las clases del header de las tablas.

  No hay más estilos propios de botones, campos ni tarjetas: se usan `Button`, `Input`, `Select`, `Card`, `Badge` y `Avatar` de `components/ui/`.
- `components/layout/` — `ScreenShell` (header + layout de pantalla; el texto chico sobre el título es el rol del usuario logueado, que calcula solo con `useAuth` + `ROLE_LABELS`, así que las páginas no lo pasan), `Sidebar` y `navigation.ts` (`NAV_ITEMS`).
- `services/<feature>/` — llamadas `fetch` a la API del backend y tipos de DTO.
- `router/` — definición de rutas (`createBrowserRouter`).
- `utils/` — helpers puros compartidos (`datetime`, `initials`, `search`, `errors`).

Hay tres features implementadas con el mismo patrón — `users`, `pets` y `consultations` — y es el que hay que replicar al agregar una nueva:
- `services/<feature>/I<Entity>.ts` — DTOs de request/response tal como los devuelve la API.
- `services/<feature>/<entity>Service.ts` — funciones `handleXxx` que llaman al backend. El cliente común es `services/apiClient.ts`: `apiFetch(path, options)` antepone la URL base (`https://localhost:7140/api`), agrega `Authorization: Bearer <token>` si hay token y `Content-Type: application/json` si hay body, y devuelve el `Response` sin procesar, así que cada service hace su `.json()`/`.text()`. Si la respuesta no es `ok`, `apiFetch` lee el `title` del body, lo traduce con `translateApiError` (`services/apiErrors.ts`, una tabla `[RegExp, string][]` con los títulos en inglés que manda el back) y lanza `ApiError` (`status` + mensaje en español, o `''` si el título no está en la tabla). Por eso los services **no** chequean `response.ok`: quedan como `return (await apiFetch(...)).json()`. En las páginas, los `catch` de guardar, cargar por id, suspender, reactivar y login arman el texto con `errorMessage(error, 'No se pudo …')` (`utils/errors.ts`), que devuelve el mensaje traducido o el genérico de la página (error de red, título desconocido: nunca se muestra inglés), y lo usan en el toast y en `formError`. Las cargas de las listas dejan su mensaje fijo, porque el back no devuelve ahí ningún título traducible. Un título nuevo del back se agrega a la tabla de `apiErrors.ts`. Todos los services usan `apiFetch`. Ninguno tiene que hacer `fetch` directo ni armar el header de auth a mano.
- `components/<feature>/<entity>Types.ts` — modelos de UI (distintos de los DTOs de la API), el `<Entity>FormState` del formulario, el tipo del outlet context y los `Record` de labels (`ROLE_LABELS`, ...).
- `components/<feature>/<entity>Validation.ts` — `validate<Entity>Form()` + el tipo `FormErrors`.
- `components/<feature>/<Entity>List.tsx`, `<Entity>Table.tsx` y `<Entity>Form.tsx` — presentación pura, todo por props.

Las listas de gestión (`users`, `pets`, `consultations`) son tablas, en todos los tamaños: `UserTable`, `PetTable` y `ConsultationTable`. No hay tarjetas ni ActionSheet. `UserList`/`ConsultationList` envuelven la tabla con `ListState` y el botón de crear de mobile. `PetsListPage` arma ese envoltorio directo en la página, porque `PetList` (tarjetas) quedó solo para `MyPetsPage`. Las tres tablas son copias con el mismo esqueleto, sin un componente genérico, para que cada una se lea sola. Los estilos compartidos están en `listStyles.ts`:
- Contenedor con sombra (`TABLE_CARD_CLASSES`).
- Encabezado `#27374D` con texto claro (`TABLE_HEADER_ROW_CLASSES`, `TABLE_HEAD_CLASSES`).
- Hover de fila (`TABLE_ROW_CLASSES`).
- `Avatar` de shadcn: oscuro (`bg-primary`) si está activo y gris si está suspendido, con las iniciales del nombre en usuarios y mascotas y el N° en consultas.
- `Badge variant="secondary"` para rol, especie y mascota.

Las filas suspendidas llevan fondo `#DDE6ED/30`. En mobile la barra de arriba se acomoda en varias líneas (`flex-wrap`) y la tabla tiene scroll horizontal (el `overflow-x-auto` del `Table` de shadcn). La tabla usa solo el `Table` de shadcn (`components/ui/table.tsx`), **sin TanStack Table**, por decisión del equipo. El estado está a mano con `useState`, escrito lo más simple posible:
- Búsqueda (`Input`) por descripción, mascota o veterinario, con `matchesSearch`.
- Orden al hacer click en el encabezado, que alterna ascendente y descendente.
- Filtros con `Select` de shadcn: rol en usuarios, y especie y raza en mascotas. Las opciones de mascotas salen de los datos cargados, y las razas dependen de la especie elegida.
- `Switch` "Mostrar suspendidas/os" (prendido por defecto) para ocultar las filas con `isDeleted`.
- Menú "Editar columnas" (`DropdownMenu`) para ocultar columnas.
- Paginado **del servidor**, de a 10. La página guarda `page` y `pageSize` (lo que pide) y `pagination` (`pageIndex`, `totalPages`, `hasNextPage` y `hasPreviousPage` tal cual los devuelve el back). La tabla los usa para el texto "Página X de Y" y para deshabilitar "Anterior"/"Siguiente", sin calcularlos en el front. La página pide `handleGetXxxPage(page, pageSize)` cada vez que cambia alguno de los dos y se los pasa a la tabla (`pagination`, `onPageChange`, `pageSize`, `onPageSizeChange`). Al pie hay un `Select` "Filas por página" con `PAGE_SIZE_OPTIONS` (10, 20, 50: 50 es el máximo del back), y cambiarlo vuelve a la página 1. La búsqueda, los filtros y el orden son del front y actúan solo sobre los 10 de la página actual: es una decisión del equipo, hasta que el back los soporte.

Las acciones van en un menú `···` (`DropdownMenu`) en cada fila:
- **Consultas:** "Editar consulta" (solo las activas).
- **Mascotas:** "Editar mascota" (solo las activas) y "Ver consultas".
- **Usuarios:** "Editar usuario" y "Suspender usuario" en los activos, "Reactivar usuario" en los suspendidos. El menú aparece solo si `canManage(role, user.roleName)`. Suspender confirma con un `AlertDialog` de shadcn dentro de `UserTable`. Las llamadas a la API (`handleDeleteUser`/`handleReactivateUser`) están en `UsersListPage`, que actualiza `isDeleted` en su estado.

Ya no existe "Ver dueño": llevaba a `/users/:id`, la ruta del ActionSheet de usuario, que se borró.

**Convención de nombres:** el nombre del export tiene que coincidir con el del archivo (`PetForm.tsx` → `export function PetForm`, con props `PetFormProps`). Nada de exports genéricos `Form`/`List` aunque el archivo esté dentro de la carpeta de la feature.

Para elegir una entidad relacionada dentro de un form (dueño de una mascota, veterinario/mascota de una consulta) el patrón es envolver el `SearchSelect` de `common/` en un componente `<Entity>Select` de la feature, que solo mapea la entidad a `{ id, primary, secondary }` y arma los textos. `SearchSelect` usa `Command` con `shouldFilter={false}` y filtra él mismo sobre `primary` a partir de `MIN_SEARCH_LENGTH` (2) caracteres, usando `matchesSearch` de `utils/search` (ignora mayúsculas y acentos), así que `primary` tiene que ser el campo por el que el usuario busca: DNI en `OwnerSelect`, nombre en `VeterinarianSelect`.

### Ruteo

`router/index.tsx` sí decide la pantalla: cada ruta apunta a su propia página. Ya no hay rutas hijas ni `<Outlet>` en las listas: las acciones están en el menú de cada fila de la tabla.

```
/users            → UsersListPage
/users/new        → UserCreatePage
/users/:id/edit   → UserEditPage
```

`pets` y `consultations` siguen la misma forma. El back no tiene borrado de mascotas ni de consultas: la única baja es suspender al cliente, que las suspende en cascada.

**Suspendidos (`isDeleted: true`)**: las listas los ordenan al final con `activeFirst()` y los marcan con un `Badge variant="outline"` "Suspendido". `activeFirst` vive en `listStyles.ts`. Son de solo lectura: el menú de la fila no ofrece editar. Las páginas de edit redirigen a la lista si lo cargado está suspendido.

Los forms tampoco ofrecen suspendidos: las páginas de create/edit filtran con `!isDeleted` a dueños, mascotas y veterinarios antes de pasarlos a los selects. La excepción es el veterinario en `ConsultationEditPage`: guarda `initialVeterinarianId` al cargar y lo deja en la lista aunque esté suspendido, porque el back acepta guardar una consulta con un veterinario suspendido solo si no se cambia.

Las páginas de create/edit quedan **fuera** de la ruta padre a propósito: son pantalla completa, no overlay.

Vistas del cliente (solo lectura, bajo un `RoleRoute` con `CLIENT_ROLES`, fuera del patrón CRUD):

```
/my-pets                          → MyPetsPage               (mascotas del cliente logueado, handleGetMyPets → GET api/Pet/me)
/my-pets/:petId/consultations     → MyPetConsultationsPage   (consultas de una mascota, handleGetConsultationsByPet → GET api/Consultation/pet/:petId)
```

`MyPetsPage` usa `PetList` (tarjetas), pasándole `itemTo` para que cada tarjeta navegue a las consultas de la mascota; `MyPetConsultationsPage` usa `ClientConsultationList`, una lista propia sin acciones.

`MyPetConsultationsPage` también se monta para los roles clínicos en `/pets/:petId/consultations` (pantalla completa, fuera del padre `pets`), a la que se llega con "Ver consultas" del menú de la tabla de mascotas. La página recibe `backTo` por prop desde el router (`/my-pets` o `/pets`) y, para el nombre del título, usa `handleGetMyPets` si el rol es cliente y `handleGetByIdPet` si no, en un pedido aparte del de las consultas (sin `Promise.all`): si falla, el título queda en "Consultas" y la lista se muestra igual.

`ListState` muestra un botón "Reintentar" en el estado de error, que recarga la página (así ninguna lista necesita su propio refetch).

### Estilado

Tailwind CSS 4 vía `@tailwindcss/vite`, con clases inline y una paleta de colores fija ya usada en toda la UI: `#27374D` (oscuro principal), `#526D82`, `#9DB2BF`, `#DDE6ED` (fondo claro). Mantener esta paleta al agregar pantallas nuevas para consistencia visual. Ojo con el contraste: `#526D82` como texto chico pasa AA sobre blanco (5.43:1) pero no sobre `#DDE6ED` (4.30:1); sobre ese fondo el texto va en `#27374D`.

Para botones, campos, etiquetas, avatares y tarjetas se usan los componentes de shadcn, con sus variantes:
- `Button`: `default`, `secondary` en el header oscuro, `outline` y `ghost`.
- `Badge`: `secondary` para rol, especie y mascota, `outline` para "Suspendido".

No se recopian strings de Tailwind para imitarlos. Las únicas clases compartidas que quedan son las del header de las tablas en `listStyles.ts`.

El layout es mobile-first con breakpoint `lg`: en mobile el botón de crear es una barra fija abajo (`<Button asChild size="lg"><Link>`, que renderiza el propio `List`), y en desktop va en el header (`<Button asChild variant="secondary"><Link>`, que la página pasa por la prop `action` de `ScreenShell`).

**shadcn/ui** (CLI v4, estilo `radix-nova`, config en `components.json`): los componentes se agregan con `npx shadcn@latest add <componente>` y quedan en `components/ui/` (hoy `button`, `table`, `input`, `dropdown-menu`, `switch`, `alert-dialog`, `select`, `badge`, `avatar`, `label`, `card`, `alert`, `spinner`, `empty`, `field`, `input-group`, `popover` y `command`, más sus dependencias `separator`, `textarea` y `dialog`). `command` instala `cmdk`: después de agregar un componente con dependencias nuevas hay que reiniciar `npm run dev`, si no Vite no las resuelve y la app queda en blanco; `cn` viene del paquete `cn` (reexportado en `lib/utils.ts`). Se importan con el alias `@/` (`paths` en `tsconfig.json`/`tsconfig.app.json` + `resolve.tsconfigPaths` en Vite). **Sin `baseUrl`**: con TypeScript 6 está deprecado y rompe `tsc -b`, aunque la guía de shadcn lo pida. Los tokens (`--primary`, `--border`, ...) de `index.css` están mapeados a la paleta de arriba, no hay modo oscuro y no se pisan los `--radius-*` (así `rounded-xl` y los demás conservan la escala de Tailwind). ESLint desactiva `react-refresh/only-export-components` solo en `components/ui/`. `Sidebar`/`ScreenShell` siguen siendo propios: el `Sidebar` de shadcn es demasiado grande para un menú de 4 links.

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
- Listados paginados (PR #44 del back, 2026-11-05): `GET api/User`, `api/Pet` y `api/Consultation` reciben `?pageIndex=` (desde 1) y `&pageSize=` (máximo 50, si no da 400). Devuelven `{ items, pageIndex, totalPages, hasNextPage, hasPreviousPage }` (`IPaginatedResponse<T>` en `services/IPaginated.ts`). Ya no existe un endpoint que devuelva todo. Los services exponen:
  - `handleGetUsersPage` / `handleGetPetsPage` / `handleGetConsultationsPage`, para las tablas.
  - `handleGetAllUser` / `handleGetAllPet`, que recorren todas las páginas de a 50 con `fetchAllPages`. Los usan los selects de los forms y los nombres de mascota y veterinario de `ConsultationListPage`, que se piden una sola vez, aparte de la página de consultas.
  - Sin registros, `items` viene vacío y `totalPages` en 0.

**NO implementado todavía (no bloquear el front asumiendo que existen):**
- Auth: ya hay login y logout con JWT. `AuthenticationContextProvider` guarda el token en `localStorage` bajo la clave `TOKEN_KEY` (`'pet-sys-token'`, definida en `utils/auth.ts`). `apiFetch` lee el token con esa misma constante y, si una request con token responde 401, lo borra y manda a `/login` (el back rechaza los tokens de usuarios suspendidos aunque no hayan vencido). El contexto expone `role` (`UserRole | null`): el provider llama a `/me` cada vez que cambia el token y guarda `roleName`, y vale `null` sin sesión o mientras `/me` no respondió. El filtrado por rol ya está en el front: `router/RoleRoute.tsx` recibe `allowedRoles` y redirige a `/` si el rol no está incluido (o devuelve `null` mientras `role` es `null`), y cada `NavItem` de `navigation.ts` declara `roles` opcional (`getVisibleNavItems(role)` filtra el menú). Los grupos de roles viven en `utils/roles.ts` (`ADMIN_ROLES = ['SysAdmin', 'Admin']`, `CLINICAL_ROLES = [...ADMIN_ROLES, 'Veterinarian']`, `CLIENT_ROLES = ['Client']`), y tanto rutas como menú tienen que usar esas mismas constantes. `users`, `pets` y `consultations` están bajo un único `RoleRoute` con `CLINICAL_ROLES`. Qué usuarios puede gestionar cada rol lo decide `getManageableRoles(role)` (también en `utils/roles.ts`): `SysAdmin` → `Client`/`Veterinarian`/`Admin`, `Admin` → `Client`/`Veterinarian`, veterinario → solo `Client` (espeja la matriz del back, que responde 403 fuera de ella). `UserForm` recibe esas opciones por la prop obligatoria `roleOptions`, `UserEditPage` redirige a `/users` si el usuario cargado tiene un rol fuera de esa lista, y para el resto de las acciones se usa `canManage(role, targetRole)` (mismo archivo): en `UsersListPage` las filas que no se pueden gestionar no muestran el menú `···` (`UserTable` recibe `canManageUser(user)`). Esto incluye la propia fila del usuario logueado: el back no deja que nadie se edite, suspenda ni reactive a sí mismo. La lista de usuarios **no** se filtra por rol en el front. En el backend el veterinario tiene los mismos permisos que el admin; el límite "solo clientes" es una decisión del front. `UserRole` incluye además `SysAdmin`, que no es asignable desde el form (`AssignableRole`).
- Administración de veterinarios: `Admin`/`Veterinarian` existen como roles, pero sin endpoints propios ni filtro por rol en la API. El front pide **todos** los usuarios con `handleGetAllUser()` y filtra en cliente por `roleName` dentro de la página (`=== 'Veterinarian'` en las de consultas, `=== 'Client'` en las de mascotas, más `!isDeleted`); los componentes `VeterinarianSelect`/`OwnerSelect` reciben la lista ya filtrada por props. Si el backend agrega un filtro por rol, el cambio va en las páginas, no en los selects.
- Horarios/agenda: `Consultation` tiene `date` (día, sin hora) pero no hay slots ni disponibilidad.
- Cirugías/internaciones: sin decidir cómo se modelan (¿campo `Type` en `Consultation` o entidades separadas?).
- Historial médico como tal: hoy solo existe la lista de consultas (el cliente la ve por mascota en `/my-pets/:petId/consultations`).

**Convención de errores** (para el manejo de errores del front): 404 si el recurso no existe, 400 para input inválido o referencias cruzadas rotas (ej. `clientId` de una mascota que no existe), 401/403 para auth y permisos. El body es `{ "title": "<mensaje en inglés>" }` (`Web/ExceptionHandling/AppExceptionHandler.cs`), que `apiFetch` traduce con `apiErrors.ts`. El login con credenciales incorrectas da 401: por eso `apiFetch` no cierra la sesión ante un 401 de `/Authentication/authenticate`. Las validaciones de modelo (`[Required]`, `[StringLength]`, `[EmailAddress]`, `[Phone]`, etc.) también devuelven 400 automático antes de llegar al controller — conviene espejar esas mismas restricciones en las validaciones de los formularios del front (largo de strings, formato de email/teléfono, password mínimo 6 caracteres, etc.).

**Otros detalles:** CORS todavía no configurado en el backend — hay que pedir que se habilite antes de integrar de verdad. No hay ambiente de staging/prod documentado, solo local (`https://localhost:7140`).

## Política de git

- Nunca agregar a Claude como co-autor ni ningún tipo de atribución/crédito a Claude en los mensajes de commit.
- Siempre pedir confirmación antes de hacer `git push`.
