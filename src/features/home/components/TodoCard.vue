<template>
  <div
    :class="[
			twMerge(
            'group block rounded-md border border-slate-200 bg-container px-6 py-3',
            'shadow transition-[box-shadow,transform] duration-300',
            'hover:scale-105 hover:shadow-md',
						$attrs.class as string,
          ),
				todo.isCompleted ? 'opacity-80 hover:opacity-100' : 'opacity-100'
				]"
  >
    <div class="flex items-center justify-between gap-x-4">
      <div class="relative overflow-hidden">
        <p class="truncate text-lg font-medium">{{ todo.title }}</p>
        <div
          aria-role="none"
          :class="[
            'absolute left-0 top-1/2 h-[1px] w-full -translate-y-1/2 rounded bg-light transition-transform duration-300 dark:bg-dark',
            todo.isCompleted ? 'origin-left scale-x-100' : 'origin-right scale-x-0',
          ]"
        />
      </div>
      <div class="flex items-center gap-x-1">
        <Modal show-title>
          <template #trigger="{ openModal }">
            <Button
              variant="icon"
              :class="[
                'h-7 w-7 translate-x-1 bg-transparent text-slate-900 transition-[color,background-color,transform]',
                'duration-200 hover:!bg-primary/20 hover:!delay-0 group-hover:bg-primary/10 group-hover:text-primary-dark',
                'group-hover:translate-x-0 group-hover:delay-[400ms]',
                'group/btn relative',
              ]"
              @click="openModal"
            >
              <ViewOutlineIcon
                :class="[
                  'absolute left-1/2 top-1/2 !h-4 !w-4 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300',
                  'group-hover/btn:opacity-0',
                ]"
              />
              <ViewSolidIcon
                :class="[
                  'absolute left-1/2 top-1/2 !h-4 !w-4 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300',
                  'group-hover/btn:opacity-100',
                ]"
              />
            </Button>
          </template>
          <template #title>
            <h2 class="text-center">Todo Details</h2>
          </template>
          <template #default="{ closeModal }">
            <div class="space-y-4">
              <div>
                <p class="text-xs font-bold uppercase">Title</p>
                <p class="">{{ todo.title }}</p>
              </div>
              <div v-if="todo.description">
                <p class="text-xs font-bold uppercase">Description</p>
                <p class="">{{ todo.description }}</p>
              </div>
              <div v-if="todo.isCompleted">
                <p class="text-xs font-bold uppercase">Completed</p>
                <p class="">{{ parseDate(todo.completedAt) }}</p>
              </div>
              <div class="flex gap-x-4">
                <div class="flex-1">
                  <p class="text-xs font-bold uppercase">Created</p>
                  <p class="">{{ parseDate(todo.createdAt) }}</p>
                </div>
                <div class="flex-1">
                  <p class="text-xs font-bold uppercase">Updated</p>
                  <p class="">{{ parseDate(todo.updatedAt) }}</p>
                </div>
              </div>
            </div>

            <BackButton class="mx-auto mt-6" @click="closeModal" custom />
          </template>
        </Modal>
        <Button
          variant="icon"
          :class="[
            'translate-x-1 p-1.5 bg-transparent text-slate-900 transition-[color,background-color,transform]',
            'duration-200 hover:!bg-primary/20 hover:!delay-0',
            apiHandle.isLoading.value && todoIDBeingUpdated === todo.id.toString()
              ? 'loading'
              : 'group-hover:translate-x-0 group-hover:bg-primary/10 group-hover:text-primary-dark group-hover:delay-300',
          ]"
          @click.stop="toggleCompleted"
        >
          <XMarkIcon v-if="todo.isCompleted" class="h-4 w-4" />
          <CheckIcon v-else class="h-4 w-4" />
        </Button>
        <DropdownButton :items="todoActions" class="z-[2]">
          <template #trigger>
            <Button
							variant="icon"
              :class="[
                'bg-transparent p-1.5 text-slate-900 transition-colors duration-300',
                'hover:!bg-primary/20 group-hover:bg-primary/10 group-hover:text-primary-dark',
              ]"
            >
              <EllipsisVerticalIcon class="h-4 w-4" />
            </Button>
          </template>
          <template #dropdown-item="{ item, active, close }">
            <button
              :class="[
                'flex w-full items-center gap-x-3 rounded-md px-2 py-2 text-sm',
                { 'bg-primary text-white': active },
              ]"
              @click.stop.prevent="
                () => {
                  close()
                  item.onSelect()
                }
              "
            >
              <component
                :is="active ? item.solidIcon : item.outlineIcon"
                :class="['h-4 w-4', active ? 'text-white' : 'text-primary-dark']"
              />
              {{ item.name }}
            </button>
          </template>
        </DropdownButton>
      </div>
    </div>
    <p class="mt-2 truncate text-sm opacity-80">{{ todo.description }}</p>
    <div class="mt-1 flex items-center gap-x-1 text-xs opacity-60">
      <CalendarDaysIcon class="h-4 w-4" />
      <p v-if="todo.isCompleted">Completed: {{ parseDate(todo.completedAt!) }}</p>
      <p v-else>Created: {{ parseDate(todo.createdAt) }}</p>
    </div>

    <Snackbar v-model="isSnackbarOpen" type="error" :msg="apiMsg" :timeout="0" />
    <Modal v-model="isUpdateModalOpen" show-title :use-internal-state="false">
      <template #title>
        <h2 class="text-center">Update Todo</h2>
      </template>
      <template #default="{ closeModal }">
        <UpdateTodo :todo="todo" @close-modal="closeModal" />
      </template>
    </Modal>
    <Modal v-model="isDeleteModalOpen" show-title :use-internal-state="false">
      <template #title>
        <h2 class="text-center">Delete Todo</h2>
      </template>
      <template #default="{ closeModal }">
        <DeleteTodo :todo="todo" @close-modal="closeModal" />
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { type FunctionalComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { twMerge } from 'tailwind-merge'
import { differenceInDays, differenceInMonths, format, formatRelative } from 'date-fns'
import { EllipsisVerticalIcon, XMarkIcon } from '@heroicons/vue/20/solid'
import {
  CalendarDaysIcon,
  CheckIcon,
  EyeIcon as ViewOutlineIcon,
  TrashIcon as TrashOutlineIcon,
  PencilIcon as UpdateOutlineIcon,
} from '@heroicons/vue/24/outline'
import {
  EyeIcon as ViewSolidIcon,
  TrashIcon as TrashSolidIcon,
  PencilIcon as UpdateSolidIcon,
} from '@heroicons/vue/24/solid'

import { useApiHandle } from '@/core/api/composables'
import { Button, DropdownButton, BackButton, Modal, Snackbar } from '@/features/common/components'

import TodoModel from '../models/todo.model'
import type { TTodoUpdatePayload } from '../services'
import { useTodosStore } from '../store'
import UpdateTodo from '../components/UpdateTodo.vue'
import DeleteTodo from '../components/DeleteTodo.vue'

const store = useTodosStore()
const {
  todoUpdateApiStatus: apiStatus,
  todoUpdateApiMsg: apiMsg,
  todoIDBeingUpdated,
} = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const props = defineProps<{ todo: TodoModel }>()
const isSnackbarOpen = ref(false)
const isUpdateModalOpen = ref(false)
const isDeleteModalOpen = ref(false)

interface ITodoAction {
  name: string
  key: string
  outlineIcon: FunctionalComponent
  solidIcon: FunctionalComponent
  onSelect: () => void
}
const todoActions: ITodoAction[] = [
  {
    key: 'editTodo',
    name: 'Edit',
    outlineIcon: UpdateOutlineIcon,
    solidIcon: UpdateSolidIcon,
    onSelect: () => (isUpdateModalOpen.value = true),
  },
  {
    key: 'deleteTodo',
    name: 'Delete',
    outlineIcon: TrashOutlineIcon,
    solidIcon: TrashSolidIcon,
    onSelect: () => (isDeleteModalOpen.value = true),
  },
]

async function toggleCompleted() {
  const payload: TTodoUpdatePayload = {
    isCompleted: !props.todo.isCompleted,
  }

  await store.updateTodo(props.todo.id.toString(), payload)
}

function parseDate(date: Date | null): string {
  if (date === null) return ''

  const now = new Date()

  if (differenceInDays(date, now) <= 7)
    return formatRelative(date, now).replace(/^\w/, (v) => v.toUpperCase())
  else if (differenceInMonths(date, now) <= 12) return format(date, 'MMM do, yyyy')
  else return format(date, 'dd-MM-yyyy')
}
</script>
