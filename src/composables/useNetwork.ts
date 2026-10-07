import { warn } from '@/utils/toast';

const OFFLINE_REDIRECT_KEY = 'offline_redirect_url';

export const isOnline = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);

const getRedirectPath = (): string | null => {
  if (typeof window === 'undefined') return null;
  const route = useRoute();
  const queryRedirect = route.query.redirect as string;
  if (queryRedirect) return queryRedirect;

  return sessionStorage.getItem(OFFLINE_REDIRECT_KEY);
};

const saveRedirectPath = (path: string) => {
  if (
    typeof window !== 'undefined' &&
    path &&
    !path.includes('/no-internet') &&
    !path.includes('/access-denied') &&
    !path.includes('/internal-server-error')
  ) {
    sessionStorage.setItem(OFFLINE_REDIRECT_KEY, path);
  }
};

const clearRedirectPath = () => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(OFFLINE_REDIRECT_KEY);
  }
};

export const handleOffline = (redirectPath?: string | Event) => {
  isOnline.value = false;
  const route = useRoute();
  if (route.path !== '/no-internet') {
    const targetPath = typeof redirectPath === 'string' ? redirectPath : route.fullPath;
    saveRedirectPath(targetPath);
    navigateTo({
      path: '/no-internet',
      query: { redirect: targetPath },
    });
  }
};

export const handleOnline = () => {
  isOnline.value = true;
  const route = useRoute();
  if (route.path === '/no-internet') {
    const redirect = getRedirectPath();
    navigateTo(redirect || '/');
    clearRedirectPath();
  }
};

export const tryAgain = () => {
  if (typeof navigator !== 'undefined' && navigator.onLine) {
    handleOnline();
  } else {
    warn('You are still offline. Please check your connection.');
  }
};

export const useNetwork = () => {
  const initListeners = () => {
    onMounted(() => {
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);

      if (!navigator.onLine) {
        handleOffline();
      }
    });

    onUnmounted(() => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    });
  };

  return {
    isOnline,
    handleOffline,
    handleOnline,
    tryAgain,
    initListeners,
  };
};
