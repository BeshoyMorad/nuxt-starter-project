# Nuxt Migration Report

Branch: `feat/nuxt-migration` (from `main` at `72a1857`)

This report has two parts. **Part 1** is the plan, written before any code changed.
**Part 2** records what was actually done, what was verified, and what is left.

---

## Part 1 — Plan

### 1. Starting point (measured on `main` before any change)

| Check | Result on `main` |
| --- | --- |
| `vite build` | **Fails** — `modules/assets` imports `ErrorAlert`, which does not exist |
| `vue-tsc` (app tsconfig) | **118 errors** — mostly `modules/assets` and `modules/tokenization`, which import files that are not in this repo (`@/types/network`, `@/modules/vaults/*`, `@/modules/fees/*`, `@/utils/format-status`) |
| `npm run type-check` | Passes, but only because the root `tsconfig.json` has `"files": []`, so it checks nothing |
| `vitest run` | 12 of 17 tests fail — Node 25 ships its own `localStorage` global, which shadows jsdom's |
| `eslint .` | 0 errors, 93 warnings |

The `assets` and `tokenization` modules were copied from another project and never finished here.
The migration moves them but does not rewrite them. They stay excluded from routing until their
missing dependencies exist.

### 2. Target stack

- **Nuxt 4** with the default `app/` source directory.
- **Rendering mode: SPA (`ssr: false`)**. Auth tokens live in `localStorage` and many composables
  touch `window`/`navigator`. Turning on SSR would change auth to cookies, which is a product
  decision, not a migration step. Code touched during the migration is made SSR-safe where it is
  cheap (guards on `window`, `navigator`, `document`), so enabling SSR later is a smaller step.
- Official Nuxt modules replace hand-written wiring:
  - `@pinia/nuxt` + `pinia-plugin-persistedstate/nuxt` replace `createPinia()` in `main.ts`.
  - `@nuxtjs/i18n` replaces the hand-built `createI18n` instance, lazy loader, and `<html dir/lang>` code.
  - `@nuxt/test-utils` replaces the plain Vitest setup.
- Tailwind v4 stays on `@tailwindcss/vite`, registered through `nuxt.config.ts`.
- TanStack Query, dayjs, and the global error handler move into Nuxt plugins.

### 3. File-by-file mapping

