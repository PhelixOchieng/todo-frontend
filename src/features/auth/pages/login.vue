<template>
  <div class="flex h-screen">
    <div class="relative grid w-full min-w-[480px] place-items-center sm:max-w-lg">
      <div class="w-3/5">
        <h1 class="mb-4 text-center text-2xl">Login</h1>
        <Status v-if="apiHandle.isError.value" variant="error" :should-retry="false">
          {{ apiMsg }}
        </Status>
        <Status
          v-else-if="apiHandle.isDefault.value && $route.query.resetSuccess"
          variant="success"
        >
          Your password has been reset successfully. Log in to continue
        </Status>
        <Status
          v-else-if="apiHandle.isDefault.value && $route.query.isSignupSuccess"
          variant="success"
        >
          Your account was successfully created. You can now login.
        </Status>
        <form class="space-y-3" @submit.prevent="login">
          <FormInputField label="Email" name="email" type="email" :field="email">
            <template #suffix> <EmailIcon /> </template>
          </FormInputField>
          <FormInputField
            label="Password"
            :field="password"
            :type="isPasswordVisible ? 'text' : 'password'"
          >
            <template #suffix>
              <button
                type="button"
                class="relative opacity-60 transition-opacity hover:opacity-100"
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

          <Button class="!mt-5 block w-full" :loading="apiHandle.isLoading.value">Login</Button>
        </form>
        <RouterLink class="mt-10 block" :to="{ name: 'password-reset' }">
          Reset Password
        </RouterLink>
        <p>
          Dont have an account?
          <RouterLink :to="{ name: 'signup' }">Signup Instead</RouterLink>
        </p>
      </div>
    </div>
    <div class="relative hidden flex-1 bg-gradient-to-r from-white to-primary/80 sm:block"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { EnvelopeIcon as EmailIcon, EyeIcon } from '@heroicons/vue/24/outline'

import { Form, FormField } from '@/core/forms'
import { useApiHandle } from '@/core/api/composables'
import { Validators } from '@/core/forms/validators'
import { Button, FormInputField, Status } from '@/features/common/components'

import { useAuthStore } from '../store'
import type { ILoginPayload } from '../services/interface'

const store = useAuthStore()
const { loginApiStatus: apiStatus, loginApiMsg: apiMsg } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const route = useRoute()
const form = new Form({
  email: new FormField(route.query.email ?? null, [Validators.required, Validators.email]),
  password: new FormField(null, [Validators.required]),
})

const isPasswordVisible = ref(false)

const router = useRouter()
async function login() {
  if (!form.validate()) return

  const payload: ILoginPayload = {
    email: email.value.value.value!,
    password: password.value.value.value!,
  }
  await store.login(payload)
  if (!apiHandle.isSuccess.value) return

  const to: RouteLocationRaw = (route.query.to as Partial<string>) ?? { name: 'home' }
  router.replace(to)
}

const email = computed(() => form.getField<string>('email')!)
const password = computed(() => form.getField<string>('password')!)
</script>
