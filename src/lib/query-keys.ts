import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { authKeys } from '@/modules/auth/auth.keys';
import { starterKeys } from '@/modules/starter/starter.keys';

/**
 * Global registry for all TanStack Query keys.
 * Each module owns its keys in `<module>/<module>.keys.ts` (createQueryKeys);
 * this file only merges them. Register a new module's keys here.
 */
export const queryKeys = mergeQueryKeys(authKeys, starterKeys);
