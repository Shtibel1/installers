# Installers — Field-Service Dispatch Client (Angular)

Hebrew, right-to-left Angular 14 + Angular Material web client used by back-office staff to
dispatch installation jobs to field installers, manage the product catalog, and maintain
per-installer pricing matrices. It is the front end for
[InstallersApi2](https://github.com/Shtibel1/InstallersApi2), a multi-tenant ASP.NET Core 8 API.

## Features

- **Assignment board** (`/`) — list of installation jobs with status workflow
  (`חדש` → `תואם התקנה` → `הותקן`), customer details, assigned installer and threaded comments.
- **Assignment editor** (`/manage-assignment`) — create or update a job, with nested
  customer and comments sub-forms and a reusable product picker.
- **Installers** (`/installers`, `/installers/:id`) — create installer accounts and view
  installer details.
- **Pricing matrix** (`/installers/:id/prices`) — per-installer, per-product price lists
  with an effective date (`startFromDate`) covering installation, inner floor, outer floor
  and carry charges.
- **Products** (`/products`) — catalog management grouped by category.
- **Auth** (`/auth`) — username/password login with role-based sign-up
  (`Employee`, `ServiceProvider`, `Storekeeper`).

## Architecture

```
src/app
├── components/        feature screens (assignments, installers, products, auth, side-nav)
│   └── common/        shared building blocks (base component, Israeli phone input)
├── shared/            reusable widgets (select-product)
└── core/
    ├── services/      typed HTTP services built on an abstract BaseService
    ├── models/        domain interfaces + DTOs (Assignment, Installer, InstallerPricing, …)
    ├── guards/        AuthGuard — redirects unauthenticated users to /auth
    ├── interceptors/  AuthInterceptor — attaches `Authorization: Bearer <token>`
    ├── directives/    valueKeyAccessor — binds object values to inputs by a display key
    ├── common/        Hebrew MatPaginator labels, form error matcher
    └── enums/         Role, Status
```

### Key design decisions

- **`BaseService` abstraction** — every resource service (`AssignmentsService`,
  `ProductsService`, `WorkersService`, …) extends one generic base that owns the API
  base URL and exposes typed `get/post/put/patch/delete<TRes, TReq>` helpers, so each
  service only declares its resource path.
- **Reactive client-side cache** — services keep the latest collection in a
  `BehaviorSubject` (for example `assignmentsChain`). Create, update and delete calls
  update that stream in place, so every subscribed screen re-renders without refetching.
- **Partial updates via JSON Patch** — status and field changes on an assignment are sent
  as an RFC 6902 document (`Content-Type: application/json-patch+json`) instead of a full PUT.
- **Session handling** — `AuthService` exposes `user$`, persists the session to
  `localStorage`, restores it on startup (`autoLogin`) and maps API errors
  (400/401/500) to Hebrew user-facing messages.
- **RTL and localization** — Material theme in `theme.scss`, a custom
  `MatPaginatorIntl` with Hebrew range labels, and Hebrew status values.

## Getting started

Requirements: Node.js 16+ and npm.

```bash
npm install
npm start          # ng serve on http://localhost:4200
npm run build      # production build to dist/
npm test           # Karma + Jasmine unit tests
```

The API base URL is set in `src/environments/environment.ts` (development, defaults to
`http://localhost:8123/`) and `environment.prod.ts` (production). Run
[InstallersApi2](https://github.com/Shtibel1/InstallersApi2) locally, or point
`baseApiUrl` at a deployed instance.

## Tech stack

Angular 14 · Angular Material / CDK · RxJS 7 · TypeScript 4.7 · SCSS · Karma / Jasmine

## Roadmap

- Move the auth interceptor to a single `user$` subscription instead of subscribing per request.
- Centralize HTTP error handling in `BaseService` (the commented-out `handleError` stub).
- Upgrade to standalone components and the current Angular / Material versions.
