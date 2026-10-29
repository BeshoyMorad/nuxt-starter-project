---
paths:
  - "src/stores/**"
  - "src/modules/**/stores/**"
  - "src/composables/**"
  - "src/plugins/**"
---

# State management

- **Pinia** (`@pinia/nuxt`) holds client, session, and UI state only:
  - Auth in `src/stores/auth.ts`: access and refresh tokens and the user, persisted with `useCookie` so the server can read them during SSR.
  - Permissions in `src/stores/permissions.ts`.
  - Module UI state in `src/modules/<feature>/stores/`, for example `starterStore`.
- **Vue Query** owns all API-backed state: lists, details, mutations, and infinite queries. `src/plugins/vue-query.ts` creates the client, dehydrates it on the server, and hydrates it on the client.
- Do not copy API entity data into Pinia. Read it through a query in a composable.
- Keep storage keys as constants, as `auth.ts` does.
- Use `useCookie` for anything the server must read. Do not use `localStorage` for it, because it does not exist during SSR.
- Local component state uses `ref` and `computed`. Share state across components with a store, or with `useState` when it must survive SSR hydration.
- Keep module-level state out of composables and plugins unless it is created per request. Shared module state leaks between requests on the server.
