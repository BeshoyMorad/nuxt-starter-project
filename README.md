# Nuxt 3 Starter Project

A modern, production-ready **Nuxt 3** starter project equipped with a comprehensive UI component system, form controls, composables, utilities, Pinia state management, TanStack Query, Tailwind CSS v4, and multi-language support (i18n).

---

## 🏛 Project Structure

```text
├── assets/
│   ├── css/                  # Tailwind CSS v4 & theme design tokens (main.css)
│   ├── icons/                # SVG icons and Iconify configuration
│   └── images/               # Image assets (light/dark placeholders)
├── components/
│   ├── ui/                   # Primitive UI components (Button, Dialog, Dropdown, Table, etc.)
│   ├── form/                 # Form fields (Input, Textarea, Select, DatePicker, Upload, etc.)
│   ├── data-table/           # Data table & pagination components
│   ├── icon/                 # Hugeicons & custom Icon component
│   ├── placeholders/         # Empty and placeholder states
│   └── *.vue                 # PageWrapper, StatusBadge, Tabs, CopyText, etc.
├── composables/              # Auto-imported Vue & Nuxt composables
│   ├── useApi.ts             # Type-safe API client composable
│   ├── useUserQuery.ts       # TanStack Query query options
│   ├── useAppLocale.ts       # Localization helper composable
│   ├── useDarkTheme.ts       # Dark mode theme composable
│   ├── useDataTable.ts       # TanStack table helper composable
│   └── ...                   # useModal, useNetwork, useMultiStepForm, etc.
├── utils/                    # Auto-imported utility functions
│   ├── index.ts              # cn (clsx + tailwind-merge) & utilities export
│   ├── apiError.ts           # API error handling
│   ├── toast.ts              # Vue Sonner notification helpers
│   ├── yupSchemas.ts         # Form validation schemas
│   └── ...                   # formatting, clipboard, device, countries helpers
├── locales/                  # Internationalization (EN / AR)
│   ├── common/               # Shared translation dictionaries
│   ├── en.ts                 # English locale configuration
│   └── ar.ts                 # Arabic locale configuration
├── pages/                    # File-based routing
│   ├── index.vue             # Home page
│   ├── dashboard.vue         # Interactive TanStack Query + SSR demonstration
│   ├── ssg-example.vue       # Static Site Generation (SSG) demonstration
│   └── isr-example.vue       # Incremental Static Regeneration (ISR) demonstration
├── layouts/                  # Nuxt layouts
│   └── default.vue           # Default application layout with header & footer
├── server/                   # Nitro server API routes
│   └── api/users/            # Mock server endpoints
├── stores/                   # Pinia state stores (auth, permissions)
├── plugins/                  # Nuxt plugins (api client, vue-query)
├── middleware/               # Route middleware (auth, permission guards)
├── types/                    # TypeScript interfaces and global declarations
├── nuxt.config.ts            # Nuxt 3 configuration
└── app.vue                   # Application root shell
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>= 20.x`
- **pnpm**: `>= 9.x` (or `npm` / `yarn`)

### Installation

```bash
pnpm install
```

### Development Server

Start the development server with Hot Module Replacement (HMR):

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Available Scripts

| Command | Description |
| :--- | :--- |
| `pnpm run dev` | Starts local Nuxt development server |
| `pnpm run build` | Builds the project for production (`.output/`) |
| `pnpm run generate` | Pre-renders the site as static HTML |
| `pnpm run preview` | Previews the production build locally |
| `pnpm run lint` | Runs ESLint across all `.ts` and `.vue` files |
| `pnpm run lint:fix` | Automatically fixes ESLint issues |
| `pnpm run type-check` | Type-checks the codebase using `vue-tsc` |
| `pnpm run format` | Formats codebase with Prettier |

---

## ✨ Features Included

- **Nuxt 3 & Vue 3**: Latest versions with full TypeScript support and auto-imports.
- **Tailwind CSS v4**: High-performance CSS engine with customized tokens, typography, and dark mode support.
- **Reka UI & FormKit**: Robust primitive building blocks and animated micro-interactions.
- **TanStack Query (Vue Query)**: Server prefetching with zero-waterfall client hydration.
- **Localization (@nuxtjs/i18n)**: English (LTR) and Arabic (RTL) out of the box.
- **Pinia State Management**: Modular state stores with persistence support.
- **Hybrid Rendering**: Configured rules for SSR, SSG pre-rendering, and ISR caching.
- **Type Safety**: Strict TypeScript configuration validated by `vue-tsc`.
