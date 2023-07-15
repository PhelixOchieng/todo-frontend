<template>
  <button
    v-bind="attrs"
    :class="twMerge(variants[variant], 'relative', $attrs.class as string, loading && 'pointer-events-none grayscale transition-colors !text-transparent')"
  >
    <slot />
    <div
      :class="[
        'absolute pointer-events-none left-1/2 top-1/2 aspect-square h-3/5 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[inherit]',
        loading ? 'opacity-100' : 'opacity-0',
      ]"
      aria-role="none"
    >
      <div class="absolute inset-0 rounded-full border-2 border-black/20" arial-role="none" />
      <div
        class="absolute inset-0 animate-spin rounded-full border-2 border-white border-b-transparent border-r-transparent"
        aria-role="none"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { twMerge } from 'tailwind-merge'

import { variants } from './variants'

defineOptions({
  inheritAttrs: false,
})
withDefaults(defineProps<{ variant?: keyof typeof variants; loading?: boolean }>(), {
  variant: 'base',
})

const attrsRaw = useAttrs()
const attrs = computed<Record<string, any>>(() => {
  const built: Record<string, any> = {}
  for (const attr in attrsRaw) {
    if (attr === 'class') continue

    built[attr] = attrsRaw[attr]
  }

  return built
})
</script>
