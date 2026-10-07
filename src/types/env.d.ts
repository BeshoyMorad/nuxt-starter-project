declare module 'nuxt/schema' {
  interface PublicRuntimeConfig {
    apiBaseUrl: string;
    appEnv: 'development' | 'production' | 'staging';
    enableDevtools: boolean;
  }
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    apiBaseUrl: string;
    appEnv: 'development' | 'production' | 'staging';
    enableDevtools: boolean;
  }
}

declare global {
  interface ImportMetaEnv {
    readonly NUXT_PUBLIC_API_BASE_URL: string;
    readonly NUXT_PUBLIC_APP_ENV: 'development' | 'production' | 'staging';
    readonly NUXT_PUBLIC_ENABLE_DEVTOOLS: string;
  }
}

export {};
