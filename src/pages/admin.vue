<script setup lang="ts">
  definePageMeta({
    title: 'Admin Dashboard',
    middleware: ['permission'],
    permission: 'admin.create',
  });

  const permissionStore = usePermissionStore();
</script>

<template>
  <div class="space-y-6">
    <div class="border-b border-gray-200 pb-5 dark:border-gray-800">
      <span
        class="inline-flex items-center gap-1.5 rounded-full bg-purple-600/10 px-3 py-1 text-xs font-semibold text-purple-600"
      >
        <Icon icon="hugeicons--shield-user" class="size-3.5" />
        Role Middleware Guard Active
      </span>
      <h1 class="text-text-primary mt-2 text-2xl font-bold tracking-tight">Protected Admin Zone</h1>
      <p class="text-text-tertiary mt-1 text-sm">
        This route is guarded by named Nuxt route middleware: <code>middleware: ['role']</code>.
      </p>
    </div>

    <div class="bg-bg-surface rounded-xl border border-gray-200 p-6 shadow-xs dark:border-gray-800">
      <h2 class="text-text-primary text-base font-semibold">Current Permissions Matrix</h2>
      <pre class="mt-3 rounded-lg bg-gray-50 p-4 font-mono text-xs dark:bg-gray-900">{{
        JSON.stringify(permissionStore.permissions, null, 2)
      }}</pre>
    </div>
  </div>
</template>
