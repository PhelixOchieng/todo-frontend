<template>
  <label class="flex cursor-pointer items-center justify-between">
    <slot />
    <input v-model="isChecked" type="checkbox" class="peer hidden" />
    <div
      :class="[
        'w-9 rounded-full border-2 border-slate-400 bg-primary/20 transition-colors  duration-300',
        'peer-checked:border-primary peer-checked:bg-primary',
      ]"
    >
      <div class="h-4 w-4 scale-[0.6] rounded-full bg-slate-400 duration-[inherit]" />
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue?: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const isChecked = computed<boolean>({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style lang="scss" scoped>
input:checked {
  & ~ div > div {
    @apply translate-x-full scale-90 bg-on-primary;
  }
}
</style>
