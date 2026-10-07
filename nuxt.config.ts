import tailwindcss from '@tailwindcss/vite';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  srcDir: 'src/',

  css: ['~/css/index.css'],

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxt/image',
  ],

  pinia: {
    storesDirs: ['./stores/**', './modules/**/stores/**'],
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['.vue'],
      ignore: [
        '**/ui/table/**',
        '**/ui/textarea/**',
        '**/ui/switch/**',
        '**/ui/checkbox/**',
        '**/ui/radio-group/**',
        '**/ui/tags-input/**',
        '**/ui/tooltip/**',
      ],
    },
  ],

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'https://www.google.com/',
      appEnv: (process.env.NUXT_PUBLIC_APP_ENV as 'development' | 'production' | 'staging') || 'development',
      enableDevtools: process.env.NUXT_PUBLIC_ENABLE_DEVTOOLS === 'true',
    },
  },

  imports: {
    dirs: [
      'stores',
      'constants',
    ],
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['dayjs', 'dayjs/plugin/relativeTime', 'dayjs/plugin/duration'],
    },
  },

  i18n: {
    langDir: '../src/locales',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    locales: [
      { code: 'en', language: 'en-US', file: 'en.ts', name: 'English', dir: 'ltr' },
      { code: 'ar', language: 'ar-SA', file: 'ar.ts', name: 'العربية', dir: 'rtl' },
    ],
    detectBrowserLanguage: false,
    vueI18n: '../src/i18n.config.ts',
  },

  devtools: { enabled: true },
});
