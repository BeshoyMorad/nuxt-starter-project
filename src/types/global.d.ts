import type { RowData } from '@tanstack/vue-table';
import type { FormFields } from '@/components/form';

export {};

type DynamicFieldComponents = {
  [K in keyof FormFields as `Field.${K & string}`]: FormFields[K];
};

declare module 'vue' {
  interface ComponentCustomProperties {
    Field: FormFields;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface GlobalComponents extends DynamicFieldComponents {}
}

declare global {
  export type Prettify<T> = T & { [K in keyof T]: T[K] };

  interface ApiResponse<T = unknown> {
    message: string;
    data: T;
  }

  interface ApiErrorResponse {
    message: string;
    error?: string;
    statusCode: number;
    errors?: Record<string, string | string[]>;
  }

  interface Image {
    url: string;
    extension: string;
    name: string;
    path: string;
  }

  // Standard Offset Pagination Meta
  interface Meta {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  }

  // Cursor Pagination Meta
  interface CursorMeta {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor: string | null;
    previousCursor: string | null;
    limit: number;
  }

  interface CursorPaginatedResponse<T = unknown> {
    data: T[];
    meta: CursorMeta;
  }

  interface OffsetPaginatedResponse<T = unknown> {
    data: T[];
    meta: Meta;
  }
}

declare module '@tanstack/vue-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right';
    width?: string;
    colSpan?: number;
  }
}
