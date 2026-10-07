/* eslint-disable @typescript-eslint/no-empty-object-type */
import type en from './en';
import type { datetimeFormats, numberFormats } from './index';

export type MessageSchema = typeof en;
export type DateTimeSchema = Record<keyof (typeof datetimeFormats)['en'], Intl.DateTimeFormatOptions>;
export type NumberSchema = Record<keyof (typeof numberFormats)['en'], Intl.NumberFormatOptions>;

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat extends DateTimeSchema {}
  export interface DefineNumberFormat extends NumberSchema {}
}

declare module '@intlify/core-base' {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat extends DateTimeSchema {}
  export interface DefineNumberFormat extends NumberSchema {}
}

export {};
