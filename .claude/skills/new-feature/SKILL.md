---
name: new-feature
description: Scaffold a new feature (thin page in src/pages, module code in src/modules/<feature>/, paths, service, composable, schema, locales). Use when asked to add a screen, section, or business feature.
---

# New feature (Nuxt)

Look at `src/modules/auth/`, `src/modules/starter/`, and an existing `src/pages/` file first and mirror them. Everything must be SSR-safe.

1. **Module code.** Create only the folders you need under `src/modules/<feature>/`: `pages/`, `components/`, `composables/`, `services/index.ts`, `schemas/<name>.schema.ts`, `stores/`, `types.ts`.
2. **Route.** Routes are file-based. Add a thin file in `src/pages/` that imports the module page and calls `definePageMeta({ title, ... })`. Add the URL to `src/router/paths.ts` (identical to the file's path). Gated pages: `definePageMeta({ middleware: ['permission'], permission: 'resource.action' })`. Pick a layout with `layout: 'auth'` only for auth screens.
3. **Data.** Use the `add-endpoint` skill for every API call. No `fetch` with hardcoded URLs (the `examples/` pages are demos).
4. **Page.** Wrap content in `PageWrapper`. Lists use `Table`/`InfiniteScrollTable` with `useDataTable`/`useDataInfiniteScroll`. Forms follow the forms rule.
5. **Text.** Use the `add-translation` skill (en and ar, then `pnpm locales:types`).
6. **Test ids.** Add keys to `src/lib/test-ids.ts` and bind `:data-test-id`.
7. **SSR check.** No `window`/`document`/`localStorage` at module scope or the root of `<script setup>`; client-only code goes in `onMounted`, `import.meta.client`, or a `*.client.ts` plugin. Auth values use `useCookie`.
8. **Tests.** Add specs for composables, services, and schemas (remember plain Vitest has no Nuxt auto-imports). Then run the `verify` skill.

Do not add anything to `src/modules/doc/` or `src/pages/examples/`.
