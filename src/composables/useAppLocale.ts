import dayjs from 'dayjs';
import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  SUPPORTED_LOCALES,
  type LocaleCode,
  type LocaleMeta,
} from '@/locales/config';

async function syncDayjsLocale(dayjsLocale: string): Promise<void> {
  try {
    if (dayjsLocale === 'ar') {
      await import('dayjs/locale/ar');
    } else if (dayjsLocale === 'en') {
      await import('dayjs/locale/en');
    }
    dayjs.locale(dayjsLocale);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[i18n]: Failed to sync dayjs locale "${dayjsLocale}":`, err);
  }
}

function updateDocumentAttributes(meta: LocaleMeta): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('lang', meta.code);
    document.documentElement.setAttribute('dir', meta.direction);
  }
}

export function useAppLocale() {
  const i18n = useI18n();
  const isLoadingLocale = ref(false);

  const currentLocale = computed(() => (i18n.locale.value as LocaleCode) || DEFAULT_LOCALE);
  const currentLocaleMeta = computed<LocaleMeta>(
    () => SUPPORTED_LOCALES[currentLocale.value] || SUPPORTED_LOCALES[FALLBACK_LOCALE]
  );
  const isRTL = computed(() => currentLocaleMeta.value.direction === 'rtl');
  const supportedLocales = computed(() => Object.values(SUPPORTED_LOCALES));

  const setLocale = async (locale: LocaleCode): Promise<void> => {
    if (!SUPPORTED_LOCALES[locale] || currentLocale.value === locale) return;
    isLoadingLocale.value = true;
    try {
      if (typeof (i18n).setLocale === 'function') {
        await (i18n).setLocale(locale);
      } else {
        i18n.locale.value = locale;
      }
      const meta = SUPPORTED_LOCALES[locale];
      await syncDayjsLocale(meta.dayjsLocale);
      updateDocumentAttributes(meta);
    } finally {
      isLoadingLocale.value = false;
    }
  };

  const initLocale = async (): Promise<void> => {
    const meta = currentLocaleMeta.value;
    await syncDayjsLocale(meta.dayjsLocale);
    updateDocumentAttributes(meta);
  };

  return {
    t: i18n.t,
    d: i18n.d,
    n: i18n.n,
    tm: i18n.tm,
    rt: i18n.rt,
    currentLocale,
    currentLocaleMeta,
    isRTL,
    supportedLocales,
    isLoadingLocale: computed(() => isLoadingLocale.value),
    setLocale,
    initLocale,
  };
}
