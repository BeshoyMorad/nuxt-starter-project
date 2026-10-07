<script setup lang="ts">
  useDarkTheme();

  const { initListeners } = useNetwork();
  initListeners();
</script>

<template>
  <ErrorBoundary>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ErrorBoundary>

  <Toaster />
</template>
