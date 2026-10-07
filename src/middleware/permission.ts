import { paths } from '~/router/paths';

export default defineNuxtRouteMiddleware((to) => {
  const requiredPermission = to.meta?.permission as string | string[] | undefined;
  if (!requiredPermission) {
    return;
  }

  const permissionStore = usePermissionStore();
  const operator = (to.meta?.permissionOperator as 'or' | 'and') || 'or';
  const hasAccess = permissionStore.can(requiredPermission as never, operator);

  if (!hasAccess) {
    return navigateTo(paths.errors.accessDenied);
  }
});
