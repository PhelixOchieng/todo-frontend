<template>
  <main class="c-container pb-20 pt-8 md:max-w-lg">
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
        <div class="flex items-center justify-between px-3 text-sm">
          <p>Showing</p>
          <div class="todo-filters flex">
            <button
              v-for="(type, i) of todoTypes"
              :key="`todo-btn-${type}`"
              :class="{ active: i === selectedTodoType }"
              @click.stop="selectedTodoType = i"
            >
              {{ type }}
            </button>
          </div>
          <p>Todos</p>
        </div>
        <div class="mb-2 mt-3 h-[1px] bg-slate-200" aria-hidden="true" />
        <div class="space-y-2 px-3">
          <TodoCard
            v-for="(todo, i) in todosToShow"
            :key="`todo-${todo.id}`"
            :todo="todo"
            :style="`z-index: ${todos.length - i}`"
            class="relative"
          />
        </div>
      </template>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useApiHandle } from '@/core/api/composables'
import { DotsLoader, Status } from '@/features/common/components'

import { useTodosStore } from '../store'
import TodoCard from '../components/TodoCard.vue'
import TodoModel from '../models/todo.model'

const store = useTodosStore()
const { todosApiStatus: apiStatus, todosApiMsg: apiMsg, todos } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const selectedTodoType = ref(0)
const todoTypes = ['All', 'Completed', 'Not Completed'] as const
const todosToShow = computed<TodoModel[]>(() => {
  const selected = todoTypes[selectedTodoType.value]

  if (selected === 'Completed') return todos.value.filter((todo) => todo.isCompleted)
  if (selected === 'Not Completed') return todos.value.filter((todo) => !todo.isCompleted)

  return todos.value
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