| Vue + Vite (before) | Nuxt (after) |
| --- | --- |
| `index.html` (title, favicon, theme script) | `nuxt.config.ts` → `app.head` |
| `src/main.ts` | `app/plugins/*.ts` (one plugin per concern) |
| `src/App.vue` | `app/app.vue` (`<NuxtLayout><NuxtPage/></NuxtLayout>`) |
| `src/router/index.ts` route table | File-based routes in `app/pages/**` with `definePageMeta` |
| `src/router/guards/*.ts` | `app/middleware/auth.ts`, `app/middleware/guest.ts` |
| `router.beforeEach` offline check | `app/middleware/network.global.ts` |
| `router.afterEach` document title | `useHead` in `app/app.vue` |
| `router.onError` chunk reload | Removed — Nuxt reloads on chunk errors by default |
| `src/router/paths.ts` | `app/constants/route-names.ts` (same `paths` object, still the single source of route names) |
| `src/layouts/AppLayout.vue`, `AuthLayout.vue` | `app/layouts/default.vue`, `app/layouts/auth.vue` |
| `src/modules/**` | `app/features/**` (renamed so it is not confused with Nuxt's own `modules/` directory) |
| `src/modules/**/pages/*.vue` | Moved into `app/pages/**`; each feature keeps its constants, components, and locales |
| `src/pages/errors/*.vue` | `app/pages/access-denied.vue`, `internal-server-error.vue`, `no-internet.vue`, `[...slug].vue` |
| `src/config/env.ts` (`import.meta.env.VITE_*`) | `runtimeConfig.public` in `nuxt.config.ts`, validated by `app/config/env.ts` |
| `src/locales/*` | `i18n/locales/*` (Nuxt i18n layout) + `i18n/i18n.config.ts` for number/date formats |
| `src/css/*` | `app/assets/css/*` |
| `vite.config.ts`, `tsconfig.*.json`, `server.js` | `nuxt.config.ts`, Nuxt-generated tsconfigs, Nitro output (`node .output/server/index.mjs`) |
| `.env` `VITE_API_BASE_URL` | `NUXT_PUBLIC_API_BASE_URL` |

Code that imported the router singleton outside components (`lib/api/client.ts`, `stores/auth.ts`,
`composables/useNetwork.ts`, `composables/useAuthRedirect.ts`) switches to `navigateTo()` and
`useRouter()`. The Axios interceptors are installed from a Nuxt plugin so they run inside the Nuxt
app context.

### 4. Type organisation rules

The rule for every type in the codebase:

1. **Shared types go in `app/types/`**, one file per domain. A type counts as shared when more
   than one file uses it, or when it is part of a public contract: API response shapes, composable
   options and return types, util option objects, and props option items that callers build.
2. **A type stays inside a component** only when that component (or its own folder) is the only
   thing that will ever use it. Examples: `Props` and `Emits` interfaces, the editor `ToolbarItem`.
3. **Feature types go in the feature's own `types.ts`.** Types scattered in a feature's schemas,
   constants, utils, and pages are pulled into that one file.
4. **No ambient globals.** `ApiResponse`, `Meta`, `CanPermission`, and similar types are
   currently declared with `declare global`, so they appear everywhere without an import. They
   become normal exports and every user imports them with `import type`. Library augmentation
   (`@tanstack/vue-table` `ColumnMeta`, `vue-i18n` message schema) stays as `declare module`.
5. Duplicated shapes are merged. Examples: `DataTableState` and `InfiniteScrollDataState` are
   identical, and the doc pages redefine the same `User` interface three times.

Planned `app/types/` files:

| File | Contents | Moved from |
| --- | --- | --- |
| `api.ts` | `ApiResponse`, `ApiErrorResponse`, `OffsetMeta`, `CursorMeta`, `PaginationMeta`, `OffsetPaginatedResponse`, `CursorPaginatedResponse` | `types/global.d.ts` (globals) |
| `common.ts` | `Prettify` | `types/global.d.ts` |
| `table.ts` | `TableParams`, `TableSort`, `TableStateOptions`, `TableStateReturn`, `UseTableOptions`, `DataTableState`, `UseDataTableReturn`, `UseDataInfiniteScrollOptions`, `UseDataInfiniteScrollReturn`, `PaginationType`, TanStack `ColumnMeta` augmentation | `composables/useTableState.ts`, `useDataTable.ts`, `useDataInfiniteScroll.ts`, `types/global.d.ts` |
| `media.ts` | `MediaValue`, `MediaPayload`, `MediaPayloadItem`, `ExtractMediaPayloadOptions`, `StorageServiceType`, `UploadImagePayload`, `UploadImageResponse`, `UrlDetails` | `types/media.ts`, `composables/useFormMedia.ts`, `useUploadImage.ts`, `utils/extractUrlDetails.ts` |
| `form.ts` | `StepDefinition`, `MultiStepFormOptions`, `FormPersistenceConfig`, `FormPersistenceOption`, `StorageType`, `UseMultiStepFormReturn`, `RadioGroupOption`, `CheckboxGroupOption` | `components/form/multi-step-form/types.ts`, `composables/useMultiStepForm.ts`, `components/form/*-group/index.ts` |
| `locale.ts` | `LocaleCode`, `LocaleDirection`, `LocaleMeta` | `locales/config.ts` |
| `permissions.ts` | `DefaultPermissions`, `AppPermissions`, `PermissionModel`, `CanPermission` | `types/permissions.d.ts` (globals) |
| `formatter.ts` | `FormatCurrencyOptions`, `FormatDateMode`, `FormatDateOptions`, `FormatTimeOptions`, `FormatPercentageOptions`, `FormatNumberOptions`, `FormatListOptions`, `FormatSubscriptZerosOptions` | `utils/formatter.ts` |
| `toast.ts` | `ToastVariant`, `ToastOptions` | `utils/toast.ts` |
| `country.ts` | `CountryOption` | `utils/countries.ts` |
| `virtual-scroll.ts` | `UseVirtualScrollOptions`, `UseVirtualScrollReturn` | `composables/useVirtualScroll.ts` |
| `auth.ts` | `AuthSession` (the payload `login()` stores) | inline type in `stores/auth.ts` |

Types that stay where they are, because only their own component uses them:

- Every `Props`, `Emits`, and `*Props` interface inside a `.vue` file.
- `ToolbarItem` moves from `toolbar-items.ts` into `components/form/editor/types.ts`, inside the
  editor folder, because only the editor uses it.
- `IconVariants`, `ButtonVariants`, `InputVariants`, `CheckboxGroupVariants`, `RadioGroupVariants`,
  and `LayoutTypes` stay next to the `cva()` or calendar code they are derived from.
- `ExtendedAxiosRequestConfig` stays private to `lib/api/client.ts`.

### 5. Verification plan

After the migration, the branch must:

1. Build with `nuxt build`.
2. Pass `nuxt typecheck` with no errors outside the two unfinished modules, and no more errors
   there than on `main`.
3. Run the Vitest suite through `@nuxt/test-utils`.
4. Pass `eslint .` with 0 errors.
5. Start with `nuxt dev` and serve the main routes.
