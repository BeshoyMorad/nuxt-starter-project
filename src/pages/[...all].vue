<script setup lang="ts">
  definePageMeta({
    title: 'Page Not Found',
  });

  const goHome = () => navigateTo('/');
</script>

<template>
  <ExceptionState
    icon="hugeicons--alert-02"
    title="Oops! We can't find that page."
    description="The page you’re looking for doesn’t exist or has been removed. Please go back to the home page."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
