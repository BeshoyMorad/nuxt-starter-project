/**
 * Centralized Application Route Paths
 * Eliminates hardcoded magic route strings across components, layouts, and middleware.
 */
export const paths = {
  home: '/',
  starter: '/starter',
  admin: '/admin',

  auth: {
    login: '/auth/login',
  },

  dashboard: {
    root: '/dashboard',
    localization: '/dashboard/localization-example',
    multiStepForm: '/dashboard/multi-step-form',
    virtualScroll: '/dashboard/virtual-scroll-example',
  },

  examples: {
    nativeFetch: '/examples/native-fetch',
    tanstackQuery: '/examples/tanstack-query',
  },

  errors: {
    accessDenied: '/access-denied',
    internalServerError: '/internal-server-error',
    noInternet: '/no-internet',
  },
} as const;

export type AppPaths = typeof paths;
export default paths;
