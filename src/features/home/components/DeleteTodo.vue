<template>
  <Status v-if="apiHandle.isError.value" variant="error" :should-retry="false">
    {{ apiMsg }}
  </Status>
  <p class="text-center">
    Are you sure you want to delete this item?<br />
    This is an irreversible action.
  </p>
  <div class="mx-auto mt-2 rounded-lg bg-slate-100 px-4 py-2 md:w-4/5">
    <p class="font-semibold">{{ todo.title }}</p>
    <p v-if="todo.description" class="opacity-60">{{ todo.description }}</p>
  </div>
  <div class="mt-8 flex justify-center gap-x-2">
    <button
      type="button"
      class="btn-text rounded-md"
      :disabled="apiHandle.isLoading.value"
      @click="closeModal"
    >
      Cancel
    </button>
    <button
      type="submit"
      :class="[
        'btn bg-red-100 text-red-700 hover:bg-red-200',
        'focus:ring-red-100 focus:ring-offset-red-300',
        { loading: apiHandle.isLoading.value },
      ]"
      @click="deleteTodo"
    >
      Delete
    </button>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useApiHandle } from '@/core/api/composables'
import { Status } from '@/features/common/components'

import { useTodosStore } from '../store'
import type TodoModel from '../models/todo.model'

const props = defineProps<{ todo: TodoModel }>()
const emit = defineEmits<{ closeModal: [] }>()

const store = useTodosStore()
const { todoDeleteApiStatus: apiStatus, todoDeleteApiMsg: apiMsg } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

async function deleteTodo() {
  await store.deleteTodo(props.todo.id.toString())
  if (!apiHandle.isSuccess.value) return

  closeModal()
}

function closeModal() {
  emit('closeModal')
}
</script>
