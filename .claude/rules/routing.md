---
paths:
  - "src/pages/**"
  - "src/middleware/**"
  - "src/layouts/**"
  - "src/router/**"
---

# Routing

- Routes are file-based. A file in `src/pages/` is a route, so do not register routes in router config.
- URLs are constants. Add each route's URL to `paths` in `src/router/paths.ts` (for example `paths.dashboard.root = '/dashboard'`) and use it with `navigateTo(paths.x)` or `<NuxtLink :to="paths.x">`. Never write raw URL strings for navigation. Keep the URL in `paths` identical to the page file's path.
- Page files stay thin. They import the module page and call `definePageMeta({ title, ... })`.
- Guards are route middleware in `src/middleware/`:
  - `auth.global.ts` runs on every route. It redirects unauthenticated users unless the route is public or has no `meta.requiresAuth`.
  - `permission.ts` is a named middleware. Attach it with `definePageMeta({ middleware: ['permission'], permission: 'admin.create' })`. It also reads `meta.permissionOperator` (`'or'` or `'and'`).
- Layouts are `src/layouts/default.vue` and `auth.vue`. Pick one with `definePageMeta({ layout: 'auth' })`.
- Error pages are `access-denied.vue`, `internal-server-error.vue`, `no-internet.vue`, and the catch-all `[...all].vue`. Their URLs are `paths.errors.*`, and the API client navigates to them on 403 and 500.
