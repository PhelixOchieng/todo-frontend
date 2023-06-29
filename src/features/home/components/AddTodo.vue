<template>
  <HeroModal :show-title="true">
    <template #trigger="{ openModal }">
      <button
        class="btn absolute right-3 aspect-square rounded-xl md:right-10 md:top-20"
        @click="openModal"
      >
        <PlusIcon class="h-5 w-5" />
      </button>
    </template>
    <template #title>
      <h2 class="overflow-hidden text-clip whitespace-nowrap text-center">Add Todo</h2>
    </template>
    <template #default="{ closeModal }">
      <form class="space-y-3" @submit.prevent="addTodo">
        <FormInputField :field="title" label="Title" />
        <FormTextField :field="description" label="Description" />

        <div class="flex !mt-4 justify-center gap-x-2">
          <button type="button" class="btn-text rounded-md" @click="closeModal">Cancel</button>
          <button type="submit" class="btn">Add</button>
        </div>
      </form>
    </template>
  </HeroModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlusIcon } from '@heroicons/vue/20/solid'

import { Form, FormField } from '@/core/forms'
import { Validators } from '@/core/forms/validators'
import { HeroModal, FormInputField, FormTextField } from '@/features/common/components'

const form = new Form({
  title: new FormField(null, [Validators.required]),
  description: new FormField(null),
})

function addTodo() {
	if (!form.validate()) return;
}

const title = computed(() => form.getField<string>('title')!)
const description = computed(() => form.getField<string | null>('description')!)
</script>
