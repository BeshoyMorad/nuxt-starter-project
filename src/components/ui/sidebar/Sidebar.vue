<script setup lang="ts">
  const emit = defineEmits<{ close: [] }>();
  const searchQuery = ref('');
  const openSections = ref<Record<string, boolean>>({
    navigation: true,
    examples: true,
    errors: false,
  });

  interface SidebarSection {
    title: string;
    icon: string;
    id: string;
    children: {
      title: string;
      path: string;
    }[];
  }

  const sections = ref<SidebarSection[]>([
    {
      id: 'navigation',
      title: 'Main Navigation',
      icon: 'hugeicons--dashboard-square-01',
      children: [
        { title: 'Overview', path: '/' },
        { title: 'Starter Dashboard', path: '/starter' },
        { title: 'Admin (Role Guard)', path: '/admin' },
      ],
    },
    {
      id: 'examples',
      title: 'Architecture & Demos',
      icon: 'hugeicons--puzzle',
      children: [
        { title: 'Native SSR Fetch', path: '/examples/native-fetch' },
        { title: 'TanStack Query SSR', path: '/examples/tanstack-query' },
        { title: 'Localization Demo', path: '/dashboard/localization-example' },
        { title: 'Multi-Step Form', path: '/dashboard/multi-step-form' },
        { title: 'Virtual Scroll', path: '/dashboard/virtual-scroll-example' },
      ],
    },
    {
      id: 'errors',
      title: 'Error States',
      icon: 'hugeicons--alert-02',
      children: [
        { title: 'Access Denied', path: '/access-denied' },
        { title: 'Server Error', path: '/internal-server-error' },
        { title: 'No Internet', path: '/no-internet' },
      ],
    },
  ]);

  const filteredSections = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return sections.value;

    return sections.value
      .map((section) => {
        const filteredChildren = section.children.filter((item) =>
          item.title.toLowerCase().includes(query)
        );
        if (!filteredChildren.length) return null;
        return {
          ...section,
          children: filteredChildren,
        };
      })
      .filter((s): s is SidebarSection => s !== null);
  });

  const isSectionOpen = (sectionId: string) => {
    if (searchQuery.value.trim()) return true;
    return openSections.value[sectionId] ?? true;
  };

  const toggleSection = (sectionId: string) => {
    openSections.value[sectionId] = !isSectionOpen(sectionId);
  };
</script>

<template>
  <aside
    class="bg-bg-surface border-primary-600/35 relative flex h-screen w-64 shrink-0 flex-col border-r border-l"
  >
    <div class="px-4 pt-3">
      <Field.Text
        v-model="searchQuery"
        type="search"
        placeholder="Search..."
        icon="hugeicons--search-01"
        icon-position="left"
        test-id="sidebar-search"
      />
    </div>

    <nav
      class="[&::-webkit-scrollbar-thumb]:bg-primary-600/10 hover:[&::-webkit-scrollbar-thumb]:bg-primary-600/25 flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
    >
      <template v-for="section in filteredSections" :key="section.id">
        <section class="mt-2 flex flex-col gap-1">
          <div class="flex h-9 items-center justify-between">
            <div class="plain-font flex flex-1 items-center gap-2">
              <Icon :icon="section.icon" class="text-primary-600 size-4" />
              <span class="text-text-tertiary text-[11px] font-semibold tracking-wider uppercase">
                {{ section.title }}
              </span>
            </div>

            <button
              type="button"
              class="text-text-tertiary hover:bg-surface-secondary hover:text-text-primary flex size-8 items-center justify-center rounded-md transition-colors"
              @click="toggleSection(section.id)"
            >
              <span
                class="text-sm transition-transform duration-200"
                :class="{ 'rotate-180': isSectionOpen(section.id) }"
              >
                <Icon icon="hugeicons--arrow-down-01" class="size-4" />
              </span>
            </button>
          </div>

          <div v-show="isSectionOpen(section.id)" class="mx-3 flex flex-col">
            <NuxtLink
              v-for="child in section.children"
              :key="child.path"
              :to="child.path"
              class="plain-font hover:text-text-primary font-inherit flex h-9 items-center rounded-lg px-3 text-sm font-medium transition-colors"
              active-class="bg-primary-600/15 text-primary-600 font-semibold"
              @click="emit('close')"
            >
              {{ child.title }}
            </NuxtLink>
          </div>
        </section>
      </template>
    </nav>
  </aside>
</template>
