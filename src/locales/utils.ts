import dayjs from 'dayjs';
import { SUPPORTED_LOCALES, type LocaleCode } from './config';

/**
 * Updates the document <html> tag with the corresponding lang and dir attributes.
 */
export function syncDocumentLocale(locale: LocaleCode): void {
  if (typeof document === 'undefined') return;
  const meta = SUPPORTED_LOCALES[locale];
  document.documentElement.setAttribute('lang', locale);
  document.documentElement.setAttribute('dir', meta?.direction ?? 'ltr');
}

/**
 * Dynamically loads and activates the Dayjs locale.
 */
export async function syncDayjsLocale(locale: LocaleCode): Promise<void> {
  try {
    if (locale === 'ar') {
      await import('dayjs/locale/ar');
    } else if (locale === 'en') {
      await import('dayjs/locale/en');
    }
    const dayjsLocale = SUPPORTED_LOCALES[locale]?.dayjsLocale ?? locale;
    dayjs.locale(dayjsLocale);
  } catch {
    // Safe fallback
  }
}
