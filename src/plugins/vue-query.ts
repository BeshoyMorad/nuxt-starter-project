import {
  VueQueryPlugin,
  QueryClient,
  hashKey,
  dehydrate,
  hydrate,
  type DehydratedState,
  type QueryKey,
} from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query', () => null);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000,
        // Hash locale into every query so each language keeps its own cache entry.
        // Switching back to a fetched locale reuses that response instead of refetching.
        queryKeyHashFn: (queryKey: QueryKey): string =>
          `${hashKey([nuxtApp.$i18n.locale.value, ...queryKey])}`,
      },
    },
  });

  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient });

  if (import.meta.server) {
    nuxtApp.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient);
    });
  }

  if (import.meta.client) {
    if (vueQueryState.value) {
      hydrate(queryClient, vueQueryState.value);
    }
  }

  return {
    provide: {
      queryClient,
    },
  };
});
