import { isTheme, THEME_COOKIE_MAX_AGE, THEME_STORAGE_KEY, type Theme } from '@/constants/theme';
import { provideTheme } from '@/composables/useDarkTheme';

/**
 * Global SSR Theme Plugin.
 * Keeps the theme choice in a cookie (null = follow the device) and hands it to useDarkTheme(),
 * so the server already renders <html data-theme> and the page never flashes.
 * The only place that writes data-theme.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const cookie = useCookie<string | null>(THEME_STORAGE_KEY, {
    default: () => null,
    maxAge: THEME_COOKIE_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  });
  const theme = useState<Theme | null>('theme', () =>
    isTheme(cookie.value) ? cookie.value : null
  );
  watch(theme, (value) => {
    cookie.value = value;
  });

  provideTheme(nuxtApp.vueApp, theme);

  useHead({
    htmlAttrs: {
      'data-theme': () => theme.value ?? undefined,
    },
  });
});
