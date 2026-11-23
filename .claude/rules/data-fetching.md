---
paths:
  - "src/lib/**/*.ts"
  - "src/**/services/**/*.ts"
  - "src/**/composables/**/*.ts"
  - "src/plugins/vue-query.ts"
  - "**/*.vue"
---

# Data fetching (TanStack Query)

- All HTTP goes through the shared `api` instance from `@/lib/api/client` (auth header, device-id, 401/403/500 handling). Do not create another Axios instance.
- Build URLs only with `apiRoute('name')` from `@/lib/api/endpoints`. Add new route names to the `routes` object in that file first. No hardcoded `/api/...` strings.
- Services are small `async` functions in `modules/<feature>/services/index.ts` that return typed payloads. `queryFn` and mapping belong in services or composables, not in components.
- Server state uses TanStack Vue Query: `useQuery`, `useMutation`, `useInfiniteQuery`. `src/plugins/vue-query.ts` creates the client, dehydrates it during SSR, and hydrates it in the browser. The client is also available as `$queryClient`.
- Query keys use `@lukemorales/query-key-factory`. Each module owns its keys in `src/modules/<m>/<m>.keys.ts` (`export const usersKeys = createQueryKeys('users', {...})`). `src/lib/query-keys.ts` only merges them with `mergeQueryKeys` into `queryKeys`; register a new module there. Never inline arrays like `queryKey: ['users', id]`.
  - Static key: `list: null` -> `queryKeys.users.list.queryKey`.
  - Key with params: `details: (id: string) => [id]` -> `queryKeys.users.details(id).queryKey`. Params go in the array, objects are fine (`list: (filters) => [{ filters }]`).
  - Whole-module scope for invalidation: `queryKeys.users._def`.
  - Keep keys only; `queryFn` stays in services/composables (do not use the factory's `queryFn` option).
- After a mutation, invalidate through `useQueryClient()` using the registry, for example `invalidateQueries({ queryKey: queryKeys.users._def })` (everything in the module) or `queryKeys.users.list.queryKey` (one query and its sub-keys). Do not mirror server data in Pinia.
- The query client in `src/plugins/vue-query.ts` hashes the active locale into every query. Do not add locale to individual keys.
- Lists and tables:
  - `useDataTable` for offset pagination.
  - `useDataInfiniteScroll` for infinite lists.
  - Both come from `@/composables`, call `fetchTableData` from `@/lib/api/table`, and take an `endpoint` and a `queryKey`.
  - Do not write manual pagination or scroll logic.
- Errors are handled by the client interceptors and `@/utils/apiError`. Do not add a `try/catch` that toasts manually. Map field errors onto forms with `applyApiErrorToForm` (see the forms rule). Use `@/utils/toast` for success messages.
- `usePostsQuery` and the pages under `src/pages/examples/` are demos that call `fetch` directly with a hardcoded URL. Do not copy that pattern into product code.
