import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import { SUPPORTED_LOCALES, type LocaleCode } from '@/locales/config';

const syncLocale = async (code: LocaleCode) => {
  const meta = SUPPORTED_LOCALES[code];
  if (!meta) return;
  try {
    if (code === 'ar') await import('dayjs/locale/ar');
    else await import('dayjs/locale/en');
    dayjs.locale(meta.dayjsLocale);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[i18n]: Failed to sync dayjs locale "${code}":`, err);
  }
  document.documentElement.setAttribute('lang', code);
  document.documentElement.setAttribute('dir', meta.direction);
};

export default defineNuxtPlugin((nuxtApp) => {
  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  if (!import.meta.client) return;

  nuxtApp.hook('i18n:localeSwitched', ({ newLocale }) => syncLocale(newLocale as LocaleCode));
  void syncLocale(nuxtApp.$i18n.locale.value as LocaleCode);
});
