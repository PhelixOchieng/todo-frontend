<template>
  <Status v-if="apiHandle.isError.value" variant="error" :should-retry="false">
    {{ apiMsg }}
  </Status>
  <form class="space-y-3" @submit.prevent="addTodo">
    <FormInputField :field="title" label="Title" />
    <FormTextField :field="description" label="Description" />
    <Switch v-model="isCompleted">Is Completed</Switch>
    <div class="!mt-8 flex justify-center gap-x-2">
      <Button
				variant="text"
        type="button"
        :disabled="apiHandle.isLoading.value"
        @click="closeModal"
      >
        Cancel
      </Button>
      <Button type="submit" :loading="apiHandle.isLoading.value">Update</Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { Form, FormField } from '@/core/forms'
import { Validators } from '@/core/forms/validators'
import { useApiHandle } from '@/core/api/composables'
import { Button, FormInputField, FormTextField, Status, Switch } from '@/features/common/components'

import { useTodosStore } from '../store'
import type { TTodoUpdatePayload } from '../services'
import type TodoModel from '../models/todo.model'

const props = defineProps<{ todo: TodoModel }>()
const emit = defineEmits<{ closeModal: [] }>()

const store = useTodosStore()
const { todoUpdateApiStatus: apiStatus, todoUpdateApiMsg: apiMsg } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const form = new Form({
  title: new FormField(props.todo.title, [Validators.required]),
  description: new FormField(props.todo.description),
})

const isCompleted = ref(props.todo.isCompleted)
async function addTodo() {
  if (!form.validate()) return

  const payload: TTodoUpdatePayload = {
    title: title.value.value.value!,
    description: description.value.value.value,
    isCompleted: isCompleted.value,
  }

  await store.updateTodo(props.todo.id.toString(), payload)
  if (!apiHandle.isSuccess.value) return

  closeModal()
}

function closeModal() {
  // form.reset()
  emit('closeModal')
}

const title = computed(() => form.getField<string>('title')!)
const description = computed(() => form.getField<string | null>('description')!)
</script>
