import {
  VueQueryPlugin,
  QueryClient,
  dehydrate,
  hydrate,
  type DehydratedState,
} from '@tanstack/vue-query';

export default defineNuxtPlugin((nuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query', () => null);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60000,
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
