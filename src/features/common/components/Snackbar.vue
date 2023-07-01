<template>
  <Teleport to="#snackbars">
    <Transition name="slide">
      <div
        v-if="show"
        :class="
          twMerge(
            'pointer-events-auto flex w-full items-center justify-between px-4 py-2 sm:w-fit md:w-fit md:max-w-lg md:rounded',
            classes,
          )
        "
      >
        <slot :close="close">
          <span>{{ msg }}</span>
          <div
            class="ml-3 grid h-10 w-10 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/20"
            @click="close"
          >
            <XMarkIcon class="h-5 w-5" />
          </div>
        </slot>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { twMerge } from 'tailwind-merge'
import { XMarkIcon } from '@heroicons/vue/24/outline'

type TSnackbarType = 'info' | 'success' | 'error'
interface IProps {
  modelValue: boolean
  msg?: string | number
  type?: TSnackbarType
  timeout?: number
}
const props = withDefaults(defineProps<IProps>(), {
  type: 'info',
  timeout: 5000,
})
const emits = defineEmits<{ (e: 'update:modelValue', state: boolean): void }>()

const show = computed<boolean>(() => props.modelValue)
let showTimeout = -1
watch(show, (s) => {
  clearTimeout(showTimeout)
  if (!s) return

  if (props.timeout === 0) return
  showTimeout = setTimeout(close, props.timeout) as unknown as number
})

function close() {
  emits('update:modelValue', false)
}

const classes = computed<string>(() => {
  switch (props.type) {
    case 'success':
      return 'bg-green-500 text-white'
    case 'error':
      return 'bg-red-500 text-white'
    default:
      return 'bg-black text-white'
  }
})
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition-property: opacity transform;
  transition: 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(50%);
}
</style>
