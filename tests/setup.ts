import type { VueWrapper, MountingOptions } from '@vue/test-utils';
import type { Component } from 'vue';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query';

import { ref } from 'vue';
import { vi } from 'vitest';

export const server = setupServer();

const mockLocale = ref('en');
vi.stubGlobal('useI18n', () => ({
  locale: mockLocale,
  t: (key: string) => key,
  d: (val: unknown) => String(val),
  n: (val: unknown) => String(val),
  setLocale: async (loc: string) => {
    mockLocale.value = loc;
  },
}));

vi.stubGlobal('useCookie', (key: string, options?: { default?: () => unknown }) => {
  return ref(options?.default ? options.default() : null);
});

vi.stubGlobal('navigateTo', vi.fn());
vi.stubGlobal('definePageMeta', vi.fn());
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    apiBaseUrl: 'https://www.google.com/',
    appEnv: 'development',
    enableDevtools: false,
  },
}));

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

export function findByTestId(wrapper: VueWrapper, testId: string) {
  return wrapper.find(`[data-test-id="${testId}"]`);
}

export interface MountWithProvidersOptions extends MountingOptions<Record<string, unknown>> {
  queryClient?: QueryClient;
  piniaOptions?: Parameters<typeof createTestingPinia>[0];
}

export function mountWithProviders(component: Component, options: MountWithProvidersOptions = {}) {
  const queryClient =
    options.queryClient ||
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    });

  const { global = {}, piniaOptions = {}, ...restOptions } = options;
  const { plugins = [], stubs = {}, ...restGlobal } = global;

  return mount(component, {
    ...restOptions,
    global: {
      ...restGlobal,
      plugins: [
        createTestingPinia({ stubActions: false, ...piniaOptions }),
        [VueQueryPlugin, { queryClient }],
        ...plugins,
      ],
      stubs: {
        RouterLink: true,
        ...stubs,
      },
    },
  });
}
