<template>
  <main class="c-container pb-20 pt-8">
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
      <div v-else class="mx-auto space-y-2 md:max-w-md">
        <TodoCard
          v-for="(todo, i) in todos"
          :key="`todo-${todo.id}`"
          :todo="todo"
          :style="`z-index: ${todos.length - i}`"
					class="relative"
        />
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useApiHandle } from '@/core/api/composables'
import { DotsLoader, Status } from '@/features/common/components'

import { useTodosStore } from '../store'
import TodoCard from '../components/TodoCard.vue'

const store = useTodosStore()
const { todosApiStatus: apiStatus, todosApiMsg: apiMsg, todos } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

getTodos()
function getTodos() {
  store.getTodos({
    page: 1,
    pageSize: 100,
  })
}
</script>
