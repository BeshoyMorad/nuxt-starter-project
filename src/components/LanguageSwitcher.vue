<script setup lang="ts">
  import { FALLBACK_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from '@/locales/config';

  const { locale, setLocale } = useI18n();
  const isLoadingLocale = ref(false);

  const currentLocaleMeta = computed(
    () => SUPPORTED_LOCALES[locale.value as LocaleCode] || SUPPORTED_LOCALES[FALLBACK_LOCALE]
  );
  const supportedLocales = Object.values(SUPPORTED_LOCALES);

  const handleLocaleSelect = async (code: LocaleCode) => {
    isLoadingLocale.value = true;
    try {
      await setLocale(code);
    } finally {
      isLoadingLocale.value = false;
    }
  };
</script>

<template>
  <ClientOnly>
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button outline size="sm" test-id="language-switcher-trigger" :loading="isLoadingLocale">
          <span class="text-base leading-none">{{ currentLocaleMeta.flag }}</span>
          <span>{{ currentLocaleMeta.nativeLabel }}</span>
          <span class="text-text-disabled text-xs uppercase"
            >({{ currentLocaleMeta.direction }})</span
          >
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="min-w-44 p-1">
        <DropdownMenuItem
          v-for="meta in supportedLocales"
          :key="meta.code"
          :test-id="`locale-option-${meta.code}`"
          class="hover:bg-surface-secondary flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors"
          :class="{
            'bg-surface-secondary/60 font-semibold': meta.code === currentLocaleMeta.code,
          }"
          @click="handleLocaleSelect(meta.code)"
        >
          <div class="flex items-center gap-2.5">
            <span class="text-base leading-none">{{ meta.flag }}</span>
            <div class="flex flex-col">
              <span class="text-text-primary">{{ meta.nativeLabel }}</span>
              <span class="text-text-disabled text-xs">{{ meta.label }}</span>
            </div>
          </div>

          <span
            v-if="meta.code === currentLocaleMeta.code"
            class="bg-primary-600 size-2 rounded-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </ClientOnly>
</template>
