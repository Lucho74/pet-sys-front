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

El patrón se ve completo en `users/`, y es el que hay que replicar al agregar features nuevas (ej. `pets`):
- `services/<feature>/I<Entity>.ts` — DTOs de request/response tal como los devuelve la API.
- `services/<feature>/<entity>Service.ts` — funciones `handleXxx` que hacen `fetch` directo contra el backend. No hay cliente HTTP centralizado ni manejo de auth/token todavía — cada feature repite el boilerplate de `fetch`.
- `components/<feature>/types.ts` — modelos de UI (distintos de los DTOs de la API; ver mapeo abajo).
- `components/<feature>/use<Feature>Crud.ts` — hook que concentra estado, mapeo DTO↔UI y navegación de toda la feature.
- Componentes de presentación puros (`List`, `Form`, `ActionSheet`, `DeleteDialog`, ...) que reciben todo por props, sin fetch propio.
- Un componente contenedor (`<Feature>Management.tsx`) que arma el layout y conecta el hook con los componentes de presentación.

### Ruteo real de las pantallas de `users`

Ojo con esto: las rutas `/users`, `/users/new`, `/users/:id`, `/users/:id/edit`, `/users/:id/delete` en `router/index.tsx` **todas** renderizan el mismo elemento (`Home` → `UserManagement`). El router no decide qué pantalla mostrar. En su lugar, `useUsersCrud.ts` parsea `location.pathname` manualmente para derivar `screen` (`list`/`create`/`edit`) y si hay que mostrar el `ActionSheet` o el `DeleteDialog` como overlay. Cualquier cambio a la navegación de usuarios (o de una feature nueva que copie este patrón) tiene que tocar esa lógica de parsing en el hook, no solo el router.

### Estilado

Tailwind CSS 4 vía `@tailwindcss/vite`, con clases inline y una paleta de colores fija ya usada en toda la UI de usuarios: `#27374D` (oscuro principal), `#526D82`, `#9DB2BF`, `#DDE6ED` (fondo claro). Mantener esta paleta al agregar pantallas nuevas para consistencia visual. `src/design/Sysadmin Users.dc.html` es un export/mockup de diseño, no código de la app.

### TypeScript

`verbatimModuleSyntax` está activo (`tsconfig.app.json`) — los imports de solo-tipos deben usar `import type`.

## Contexto del backend (`pet-sys-back`, repo separado)

Snapshot al 2026-08-18. El backend se va a seguir expandiendo — verificar contra `/swagger` o el repo real antes de asumir que algo de esto sigue vigente, sobre todo lo marcado como "no implementado".

**Implementado hoy:**
- `api/user` — CRUD completo. `POST` recibe `CreateUserDTO { fullName, email, phone, password }`; `PUT` recibe `UserDTO { id, fullName, email, phone, password?, isDeleted }`. `User` usa soft-delete (`isDeleted`), no hay delete físico visible al front.
- `api/pet` — CRUD completo. `POST` recibe `CreatePetDTO { name, specie, breed, birthDate, clientId }`; `PUT` recibe `PetDTO { id, name, specie, breed, birthDate, clientId }`. `Pet.birthDate` es `DateOnly` (`yyyy-MM-dd`, sin hora).
- IDs siempre `int`.

**NO implementado todavía (no bloquear el front asumiendo que existen):**
- Auth: no hay login/JWT. Se planea JWT + hashing vía ASP.NET Identity, pero hoy el password se guarda tal cual se manda.
- Turnos (`Consultation`): la entidad y el repo existen en el dominio, pero no hay service ni controller — sin endpoint todavía.
- Administración de veterinarios: `Admin`/`Veterinarian` existen como roles en el modelo, pero sin endpoints propios ni diferenciación real en la API.
- Cirugías/internaciones: sin decidir cómo se modelan (¿campo `Type` en `Consultation` o entidades separadas?).

**Convención de errores** (para el manejo de errores del front): 404 si el recurso no existe, 400 para input inválido o referencias cruzadas rotas (ej. `clientId` de una mascota que no existe), body en formato `ProblemDetails` estándar de ASP.NET. Las validaciones de modelo (`[Required]`, `[StringLength]`, `[EmailAddress]`, `[Phone]`, etc.) también devuelven 400 automático antes de llegar al controller — conviene espejar esas mismas restricciones en las validaciones de los formularios del front (largo de strings, formato de email/teléfono, password mínimo 6 caracteres, etc.).

**Otros detalles:** CORS todavía no configurado en el backend — hay que pedir que se habilite antes de integrar de verdad. No hay ambiente de staging/prod documentado, solo local (`https://localhost:7140`).

## Política de git

- Nunca agregar a Claude como co-autor ni ningún tipo de atribución/crédito a Claude en los mensajes de commit.
- Siempre pedir confirmación antes de hacer `git push`.
