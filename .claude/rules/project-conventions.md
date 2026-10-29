# Project conventions

- TypeScript everywhere. Vue SFCs use `<script setup lang="ts">` only (no Options API).
- Import across folders with the `@/` alias (`@/*` and `~/*` both point to `src/*`). `./` is fine inside one module folder.
- Nuxt auto-imports Vue and Nuxt APIs (`ref`, `computed`, `useCookie`, `navigateTo`, `definePageMeta`), components, and the folders `src/composables`, `src/utils`, `src/stores`, and `src/constants`. Follow the surrounding file: use explicit `@/` imports for types and in library code (`src/lib`, `src/locales`, `src/plugins`).
- Prefer named exports. Use `index.ts` barrels for a folder's public API (`@/components`, `@/components/form`, `@/composables`).
- Merge classes with `cn()` from `@/utils`.
- Formatting follows `.prettierrc`: single quotes, semicolons, 2-space indent, `printWidth` 100, `trailingComma: es5`. Tailwind class order is handled by `prettier-plugin-tailwindcss`.
- Tests are Vitest, with `*.spec.ts` next to the code under test. Run one file with `pnpm test:unit --run <file>`.
- Lint with `pnpm lint`, typecheck with `pnpm type-check`. The typecheck needs the generated `.nuxt` types, so run `pnpm postinstall` first if they are missing.
- Everything must be SSR-safe. See the `vue-ui` rule.
