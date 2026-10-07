<script setup lang="ts">
  definePageMeta({
    title: 'Internal Server Error',
  });

  const goHome = () => navigateTo('/');
</script>

<template>
  <ExceptionState
    icon="hugeicons--work-alert"
    title="Oops! Something went wrong on our end."
    description="Server issues are often temporary. Try accessing the module again in a few minutes."
    button-label="Back to home"
    :button-action="goHome"
  />
</template>
