<script setup lang="ts">
  definePageMeta({
    title: 'Access Denied',
  });

  const goHome = () => navigateTo('/');
</script>

<template>
  <ExceptionState
    icon="hugeicons--unavailable"
    title="Access Denied!"
    description="We're sorry, but you don't have permission to access this page."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
