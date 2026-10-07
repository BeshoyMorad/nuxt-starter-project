import paths from "~/router/paths";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const { saveRedirectUrl } = useAuthRedirect();

  const isPublicRoute =
    to.path === paths.home ||
    to.path.startsWith('/examples') ||
    to.path.startsWith('/auth') ||
    to.path === paths.errors.accessDenied ||
    to.path === paths.errors.noInternet ||
    to.path === paths.errors.internalServerError ||
    !to.meta.requiresAuth;

  // If already authenticated and trying to access login/auth page, redirect to home
  if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
    return navigateTo(paths.home);
  }

  // If not authenticated and trying to access a protected route, redirect to login
  if (!authStore.isAuthenticated && !isPublicRoute) {
    saveRedirectUrl(to.fullPath);
    return navigateTo(paths.auth.login);
  }
});
