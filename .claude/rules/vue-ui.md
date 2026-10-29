---
paths:
  - "**/*.vue"
---

# Vue components & UI

## SFC shape
- `<script setup lang="ts">` only (no Options API). Block order: `<script>`, `<template>`, then `<style>` only if unavoidable.
- `defineProps<Props>()` and `defineEmits<Emits>()` with typed interfaces. Use `defineModel()` for two-way bindings.
- Use `@formkit/auto-animate` for list transitions where the component already uses it.

## Reuse before you write
- Base primitives live in `src/components/ui/` (reka-ui based): Accordion, Avatar, Button, Calendar, Card, Combobox, Dialog, DropdownMenu, Popover, Table, Tooltip, and others. Use them. Do not hand-roll them.
- Components under `src/components/` are auto-imported with `pathPrefix: false`, so a component name must be unique across folders. These primitives are excluded from auto-import because their names clash with form fields: `ui/table`, `ui/textarea`, `ui/switch`, `ui/checkbox`, `ui/radio-group`, `ui/tags-input`, `ui/tooltip`. Import them explicitly from `@/components/ui/...`.
- Form controls come from `@/components/form`.
- Overlays and feedback: `ConfirmDialog` and `FormDialog`, and toasts from `@/utils/toast`. Do not create new modal wrappers.
- States: `EmptyPlaceholder`, `TableErrorState`, `ExceptionState`, `StatusBadge`.
- Shared components go in `src/components/` only when more than one module uses them. Feature components stay in `modules/<feature>/components/`.
- Components use **reka-ui and Tailwind**. Do not add PrimeVue.

## Page layout
- Wrap page content in `PageWrapper`, with `title` and `subtitle` props. Put header buttons in its `actions` slot.

## Tables & lists
- Use `Table` or `InfiniteScrollTable` with `useDataTable` or `useDataInfiniteScroll` (see the data-fetching rule).
- Columns are `ColumnDef<TRow, unknown>[]` from `@tanstack/vue-table`.

## Styling (RTL-first)
- Logical properties only: `ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e rounded-s rounded-e`.
- Forbidden: `ml- mr- pl- pr- left- right- text-left text-right border-l border-r rounded-l rounded-r`.
- The `check-rtl.sh` hook blocks these after every edit, so fix them before finishing.
- See the styling rule for tokens and `cn()`.

## Test hooks & formatting
- Interactive elements and critical boundaries get `data-test-id`, with the value taken from `TEST_IDS` in `src/lib/test-ids.ts`. Add new keys there. Do not use string literals.
- Format dates, currency, and status with `@/utils/formatter`, `formatText`, and `formatStatus`. No inline formatting.

## SSR safety
- This is a Nuxt SSR app. Do not touch `window`, `document`, or `localStorage` at module scope or the root of `<script setup>`. Move browser-only code into `onMounted`, or guard it with `import.meta.client`.
- Auth tokens and other values the server must read go through `useCookie()`, as `stores/auth.ts` does.
- Avoid values that differ between server and client during render (random IDs, `Date.now()`, locale-dependent formatting from the browser). They cause hydration mismatches.
