import { useSessionStorage } from '@vueuse/core';

export const REDIRECT_URL_KEY = 'redirect_url';

export const useAuthRedirect = () => {
  const savedUrl = useSessionStorage<string | null>(REDIRECT_URL_KEY, null);

  const saveRedirectUrl = (url: string) => {
    if (url && !url.includes('/auth/')) {
      savedUrl.value = url;
    }
  };

  const getRedirectUrl = () => {
    return savedUrl.value;
  };

  const clearRedirectUrl = () => {
    savedUrl.value = null;
  };

  const handleRedirect = (fallbackPath: string = '/') => {
    const url = savedUrl.value;
    clearRedirectUrl();
    if (url) {
      navigateTo(url);
    } else {
      navigateTo(fallbackPath);
    }
  };

  return {
    savedUrl,
    saveRedirectUrl,
    getRedirectUrl,
    clearRedirectUrl,
    handleRedirect,
  };
};
