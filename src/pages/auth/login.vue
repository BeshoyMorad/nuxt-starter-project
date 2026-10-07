<script setup lang="ts">
  definePageMeta({
    layout: 'auth',
    title: 'Sign In',
  });

  const authStore = useAuthStore();
  const { handleRedirect } = useAuthRedirect();
  const { t } = useAppLocale();

  const email = ref('admin@example.com');
  const password = ref('password123');
  const isLoading = ref(false);

  const handleSubmit = async () => {
    isLoading.value = true;
    try {
      await authStore.login({
        access_token: 'mock-jwt-token',
        refresh_token: 'mock-refresh-token',
        user: { id: 1, email: email.value, role: 'admin' },
      });
      handleRedirect('/');
    } finally {
      isLoading.value = false;
    }
  };
</script>

<template>
  <div
    class="bg-bg-surface w-full max-w-md rounded-2xl border border-gray-200 p-8 shadow-xl dark:border-gray-800"
  >
    <div class="mb-6 text-center">
      <div
        class="bg-primary-600/10 text-primary-600 mx-auto mb-3 flex size-12 items-center justify-center rounded-xl"
      >
        <Icon icon="hugeicons--lock-password" class="size-6" />
      </div>
      <h1 class="text-text-primary text-2xl font-bold tracking-tight">
        {{ t('auth.welcomeBack') }}
      </h1>
      <p class="text-text-tertiary mt-1 text-sm">Sign in to your Nuxt 3 workspace</p>
    </div>

    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div class="space-y-1">
        <label class="text-text-primary text-xs font-semibold tracking-wider uppercase">
          {{ t('auth.email') }}
        </label>
        <Field.Text
          v-model="email"
          type="email"
          placeholder="name@company.com"
          icon="hugeicons--mail-01"
          test-id="login-email"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="text-text-primary text-xs font-semibold tracking-wider uppercase">
          {{ t('auth.password') }}
        </label>
        <Field.Password
          v-model="password"
          placeholder="••••••••"
          icon="hugeicons--square-lock-password"
          test-id="login-password"
          required
        />
      </div>

      <Button test-id="login-submit" type="submit" class="w-full" :loading="isLoading">
        {{ t('auth.signIn') }}
      </Button>

      <div class="pt-2 text-center">
        <NuxtLink to="/" class="text-primary-600 hover:text-primary-700 text-xs font-medium">
          ← Return to Public Home
        </NuxtLink>
      </div>
    </form>
  </div>
</template>
