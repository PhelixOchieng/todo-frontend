<template>
  <form @submit.prevent="verifyEmail">
    <p class="text-sm">Enter the email address where your verification token is to be sent</p>

    <Status v-if="apiHandle.isError.value" variant="error" class="mt-2" :should-retry="false">
      {{ apiMsg }}
    </Status>
    <FormInputField type="email" class="mt-3" placeholder="jane@doe.com" :field="email">
      <template #suffix>
        <EnvelopeIcon />
      </template>
    </FormInputField>
    <Button variant="text-icon" class="ml-auto mt-3" :loading="apiHandle.isLoading.value">
      Verify Email
      <ArrowLongRightIcon />
    </Button>
  </form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ArrowLongRightIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'

import { Form, FormField } from '@/core/forms'
import { Validators } from '@/core/forms/validators'
import { Button, FormInputField, Status } from '@/features/common/components'

import type { IEmailVerificationPayload } from '../services/interface'
import { useAuthStore } from '../store'
import { storeToRefs } from 'pinia'
import { useApiHandle } from '@/core/api/composables'

const store = useAuthStore()
const { emailVerificationApiStatus: apiStatus, emailVerificationApiMsg: apiMsg } =
  storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const emit = defineEmits<{ success: [] }>()

const form = new Form({
  email: new FormField(null, [Validators.required, Validators.email]),
})

async function verifyEmail() {
  if (!form.validate()) return

  const payload: IEmailVerificationPayload = {
    email: email.value.value.value!,
  }
  await store.verifyEmail(payload)

  if (!apiHandle.isSuccess.value) return
  emit('success')
}

const email = computed(() => form.getField<string>('email')!)
</script>
