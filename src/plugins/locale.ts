import type { Ref } from 'vue';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_KEY,
  SUPPORTED_LOCALE_CODES,
  SUPPORTED_LOCALES,
  type LocaleCode,
} from '@/locales/config';
import { syncDayjsLocale, syncDocumentLocale } from '@/locales/utils';

/**
 * Global SSR & Hydration Locale Plugin for Nuxt 3.
 * Reactively sets <html lang="..." dir="..."> on the initial SSR response
 * and keeps Dayjs & DOM attributes synchronized on client route/locale updates.
 * The chosen locale is stored in a cookie so the server renders it on the first request.
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  const i18n = nuxtApp.$i18n as {
    locale: Ref<string>;
    setLocale: (code: LocaleCode) => Promise<void>;
  };

  const localeCookie = useCookie<LocaleCode>(LOCALE_COOKIE_KEY, {
    default: () => DEFAULT_LOCALE,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  // 1. Reactive SSR & Head attributes (dir & lang)
  // Registered before the await below, since injection-context composables fail after it
  useHead(() => {
    const current = (i18n.locale.value || 'en') as LocaleCode;
    const direction = SUPPORTED_LOCALES[current]?.direction ?? 'ltr';
    return {
      htmlAttrs: {
        lang: current,
        dir: direction,
      },
    };
  });

  // 2. Client-side listener to save the choice and sync Dayjs & DOM when locale changes
  if (import.meta.client) {
    const syncLocale = async (locale: LocaleCode) => {
      syncDocumentLocale(locale);
      await syncDayjsLocale(locale);
    };

    watch(
      () => i18n.locale.value as LocaleCode,
      async (newLocale) => {
        localeCookie.value = newLocale;
        await syncLocale(newLocale);
      }
    );

    void syncLocale(i18n.locale.value as LocaleCode);
  }

  // 3. Apply the saved locale before render so SSR markup matches the user's choice
  if (
    SUPPORTED_LOCALE_CODES.includes(localeCookie.value) &&
    localeCookie.value !== i18n.locale.value
  ) {
    await nuxtApp.runWithContext(() => i18n.setLocale(localeCookie.value));
  }
});
