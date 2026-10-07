<script setup lang="ts">
  definePageMeta({
    title: 'Native SSR Fetch Example',
  });

  interface Post {
    id: number;
    title: string;
    body: string;
  }

  // Native Nuxt useFetch: Executed on the server during SSR, state serialized into Nuxt payload.
  // Prevents client-side double-fetching automatically via Nuxt's hydration system.
  const {
    data: posts,
    pending,
    error,
    refresh,
  } = await useFetch<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=4', {
    key: 'posts-native-ssr',
    server: true,
    lazy: false,
  });
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="border-b border-gray-200 pb-5 dark:border-gray-800">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span
            class="bg-primary-600/10 text-primary-600 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
          >
            <Icon icon="hugeicons--cloud-server" class="size-3.5" />
            Nuxt Native SSR Strategy
          </span>
          <h1 class="text-text-primary mt-2 text-2xl font-bold tracking-tight">
            Native Nuxt Fetch (`useFetch` / `useAsyncData`)
          </h1>
          <p class="text-text-tertiary mt-1 text-sm">
            Best for SEO-critical, read-only content where fast initial server rendering and static
            generation are paramount.
          </p>
        </div>

        <Button
          test-id="native-fetch-refresh"
          variant="default"
          size="sm"
          :loading="pending"
          @click="() => refresh()"
        >
          <Icon icon="hugeicons--refresh" class="size-4" />
          Refresh Data
        </Button>
      </div>
    </div>

    <!-- Architecture Callout -->
    <div
      class="rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/50 dark:bg-blue-950/20"
    >
      <div class="flex items-start gap-3">
        <Icon
          icon="hugeicons--information-circle"
          class="size-5 shrink-0 text-blue-600 dark:text-blue-400"
        />
        <div class="space-y-1 text-xs leading-relaxed text-blue-900 dark:text-blue-200">
          <p class="font-semibold">Architectural Characteristics:</p>
          <ul class="list-disc space-y-0.5 pl-4">
            <li>
              <strong>Hydration:</strong> Transferred directly from server to client via the Nuxt
              payload window object without a client refetch.
            </li>
            <li>
              <strong>SEO & Web Vitals:</strong> HTML is pre-rendered with fully populated content
              ready for crawlers and fast LCP.
            </li>
            <li>
              <strong>Use Case:</strong> Marketing pages, articles, public catalogs, and view-only
              dashboards.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="i in 4"
        :key="i"
        class="bg-bg-surface animate-pulse rounded-xl border border-gray-200 p-5 dark:border-gray-800"
      >
        <div class="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
        <div class="mt-3 space-y-2">
          <div class="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
          <div class="h-3 w-5/6 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900/50 dark:bg-red-950/20"
    >
      <Icon icon="hugeicons--alert-circle" class="mx-auto size-8 text-red-500" />
      <h3 class="mt-2 text-sm font-semibold text-red-800 dark:text-red-300">
        Failed to fetch data
      </h3>
      <p class="mt-1 text-xs text-red-600 dark:text-red-400">{{ error.message }}</p>
      <Button
        test-id="native-fetch-retry"
        variant="danger"
        size="sm"
        class="mt-4"
        @click="() => refresh()"
      >
        Retry
      </Button>
    </div>

    <!-- Content Grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-bg-surface flex flex-col justify-between rounded-xl border border-gray-200 p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800"
      >
        <div>
          <span class="text-text-tertiary font-mono text-xs">#{{ post.id }}</span>
          <h2 class="text-text-primary mt-1 text-base font-semibold capitalize">
            {{ post.title }}
          </h2>
          <p class="text-text-tertiary mt-2 text-xs leading-relaxed">
            {{ post.body }}
          </p>
        </div>

        <div
          class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-400 dark:border-gray-800"
        >
          <span>SSR Pre-rendered</span>
          <span class="font-medium text-green-600 dark:text-green-400">● Hydrated</span>
        </div>
      </div>
    </div>
  </div>
</template>
