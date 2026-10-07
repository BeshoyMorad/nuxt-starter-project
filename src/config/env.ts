import * as yup from 'yup';

// 1. Schema matching Nuxt environment variables
const envSchema = yup.object({
  apiBaseUrl: yup.string().url('apiBaseUrl must be a valid URL').required(),
  appEnv: yup.string().oneOf(['development', 'production', 'staging']).default('development'),
  enableDevtools: yup.boolean().default(false),
});

export interface AppConfig {
  apiBaseUrl: string;
  env: 'development' | 'production' | 'staging';
  enableDevtools: boolean;
}

/**
 * Resolves configuration from Nuxt runtimeConfig or fallback environment variables.
 */
export function getAppConfig(): AppConfig {
  let rawApiBaseUrl = '';
  let rawAppEnv = 'development';
  let rawEnableDevtools = false;

  // 1. Try reading from Nuxt's useRuntimeConfig()
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nuxtApp = (globalThis as any).useNuxtApp?.();
    const runtime = nuxtApp?.$config || (typeof useRuntimeConfig === 'function' ? useRuntimeConfig() : null);
    if (runtime?.public) {
      rawApiBaseUrl = (runtime.public.apiBaseUrl as string) || '';
      rawAppEnv = (runtime.public.appEnv as string) || 'development';
      rawEnableDevtools = Boolean(runtime.public.enableDevtools);
    }
  } catch {
    // Outside Nuxt scope
  }

  // 2. Fallback to process.env / import.meta.env
  if (!rawApiBaseUrl) {
    rawApiBaseUrl =
      (typeof process !== 'undefined' && process.env
        ? process.env.NUXT_PUBLIC_API_BASE_URL || process.env.VITE_API_BASE_URL
        : undefined) ||
      (typeof import.meta !== 'undefined' && import.meta.env
        ? (import.meta.env.NUXT_PUBLIC_API_BASE_URL as string) || (import.meta.env.VITE_API_BASE_URL as string)
        : undefined) ||
      'https://www.google.com/';
  }

  if (!rawAppEnv || rawAppEnv === 'development') {
    const envVal =
      (typeof process !== 'undefined' && process.env
        ? process.env.NUXT_PUBLIC_APP_ENV || process.env.VITE_APP_ENV
        : undefined) || 'development';
    rawAppEnv = envVal;
  }

  const validated = envSchema.validateSync(
    {
      apiBaseUrl: rawApiBaseUrl,
      appEnv: rawAppEnv,
      enableDevtools: rawEnableDevtools,
    },
    { stripUnknown: true }
  );

  return {
    apiBaseUrl: validated.apiBaseUrl,
    env: validated.appEnv as 'development' | 'production' | 'staging',
    enableDevtools: Boolean(validated.enableDevtools),
  };
}

// Export lazy proxy for seamless consumption anywhere (e.g. config.apiBaseUrl)
export const config: AppConfig = new Proxy({} as AppConfig, {
  get(_target, prop: keyof AppConfig) {
    return getAppConfig()[prop];
  },
});

export default config;
