<template>
  <div class="c-container px-3 pb-12 pt-3">
    <div class="flex items-center justify-between">
      <h1 class="mb-3 flex items-center gap-x-3">
        <BackButton>TodoDetails</BackButton>
        <DotsLoader v-if="apiHandle.isLoading.value" />
      </h1>
      <div v-if="todo" class="flex items-center">
        <Modal show-title>
          <template #trigger="{ openModal }">
            <Button variant="icon" class="bg-transparent" @click="openModal"><PencilIcon /></Button>
          </template>
          <template #title>
            <h2 class="text-center">Update Todo</h2>
          </template>
          <template #default="{ closeModal }">
            <UpdateTodo :todo="todo" @close-modal="closeModal" />
          </template>
        </Modal>
        <Modal show-title>
          <template #trigger="{ openModal }">
            <Button
              variant="icon"
              class="bg-transparent text-red-600 hover:bg-red-50"
              @click="openModal"
              ><TrashIcon
            /></Button>
          </template>
          <template #title>
            <h2 class="text-center">Delete Todo</h2>
          </template>
          <template #default="{ closeModal }">
            <DeleteTodo :todo="todo" @close-modal="closeModal" />
          </template>
        </Modal>
      </div>
    </div>
    <div v-if="apiHandle.isError.value" class="error mb-3">
      <p class="title">Error</p>
      <p class="capitalize">{{ apiMsg }}</p>
    </div>
    <section v-if="todo" class="mt-2 md:mt-4">
      <div class="space-y-4">
        <div>
          <p class="smallcaps text-sm opacity-80">Title</p>
          <p class="">{{ todo.title }}</p>
        </div>
        <div>
          <p class="smallcaps text-sm opacity-80">Description</p>
          <p class="">{{ todo.description }}</p>
        </div>
        <div class="flex gap-x-8">
          <div>
            <p class="smallcaps text-sm">Created</p>
            <p>{{ parseDate(todo.createdAt) }}</p>
          </div>
          <div v-if="todo.updatedAt">
            <p class="smallcaps text-sm">Updated</p>
            <p>{{ parseDate(todo.updatedAt) }}</p>
          </div>
          <div v-if="todo.completedAt">
            <p class="smallcaps text-sm">Completed</p>
            <p>{{ parseDate(todo.completedAt) }}</p>
          </div>
        </div>
      </div>

      <Button
        variant="text-icon"
        class="mt-4"
        :loading="updateApiHandle.isLoading.value"
        @click.stop="toggleCompleted"
      >
        <template v-if="todo.isCompleted">
          <XMarkIcon class="h-4 w-4" />
          Mark As Incomplete
        </template>
        <template v-else>
          <CheckIcon class="h-4 w-4" />
          Mark As Complete
        </template>
      </Button>
    </section>

    <!-- DO NOT REMOVE THIS LINE -->
    <p class="hidden">{{ rebuildTrigger }}</p>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { XMarkIcon, CheckIcon, PencilIcon, TrashIcon } from '@heroicons/vue/20/solid'

import { useApiHandle } from '@/core/api/composables'
import { parseDate } from '@/common/functional'
import { BackButton, Button, DotsLoader, Modal } from '@/features/common/components'

import UpdateTodo from '../components/UpdateTodo.vue'
import DeleteTodo from '../components/DeleteTodo.vue'
import { useTodosStore } from '../store'
import type { TTodoUpdatePayload } from '../services'
import { onMounted, onUnmounted, ref } from 'vue'
import { differenceInDays, differenceInHours } from 'date-fns'

const store = useTodosStore()
const {
  todoApiStatus: apiStatus,
  todoApiMsg: apiMsg,
  todo,
  todoUpdateApiStatus: updateApiStatus,
  todoUpdateApiMsg: updateApiMsg,
} = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)
const updateApiHandle = useApiHandle(updateApiStatus)

const route = useRoute()
const id = route.params.id as string
getTodo()
function getTodo() {
  store.getTodo(id)
}

async function toggleCompleted() {
  if (todo.value === null) return

  const payload: TTodoUpdatePayload = {
    isCompleted: !todo.value.isCompleted,
  }

  await store.updateTodo(id, payload)
}

const rebuildTrigger = ref(false)
let createdAtTimer: number | null = null
let updatedAtTimer: number | null = null
let completedAtTimer: number | null = null
function handleTimer(date: Date): number | null {
  const now = new Date()

  const diffInDays = differenceInDays(now, date)
  if (diffInDays > 1) return null

  let timeout = 1000 * 60

  const diffInHours = differenceInHours(now, date)
  if (diffInHours > 1) timeout *= 60

  return setInterval(() => (rebuildTrigger.value = !rebuildTrigger.value), timeout)
}
onMounted(() => {
  if (todo.value == null) return
  createdAtTimer = handleTimer(todo.value.createdAt)

  if (todo.value.updatedAt) updatedAtTimer = handleTimer(todo.value.updatedAt)
  if (todo.value.completedAt) completedAtTimer = handleTimer(todo.value.completedAt)
})
onUnmounted(() => {
  const timers = [createdAtTimer, updatedAtTimer, completedAtTimer]
	timers.forEach((timer) => {
    if (timer) clearInterval(timer)
  })
})
</script>
