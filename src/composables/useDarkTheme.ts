import {
  computed,
  inject,
  ref,
  type App,
  type InjectionKey,
  type Ref,
  type WritableComputedRef,
} from 'vue';
import { usePreferredDark } from '@vueuse/core';
import type { Theme } from '@/constants/theme';

/** Where the user's theme choice lives; the theme plugin provides it with `provideTheme`. */
export const THEME_CHOICE_KEY: InjectionKey<Ref<Theme | null>> = Symbol('theme-choice');

export function provideTheme(app: App, choice: Ref<Theme | null>): void {
  app.provide(THEME_CHOICE_KEY, choice);
}

export interface UseDarkThemeReturn {
  theme: Ref<Theme | null>;
  isDark: WritableComputedRef<boolean>;
  toggleDark: () => void;
}

/**
 * Light / dark theme composable.
 * - `theme`: The user's explicit theme choice ('light' | 'dark' | null). null means follow the device.
 * - `isDark`: Reactive boolean reflecting whether the current applied mode is dark.
 * - `toggleDark`: Switches between light and dark modes (reversing current effective theme).
 */
export function useDarkTheme(): UseDarkThemeReturn {
  const theme = inject(THEME_CHOICE_KEY, null) ?? ref<Theme | null>(null);

  const preferredDark = usePreferredDark();

  const isDark = computed<boolean>({
    get: () => {
      if (theme.value === 'dark') return true;
      if (theme.value === 'light') return false;
      return preferredDark.value;
    },
    set: (val: boolean) => {
      theme.value = val ? 'dark' : 'light';
    },
  });

  function toggleDark() {
    const current = theme.value ?? (preferredDark.value ? 'dark' : 'light');
    theme.value = current === 'dark' ? 'light' : 'dark';
  }

  return {
    theme,
    isDark,
    toggleDark,
  };
}
