<template>
  <div
    :class="twMerge([
			'mb-2 rounded border p-3',
			variant === 'error' && 'border-red-300 bg-red-300/10 text-red-800 dark:border-red-800 dark:text-red-400',
			variant === 'success' && 'border-green-300 bg-green-300/10 text-green-800 dark:border-green-800 dark:text-green-400',
			$attrs.class as string
		])"
  >
    <p v-if="showTitle" class="mb-2 text-2xl">
      {{ title ?? `${variant[0].toUpperCase()}${variant.substring(1)}` }}
    </p>
    <p>
      <slot />
    </p>
    <slot name="action">
      <Button
        v-if="variant === 'error' && shouldRetry"
        class="mt-2 block w-max"
        @click.prevent.strop="$emit('retry')"
      >
        Retry
      </Button>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge'

import { Button } from './buttons';

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    variant: 'error' | 'success'
    title?: string
    showTitle?: boolean
    shouldRetry?: boolean
  }>(),
  { showTitle: true, shouldRetry: true },
)

defineEmits<{ retry: [] }>()
</script>
