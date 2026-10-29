import { setYupTranslator } from '@/lib/yup/i18n';
import { setupYupLocale } from '@/lib/yup';

/**
 * Points Yup's built-in messages at vue-i18n. Client-only: validation runs in the browser,
 * and a module-level translator must not be shared between server requests.
 */
export default defineNuxtPlugin((nuxtApp) => {
  setYupTranslator((key, values) => nuxtApp.$i18n.t(key, values ?? {}));
  setupYupLocale();
});
