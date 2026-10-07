import type { Component } from 'vue';
import { Field } from '@/components/form';

export default defineNuxtPlugin((nuxtApp) => {
  for (const [key, comp] of Object.entries(Field)) {
    nuxtApp.vueApp.component(`Field.${key}`, comp as Component);
    nuxtApp.vueApp.component(`Field${key}`, comp as Component);
  }
  (nuxtApp.vueApp.config.globalProperties as Record<string, unknown>).Field = Field;
});
