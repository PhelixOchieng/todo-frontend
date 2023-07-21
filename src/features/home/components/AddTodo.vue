<template>
  <HeroModal :show-title="true" @close="handleModalClose">
    <template #trigger="{ openModal }">
      <Button
        :class="twMerge(
          'left-1/2 aspect-square -translate-x-1/2 rounded-xl p-3 max-md:bottom-8 max-sm:fixed',
          'md:left-0 md:right-10 md:top-0 md:translate-x-0',
					$attrs.class as string,
        )"
        @click="openModal"
      >
        <PlusIcon class="h-5 w-5" />
      </Button>
    </template>
    <template #title>
      <h2 class="overflow-hidden text-clip whitespace-nowrap text-center">Add Todo</h2>
    </template>
    <template #default="{ closeModal }">
      <Status v-if="apiHandle.isError.value" variant="error" :should-retry="false">
        {{ apiMsg }}
      </Status>
      <form class="space-y-3" @submit.prevent="() => addTodo(closeModal)">
        <FormInputField :field="title" label="Title" />
        <FormTextField :field="description" label="Description" />

        <div class="!mt-4 flex justify-center gap-x-2">
          <Button
            variant="text"
            type="button"
            :disabled="apiHandle.isLoading.value"
            @click="closeModal"
          >
            Cancel
          </Button>
          <Button type="submit" :loading="apiHandle.isLoading.value"> Add </Button>
        </div>
      </form>
    </template>
  </HeroModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { twMerge } from 'tailwind-merge'
import { PlusIcon } from '@heroicons/vue/20/solid'

import { Form, FormField } from '@/core/forms'
import { Validators } from '@/core/forms/validators'
import {
  Button,
  FormInputField,
  FormTextField,
  HeroModal,
  Status,
} from '@/features/common/components'

import { useTodosStore } from '../store'
import { storeToRefs } from 'pinia'
import { useApiHandle } from '@/core/api/composables'
import type { TTodoAddPayload } from '../services'

defineOptions({
  inheritAttrs: false,
})

const store = useTodosStore()
const { todoAddApiStatus: apiStatus, todoAddApiMsg: apiMsg } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const form = new Form({
  title: new FormField(null, [Validators.required]),
  description: new FormField(null),
})

async function addTodo(closeModal: () => void) {
  if (!form.validate()) return

  const payload: TTodoAddPayload = {
    title: title.value.value.value!,
    description: description.value.value.value,
  }

  await store.addTodo(payload)
  if (!apiHandle.isSuccess.value) return

  closeModal()
}

function handleModalClose() {
  form.reset()
}

const title = computed(() => form.getField<string>('title')!)
const description = computed(() => form.getField<string | null>('description')!)
</script>
