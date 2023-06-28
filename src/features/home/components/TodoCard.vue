<template>
  <div
    :class="twMerge(
            'group block rounded-md border border-slate-200 bg-container px-6 py-3',
            'shadow transition-[box-shadow,transform] duration-300',
            'hover:scale-105 hover:shadow-md',
						$attrs.class as string,
          )"
  >
    <div class="flex items-center justify-between">
      <p class="text-lg font-medium">{{ todo.title }}</p>
      <div class="flex items-center gap-x-1">
        <button
          :class="[
            'btn-icon h-7 w-7 translate-x-1 bg-transparent text-slate-900 transition-[color,background-color,transform]',
            'duration-200 hover:!bg-primary/20 hover:!delay-0 group-hover:bg-primary/10 group-hover:text-primary-dark',
            'group-hover:translate-x-0 group-hover:delay-[400ms]',
            'group/btn relative',
          ]"
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
        </button>
        <button
          :class="[
            'btn-icon translate-x-1 bg-transparent p-1 text-slate-900 transition-[color,background-color,transform]',
            'duration-200 hover:!bg-primary/20 hover:!delay-0',
            apiHandle.isLoading.value && todoIDBeingUpdated === todo.id.toString()
              ? 'loading'
              : 'group-hover:translate-x-0 group-hover:bg-primary/10 group-hover:text-primary-dark group-hover:delay-300',
          ]"
					@click.stop="toggleCompleted"
        >
          <XMarkIcon v-if="todo.isCompleted" class="h-4 w-4" />
          <CheckIcon v-else class="h-4 w-4" />
        </button>
        <DropdownButton :items="todoActions" class="z-[2]">
          <template #trigger>
            <button
              :class="[
                'btn-icon bg-transparent p-1 text-slate-900 transition-colors duration-300',
                'hover:!bg-primary/20 group-hover:bg-primary/10 group-hover:text-primary-dark',
              ]"
            >
              <EllipsisVerticalIcon class="h-4 w-4" />
            </button>
          </template>
          <template #dropdown-item="{ item, active, close }">
            <button
              :class="[
                'flex w-full items-center gap-x-3 rounded-md px-2 py-2 text-sm',
                { 'bg-primary text-white': active },
              ]"
              @click.stop.prevent="() => close() && item.onSelect(item)"
            >
              <component
                :is="active ? item.solidIcon : item.outlineIcon"
                :class="['h-5 w-5', { 'text-white': active }]"
              />
              {{ item.name }}
            </button>
          </template>
        </DropdownButton>
      </div>
    </div>
    <p class="mt-2 truncate text-sm opacity-80">{{ todo.description }}</p>
    <div class="mt-1 flex items-center gap-x-1 opacity-60">
      <CalendarDaysIcon class="h-4 w-4" />
      <p class="text-sm">{{ parseDate(todo.createdAt) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type FunctionalComponent, computed } from 'vue'
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

import { DropdownButton } from '@/features/common/components'

import TodoModel from '../models/todo.model'
import type { TTodoUpdatePayload } from '../services'
import { useTodosStore } from '../store'
import { storeToRefs } from 'pinia'
import { useApiHandle } from '@/core/api/composables'

const store = useTodosStore()
const {
  todoUpdateApiStatus: apiStatus,
  todoUpdateApiMsg: apiMsg,
  todoIDBeingUpdated,
} = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const props = defineProps<{ todo: TodoModel }>()

interface ITodoAction {
  name: string
  key: string
  outlineIcon: FunctionalComponent
  solidIcon: FunctionalComponent
  onSelect: (todo: TodoModel) => void
}
const todoActions: ITodoAction[] = [
  {
    key: 'editTodo',
    name: 'Edit',
    outlineIcon: UpdateOutlineIcon,
    solidIcon: UpdateSolidIcon,
    onSelect(todo) {
      console.log('Selected', todo)
    },
  },
  {
    key: 'deleteTodo',
    name: 'Delete',
    outlineIcon: TrashOutlineIcon,
    solidIcon: TrashSolidIcon,
    onSelect(todo) {
      console.log('Selected', todo)
    },
  },
]

async function toggleCompleted() {
  const payload: TTodoUpdatePayload = {
    isCompleted: !props.todo.isCompleted,
  }

  await store.updateTodo(props.todo.id.toString(), payload)
}

function parseDate(date: Date): string {
  const now = new Date()

  return format(date, 'dd-MM-yyyy')
  if (differenceInDays(date, now) <= 7) return formatRelative(date, now)
  else if (differenceInMonths(date, now) <= 12) return format(date, '')
  else return format(date, 'dd-MM-yyyy')
}
</script>
