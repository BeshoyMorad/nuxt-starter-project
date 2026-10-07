<script setup lang="ts">
  definePageMeta({
    title: 'TanStack Query SSR Example',
  });

  const { data: posts, isLoading, isFetching, error, refetch, addPostMutation } = usePostsQuery(4);

  const newTitle = ref('');
  const isCreating = ref(false);

  const handleCreatePost = async () => {
    if (!newTitle.value.trim()) return;
    isCreating.value = true;
    try {
      await addPostMutation.mutateAsync({
        title: newTitle.value.trim(),
        body: 'Optimistically created dynamic post via TanStack Query mutation.',
        userId: 1,
      });
      newTitle.value = '';
    } finally {
      isCreating.value = false;
    }
  };
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="border-b border-gray-200 pb-5 dark:border-gray-800">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span
            class="inline-flex items-center gap-1.5 rounded-full bg-amber-600/10 px-3 py-1 text-xs font-semibold text-amber-600"
          >
            <Icon icon="hugeicons--layers-01" class="size-3.5" />
            TanStack Query SSR Architecture
          </span>
          <h1 class="text-text-primary mt-2 text-2xl font-bold tracking-tight">
            TanStack Query (`useQuery` + SSR Plugin Hydration)
          </h1>
          <p class="text-text-tertiary mt-1 text-sm">
            Best for highly interactive, complex data requiring mutations, background revalidation,
            window refetch, and granular cache controls.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <Button
            test-id="query-refetch"
            variant="default"
            size="sm"
            :loading="isFetching"
            @click="() => refetch()"
          >
            <Icon icon="hugeicons--refresh" class="size-4" />
            {{ isFetching ? 'Refetching...' : 'Refetch Query' }}
          </Button>
        </div>
      </div>
    </div>

    <!-- Architecture Callout -->
    <div
      class="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/50 dark:bg-amber-950/20"
    >
      <div class="flex items-start gap-3">
        <Icon
          icon="hugeicons--information-circle"
          class="size-5 shrink-0 text-amber-600 dark:text-amber-400"
        />
        <div class="space-y-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
          <p class="font-semibold">TanStack Query SSR Hydration Mechanism:</p>
          <ul class="list-disc space-y-0.5 pl-4">
            <li>
              <strong>Server dehydration:</strong> In <code>src/plugins/vue-query.ts</code>, queries
              run during SSR are dehydrated in <code>nuxtApp.hook('app:rendered')</code> into Nuxt's
              <code>useState('vue-query')</code>.
            </li>
            <li>
              <strong>Client hydration:</strong> On initial client render, the cache is hydrated
              from the transferred state — zero duplicate requests on load!
            </li>
            <li>
              <strong>Lifecycle:</strong> Background refetches on window focus, auto-garbage
              collection, and instant mutations.
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Interactive Mutation Form -->
    <div class="bg-bg-surface rounded-xl border border-gray-200 p-5 shadow-xs dark:border-gray-800">
      <h3 class="text-text-primary text-sm font-semibold">Test Mutation & Cache Invalidation</h3>
      <div class="mt-3 flex gap-3">
        <InputText
          v-model="newTitle"
          placeholder="Enter quick post title..."
          test-id="new-post-input"
          class="flex-1"
        />
        <Button test-id="add-post-btn" size="sm" :loading="isCreating" @click="handleCreatePost">
          Add Item
        </Button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="grid gap-4 sm:grid-cols-2">
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
      <h3 class="mt-2 text-sm font-semibold text-red-800 dark:text-red-300">Query failed</h3>
      <p class="mt-1 text-xs text-red-600 dark:text-red-400">{{ error.message }}</p>
      <Button
        test-id="query-retry"
        variant="danger"
        size="sm"
        class="mt-4"
        @click="() => refetch()"
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
          <span>Stale time: 60s</span>
          <span class="font-medium text-amber-600 dark:text-amber-400">● Vue Query Hydrated</span>
        </div>
      </div>
    </div>
  </div>
</template>
