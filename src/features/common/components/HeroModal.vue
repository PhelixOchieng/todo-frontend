<template>
  <div>
    <div ref="triggerWrapper">
      <slot name="trigger" :openModal="openModal" />
    </div>

    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-30">
        <!-- Barrier -->
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-[400ms] ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-slate-500/20 backdrop-blur dark:bg-slate-900/20" />
        </TransitionChild>

        <div class="fixed inset-0">
          <div ref="bodyWrapper" class="mx-auto mt-10 h-full w-full max-w-md">
            <TransitionChild
              as="div"
              leave="duration-[500ms]"
              class="relative h-full w-full transition-all"
              :style="`
--panel-from-left: ${fromPos.x}px;
--panel-from-top: ${fromPos.y}px;
--panel-from-width: ${fromSize.width}px;
--panel-from-height: ${fromSize.height}px;
`"
              @before-enter="beforeEnter"
              @before-leave="beforeLeave"
            >
              <Transition
                enter-active-class="duration-[500ms] ease-out-in"
                enter-from-class="panel__initial"
                enter-to-class="left-0 top-0"
                leave-from-class="left-0 top-0"
                leave-active-class="duration-[600ms] ease-in-out"
                leave-to-class="panel__initial"
              >
                <DialogPanel
                  v-if="showBody"
                  class="relative max-h-[1000px] w-full overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:border dark:border-slate-100/10"
                >
                  <DialogTitle
                    as="h3"
                    class="mb-3 text-center text-lg font-medium leading-6 text-gray-900"
                    v-if="showTitle"
                  >
                    <slot name="title" />
                  </DialogTitle>
                  <slot :closeModal="closeModal" />
                </DialogPanel>
              </Transition>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

defineProps<{ showTitle?: boolean }>()
const isOpen = ref(false)
const emit = defineEmits<{ close: [] }>()

function closeModal() {
  isOpen.value = false
  emit('close')
}
function openModal() {
  isOpen.value = true
}

const triggerWrapper = ref<HTMLDivElement | null>(null)
const bodyWrapper = ref<HTMLDivElement | null>(null)
const fromPos = ref({ x: 0, y: 0 })
const fromSize = ref({ width: 0, height: 0 })

const showBody = ref(false)
function beforeEnter() {
  const el = triggerWrapper.value!.firstElementChild!
  const { x: bodyX, y: bodyY } = bodyWrapper.value!.getBoundingClientRect()

  const { x, y, width, height } = el.getBoundingClientRect()
  const elX = x - bodyX
  const elY = y - bodyY
  fromPos.value = { x: elX, y: elY }
  fromSize.value = { width, height }

  showBody.value = true
}
function beforeLeave() {
  showBody.value = false
}
</script>

<style scoped lang="scss">
.panel__initial {
  left: var(--panel-from-left);
  top: var(--panel-from-top);
  width: var(--panel-from-width);
  max-height: var(--panel-from-height);
  border-radius: calc(0.25rem * 2) !important;
}
</style>
