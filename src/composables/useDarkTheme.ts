type Theme = 'light' | 'dark';

export const DARK_THEME_COOKIE_KEY = 'vue-starter-theme';

export const useDarkTheme = () => {
  const theme = useCookie<Theme>(DARK_THEME_COOKIE_KEY, {
    default: () => 'light',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });

  const isDark = computed({
    get: () => theme.value === 'dark',
    set: (value: boolean) => {
      theme.value = value ? 'dark' : 'light';
    },
  });

  const toggleDark = () => {
    isDark.value = !isDark.value;
  };

  const resolvedTheme = computed<Theme>(() => (isDark.value ? 'dark' : 'light'));

  useHead({
    htmlAttrs: {
      'data-theme': resolvedTheme,
      'style': computed(() => `color-scheme: ${resolvedTheme.value}`),
    },
  });

  return { isDark, toggleDark };
};
