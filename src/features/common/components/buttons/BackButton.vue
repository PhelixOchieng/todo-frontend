<template>
  <div class="flex w-max items-center gap-x-2">
    <Button variant="icon" class="" @click="gotoRoute">
      <ArrowLongLeftIcon class="h-5 w-5" />
    </Button>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useRouter, type RouteLocationRaw } from 'vue-router'
import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline'

import { Button } from '.';

const props = defineProps<{ custom?: boolean; to?: RouteLocationRaw }>()
const emit = defineEmits<{ click: [] }>()

const router = useRouter()
function gotoRoute() {
  if (props.custom) {
    emit('click')
    return
  }

  if (props.to) router.push(props.to)
  else router.back()
}
</script>
