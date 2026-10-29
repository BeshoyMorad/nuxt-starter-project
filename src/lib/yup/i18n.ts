type Translate = (key: string, values?: Record<string, unknown>) => string;

let translate: Translate = (key) => key;

/**
 * Connects Yup messages to the active i18n instance.
 * Called once from the client-only `plugins/yup.client.ts`, because Nuxt exposes i18n
 * per app instance (`nuxtApp.$i18n`) and there is no global one to import.
 */
export function setYupTranslator(fn: Translate): void {
  translate = fn;
}

export const t: Translate = (key, values) => translate(key, values);
