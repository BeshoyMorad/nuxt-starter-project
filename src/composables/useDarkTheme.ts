import { useDark, useToggle } from '@vueuse/core';

// DON'T FORGET TO UPDATE THIS KEY IN index.html FILE
export const DARK_THEME_STORAGE_KEY = 'vue-starter-theme';

export const useDarkTheme = () => {
  const isDark = useDark({
    selector: 'html',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: DARK_THEME_STORAGE_KEY,
    initialValue: 'light',
    onChanged(isDarkVal, defaultHandler) {
      if (import.meta.client && typeof document !== 'undefined') {
        defaultHandler(isDarkVal ? 'dark' : 'light');
        if (document.documentElement) {
          document.documentElement.style.colorScheme = isDarkVal ? 'dark' : 'light';
        }
      }
    },
  });

  const toggleDark = useToggle(isDark);

  return { isDark, toggleDark };
};
