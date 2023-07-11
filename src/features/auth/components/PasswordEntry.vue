<template>
  <form @submit.prevent="verifyEmail">
    <Button
      variant="text-icon"
      type="button"
      class="mb-3 bg-transparent hover:bg-primary/10"
      :disabled="apiHandle.isLoading.value || emailApiHandle.isLoading.value"
      @click.stop="$emit('back')"
    >
      <ArrowLongLeftIcon />
      Change Email
    </Button>

    <p class="text-sm">
      Enter the token that was sent to <b>{{ verifiedEmail }}</b>
    </p>
    <Status v-if="apiHandle.isError.value" variant="error" class="mt-2" :should-retry="false">
      {{ apiMsg }}
    </Status>
    <Status v-else-if="apiHandle.isDefault && emailApiHandle.isError.value" variant="error" class="mt-2" :should-retry="false">
      {{ emailVerificationApiMsg }}
    </Status>
    <FormInputField label="Token" :field="token" />
    <FormInputField
      label="Password"
      :field="password"
      :type="isPasswordVisible ? 'text' : 'password'"
    >
      <template #suffix>
        <button
          class="relative opacity-60 transition-opacity hover:opacity-100"
          type="button"
          @click.prevent="isPasswordVisible = !isPasswordVisible"
        >
          <EyeIcon role="button" class="h-full w-full" />
          <div class="absolute inset-0 rotate-45">
            <div
              :class="[
                'absolute top-1/2 h-[2px] w-full -translate-y-1/2 rounded-full bg-light transition-transform duration-300',
                isPasswordVisible ? 'origin-top-right scale-x-0' : 'origin-left scale-x-100',
              ]"
              aria-role="none"
            />
          </div>
        </button>
      </template>
    </FormInputField>
    <FormInputField
      label="Confirm Password"
      :field="confirmPassword"
      :type="isPasswordVisible ? 'text' : 'password'"
    />

    <div class="mt-3 flex justify-between">
      <Button
        variant="text"
        type="button"
        class="bg-transparent hover:bg-primary/10"
        :loading="emailApiHandle.isLoading.value"
        :disabled="!canResendToken || apiHandle.isLoading.value"
        @click.stop="resendToken"
      >
        Resend Token {{ !canResendToken ? `(${timeToResend})` : '' }}
      </Button>
      <Button
        variant="text"
        :loading="apiHandle.isLoading.value"
        :disabled="emailApiHandle.isLoading.value"
      >
        Reset Password
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { ArrowLongLeftIcon, EyeIcon } from '@heroicons/vue/24/outline'

import { Form, FormField } from '@/core/forms'
import { Validators } from '@/core/forms/validators'
import { Button, FormInputField, Status } from '@/features/common/components'

import { useAuthStore } from '../store'
import { useApiHandle } from '@/core/api/composables'
import type { IPasswordResetPayload } from '../services/interface'
import { useRouter } from 'vue-router'

defineEmits<{ back: [] }>()

const store = useAuthStore()
const {
  passwordResetApiStatus: apiStatus,
  passwordResetApiMsg: apiMsg,
  emailVerificationApiStatus,
  emailVerificationApiMsg,
  verifiedEmail,
} = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)
const emailApiHandle = useApiHandle(emailVerificationApiStatus)

const isPasswordVisible = ref(false)
const form = new Form(
  {
    token: new FormField(null, [Validators.required]),
    password: new FormField(null, [Validators.required]),
    confirmPassword: new FormField(null, [Validators.required]),
  },
  {
    sameValueFields: [['password', 'confirmPassword'], 'The passwords entered do not match'],
  },
)

const router = useRouter()
async function verifyEmail() {
  if (!form.validate()) return

  const payload: IPasswordResetPayload = {
    token: token.value.value.value!,
    password: password.value.value.value!,
  }
  await store.resetPassword(payload)

  if (!apiHandle.isSuccess.value) return
  router.replace({ name: 'login', query: { resetSuccess: 'true' } })
}

async function resendToken() {
  await store.resendToken()
  if (emailApiHandle.isSuccess.value) return

  initTimer()
}

let interval: number | null = null
let secsRemaining = ref(2)
const timeToResend = computed<string>(() => {
  const eta = secsRemaining.value
  const mins = Math.floor(eta / 60)
  const secs = eta - mins * 60

  const secsString = secs < 10 ? `0${secs}` : secs

  return `0${mins}:${secsString}`
})
const canResendToken = computed<boolean>(() => {
  return secsRemaining.value <= 0
})
function initTimer() {
  endTimer()

  interval = setInterval(() => {
    secsRemaining.value--
    if (secsRemaining.value <= 0) endTimer()
  }, 1000)
}

function endTimer() {
  if (interval === null) return
  clearInterval(interval)
}

onMounted(initTimer)
onUnmounted(endTimer)
// defineOptions({
//   created: initTimer,
//   destroyed: endTimer,
// })

const token = computed(() => form.getField<string>('token')!)
const password = computed(() => form.getField<string>('password')!)
const confirmPassword = computed(() => form.getField<string>('confirmPassword')!)
</script>
