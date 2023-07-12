<template>
  <main class="c-container pb-20 pt-4 md:max-w-lg">
    <div v-if="apiHandle.isLoading.value" class="flex items-center gap-x-3">
      <p>Fetching todos...</p>
      <DotsLoader />
    </div>
    <Status v-else-if="apiHandle.isError.value" variant="error" @retry="getTodos">
      {{ apiMsg }}
    </Status>
    <template v-else>
      <div v-if="todos.length === 0" class="text-center">
        <p>You have not added any todos yet</p>
      </div>
      <template v-else>
        <TabGroup
          :selected-index="selectedTodoType"
          as="div"
          class="w-full max-w-lg text-sm sm:px-0"
          @change="(index) => (selectedTodoType = index)"
        >
          <div
            class="sticky top-16 flex items-center justify-between gap-x-2 bg-surface py-3 dark:bg-surface-dark"
            :style="{ zIndex: todos.length + 1 }"
          >
            <TabList class="flex flex-1 space-x-1 rounded-xl bg-slate-200 p-1">
              <Tab
                v-for="(type, i) of todoTypes"
                :key="`todo-btn-${i}`"
                as="template"
                v-slot="{ selected }"
              >
                <button
                  :class="[
                    'w-full rounded-lg py-2 text-sm leading-5 text-slate-900',
                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-primary focus:outline-none focus:ring-2',
                    selected
                      ? 'bg-white shadow'
                      : 'text-blue-100 hover:bg-primary/10 hover:text-primary-dark',
                  ]"
                >
                  {{ type }}
                </button>
              </Tab>
            </TabList>
            <AddTodo class="max-sm:fixed" />
          </div>
          <div class="mb-2 hidden h-[1px] bg-slate-200 md:block" aria-hidden="true" />
          <TabPanels class="mt-2">
            <TransitionGroup
              :enter-from-class="`opacity-50 ${wentToNext ? 'translate-x-8' : '-translate-x-8'}`"
              enter-active-class="transition-[opacity,transform] duration-500"
              leave-active-class="transition-[opacity,transform] duration-500"
              :leave-to-class="`opacity-50 ${wentToNext ? 'translate-x-8' : '-translate-x-8'}`"
            >
              <TabPanel
                v-for="i in todoTypes.length"
                :key="`todo-type-view-${i}`"
                :class="[
                  'space-y-2 rounded-xl bg-surface dark:bg-surface-dark',
                  'relative ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                ]"
                :tab-index="0"
              >
                <TransitionGroup
                  move-class="transition-[opacity,transform] duration-500"
                  enter-from-class="opacity-0 !scale-[0.75]"
                  enter-active-class="transition-[opacity,transform] !z-0 duration-500"
                  leave-active-class="transition-[opacity,transform] !z-0 duration-500 !absolute"
                  leave-to-class="opacity-0 !scale-[0.75]"
                >
                  <template v-if="todosToShow.length">
                    <TodoCard
                      v-for="(todo, i) in todosToShow"
                      :key="`todo-${todo.id}`"
                      :todo="todo"
                      :style="`z-index: ${todos.length - i}`"
                      class="relative w-full"
                    />
                  </template>
                  <p class="py-3 text-center" v-else>No Todos found</p>
                </TransitionGroup>
              </TabPanel>
            </TransitionGroup>
          </TabPanels>
        </TabGroup>
      </template>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import { useApiHandle } from '@/core/api/composables'
import { DotsLoader, Status } from '@/features/common/components'

import { useTodosStore } from '../store'
import TodoModel from '../models/todo.model'
import TodoCard from '../components/TodoCard.vue'
import AddTodo from '../components/AddTodo.vue'

const store = useTodosStore()
const { todosApiStatus: apiStatus, todosApiMsg: apiMsg, todos } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const prevSelectedTodoType = ref(0)
const selectedTodoType = ref(1)
const todoTypes = ['All', 'Not Completed', 'Completed'] as const
const todosToShow = computed<TodoModel[]>(() => {
  const selected = todoTypes[selectedTodoType.value]

  if (selected === 'Completed') return todos.value.filter((todo) => todo.isCompleted)
  if (selected === 'Not Completed') return todos.value.filter((todo) => !todo.isCompleted)

  return todos.value
})
const wentToNext = ref(false)
watch(selectedTodoType, (idx) => {
  wentToNext.value = idx - prevSelectedTodoType.value > 0
  prevSelectedTodoType.value = idx
})

getTodos()
function getTodos() {
  store.getTodos({
    page: 1,
    pageSize: 100,
  })
}
</script>

<style lang="scss" scoped>
.todo-filters {
  button {
    @apply border border-slate-300 px-3 py-1 text-sm transition-colors;

    &:hover {
      @apply bg-primary/10 text-primary-dark;
    }

    &:first-child {
      @apply rounded-l-lg border-r-0;
    }

    &:last-child {
      @apply rounded-r-lg border-l-0;
    }

    &.active {
      @apply border-primary/30 bg-primary/30 text-on-primary;
    }
  }
}
</style>
