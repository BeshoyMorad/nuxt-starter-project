<script setup lang="ts">
  definePageMeta({
    title: 'Nuxt 3 Starter Dashboard',
  });

  const { t } = useAppLocale();
  const authStore = useAuthStore();
  const permissionStore = usePermissionStore();

  const cards = [
    {
      title: 'Native Nuxt Fetch',
      description:
        'Zero-config SSR data fetching using useFetch & useAsyncData for SEO-critical pages.',
      path: '/examples/native-fetch',
      icon: 'hugeicons--cloud-server',
      tag: 'Native SSR',
      tagColor: 'bg-blue-600/10 text-blue-600',
    },
    {
      title: 'TanStack Query SSR',
      description:
        'SSR-hydrated Vue Query with background polling, cache invalidation, and mutations.',
      path: '/examples/tanstack-query',
      icon: 'hugeicons--layers-01',
      tag: 'Hybrid SSR',
      tagColor: 'bg-amber-600/10 text-amber-600',
    },
    {
      title: 'Role-Based Middleware',
      description:
        'Declarative Nuxt route guards enforcing fine-grained user permissions and roles.',
      path: '/admin',
      icon: 'hugeicons--shield-user',
      tag: 'Security',
      tagColor: 'bg-purple-600/10 text-purple-600',
    },
    {
      title: 'Nuxt i18n (Lazy-Loaded)',
      description:
        'Multi-lingual support with on-demand chunk loading, RTL switching, and type safety.',
      path: '/dashboard/localization-example',
      icon: 'hugeicons--globe-02',
      tag: 'Localization',
      tagColor: 'bg-emerald-600/10 text-emerald-600',
    },
    {
      title: 'Multi-Step Form Wizard',
      description: 'VeeValidate + Yup form state management with step persistence and validation.',
      path: '/dashboard/multi-step-form',
      icon: 'hugeicons--note-edit',
      tag: 'Forms',
      tagColor: 'bg-pink-600/10 text-pink-600',
    },
    {
      title: 'Virtual Scrolling Table',
      description: 'High-performance rendering for thousands of rows without browser lag.',
      path: '/dashboard/virtual-scroll-example',
      icon: 'hugeicons--grid-table',
      tag: 'Performance',
      tagColor: 'bg-cyan-600/10 text-cyan-600',
    },
  ];
</script>

<template>
  <div class="space-y-8">
    <!-- Hero / Welcome Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-br from-gray-50 via-white to-gray-50 p-8 shadow-xs dark:border-gray-800 dark:from-gray-900/40 dark:via-gray-900/10 dark:to-gray-900/40"
    >
      <div class="max-w-3xl space-y-3">
        <div
          class="border-primary-600/20 bg-primary-600/10 text-primary-600 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
        >
          <span class="bg-primary-600 size-1.5 animate-pulse rounded-full" />
          Nuxt 3 Hybrid Enterprise Starter
        </div>
        <h1 class="text-text-primary text-3xl font-extrabold tracking-tight sm:text-4xl">
          {{ t('welcome') }}
        </h1>
        <p class="text-text-tertiary text-sm leading-relaxed sm:text-base">
          Engineered for production applications with file-based routing, zero-config auto-imports,
          Pinia state stores, and a unified hybrid data-fetching model.
        </p>
      </div>

      <!-- Quick Metrics -->
      <div
        class="mt-6 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6 text-xs dark:border-gray-800/80"
      >
        <div class="flex items-center gap-2">
          <span class="text-text-tertiary">Auth State:</span>
          <span
            class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-medium"
            :class="
              authStore.isAuthenticated
                ? 'bg-green-600/10 text-green-600'
                : 'bg-amber-600/10 text-amber-600'
            "
          >
            {{ authStore.isAuthenticated ? 'Authenticated' : 'Guest' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-text-tertiary">Admin Permission:</span>
          <span class="bg-primary-600/10 text-primary-600 rounded-md px-2 py-0.5 font-medium">
            {{ permissionStore.can('admin.list' as never) ? 'Granted' : 'Restricted' }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-text-tertiary">SSR Engine:</span>
          <span
            class="rounded-md bg-gray-100 px-2 py-0.5 font-mono text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            Nuxt 3 Nitro + Vite 8
          </span>
        </div>
      </div>
    </div>

    <!-- Architectural Modules Grid -->
    <div>
      <div class="mb-4">
        <h2 class="text-text-primary text-lg font-bold tracking-tight">
          Architectural Capabilities
        </h2>
        <p class="text-text-tertiary text-xs">
          Explore key design patterns and reference implementations below.
        </p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="card in cards"
          :key="card.path"
          :to="card.path"
          class="bg-bg-surface group hover:border-primary-600/50 dark:hover:border-primary-600/50 relative flex flex-col justify-between rounded-xl border border-gray-200 p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-gray-800"
        >
          <div>
            <div class="flex items-center justify-between">
              <div
                class="bg-surface-secondary text-text-primary group-hover:bg-primary-600 flex size-10 items-center justify-center rounded-lg transition-colors group-hover:text-white"
              >
                <Icon :icon="card.icon" class="size-5" />
              </div>
              <span
                class="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                :class="card.tagColor"
              >
                {{ card.tag }}
              </span>
            </div>

            <h3 class="text-text-primary group-hover:text-primary-600 mt-4 text-base font-semibold">
              {{ card.title }}
            </h3>
            <p class="text-text-tertiary mt-1.5 text-xs leading-relaxed">
              {{ card.description }}
            </p>
          </div>

          <div class="text-primary-600 mt-5 flex items-center gap-1.5 text-xs font-semibold">
            <span>Explore Architecture</span>
            <Icon
              icon="hugeicons--arrow-right-01"
              class="size-3.5 transition-transform group-hover:translate-x-1"
            />
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
