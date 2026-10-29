---
paths:
  - "src/stores/permissions.ts"
  - "src/middleware/**"
  - "src/pages/**"
  - "**/*.vue"
---

# Permissions

- Permissions are `resource.action` strings, for example `admin.create`.
- Use `usePermissionStore()` (auto-imported from `src/stores/permissions.ts`) and call `can('resource.action')`. Do not re-parse permission strings by hand.
- `can()` takes an optional operator for multiple permissions: `can(['a.list', 'b.list'], 'and')`. The default is `'or'`.
- Templates hide or disable controls with `v-if="can('...')"`. Keep the UI safe when `can` is false.
- Protect routes too, not only buttons. In the page file, set `definePageMeta({ middleware: ['permission'], permission: 'admin.create' })`. The `permission` middleware redirects to `paths.errors.accessDenied`.
- Known gap: the store's `permissions` is a fixed stub (`admin: ['list']`), and the link to the authenticated user's role is commented out in `src/stores/permissions.ts`. Treat it as a placeholder until that is wired.
