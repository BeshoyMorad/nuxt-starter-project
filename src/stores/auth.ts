const ACCESS_TOKEN_STORAGE_KEY = 'app_access_token';
const REFRESH_TOKEN_STORAGE_KEY = 'app_refresh_token';
const USER_STORAGE_KEY = 'user';

export const useAuthStore = defineStore('auth', () => {
  const tokenCookie = useCookie<string | null>(ACCESS_TOKEN_STORAGE_KEY, { default: () => null });
  const refreshTokenCookie = useCookie<string | null>(REFRESH_TOKEN_STORAGE_KEY, { default: () => null });
  const userCookie = useCookie<unknown>(USER_STORAGE_KEY, { default: () => null });

  const accessToken = ref(tokenCookie.value || '');
  const refreshToken = ref(refreshTokenCookie.value || '');
  const user = ref<unknown>(userCookie.value || null);

  const isAuthenticated = computed(() => Boolean(accessToken.value || tokenCookie.value));

  const login = async (payload: { access_token: string; refresh_token: string; user: unknown }) => {
    tokenCookie.value = payload.access_token;
    refreshTokenCookie.value = payload.refresh_token;
    userCookie.value = payload.user;

    accessToken.value = payload.access_token;
    refreshToken.value = payload.refresh_token;
    user.value = payload.user;
  };

  const clearAuth = () => {
    tokenCookie.value = null;
    refreshTokenCookie.value = null;
    userCookie.value = null;

    accessToken.value = '';
    refreshToken.value = '';
    user.value = null;
    navigateTo('/auth/login');
  };

  const getRefreshToken = async () => {
    try {
      // Execute token refresh API request here
    } catch {
      clearAuth();
    }
  };

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    clearAuth,
    getRefreshToken,
  };
});
