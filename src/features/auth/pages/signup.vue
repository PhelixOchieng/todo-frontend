<template>
  <div class="flex h-screen">
    <div class="relative hidden flex-1 bg-gradient-to-l from-white to-primary/80 sm:block"></div>
    <div class="relative grid w-full min-w-[480px] place-items-center sm:max-w-lg">
      <div class="w-3/5">
        <h1 class="mb-4 text-center text-2xl">Create Account</h1>
        <Status v-if="apiHandle.isError.value" variant="error" :should-retry="false">
          {{ apiMsg }}
        </Status>
        <form class="space-y-3" @submit.prevent="signup">
          <div class="flex gap-x-4">
            <FormInputField label="First Name" :field="firstName" />
            <FormInputField label="Last Name" :field="lastName" />
          </div>
          <FormInputField label="Username" :field="username"> </FormInputField>
          <FormInputField label="Email" name="email" type="email" :field="email" />
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
          <FormInputField
            label="Confirm Password"
            :field="confirmPassword"
            :type="isPasswordVisible ? 'text' : 'password'"
          />

          <Button class="!mt-5 block w-full" :loading="apiHandle.isLoading.value">Signup</Button>
        </form>
        <p class="mt-10">
          Already have an account?
          <RouterLink :to="{ name: 'login' }">Login Instead</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { RouterLink, useRouter, type RouteLocationRaw } from 'vue-router'
import { EyeIcon } from '@heroicons/vue/24/outline'

import { Form, FormField } from '@/core/forms'
import { useApiHandle } from '@/core/api/composables'
import { CompositeValidators, Validators } from '@/core/forms/validators'
import { Button, FormInputField, Status } from '@/features/common/components'

import { useAuthStore } from '../store'
import type { ISignupPayload } from '../services/interface'

const store = useAuthStore()
const { signupApiStatus: apiStatus, signupApiMsg: apiMsg } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

const form = new Form(
  {
    username: new FormField(null, [Validators.required, CompositeValidators.minLength(4)]),
    email: new FormField(null, [Validators.required, Validators.email]),
    firstName: new FormField(null, [Validators.required]),
    lastName: new FormField(null, [Validators.required]),
    password: new FormField(null, [Validators.required]),
    confirmPassword: new FormField(null, [Validators.required]),
  },
  {
    sameValueFields: ['password', 'confirmPassword'],
  },
)

const isPasswordVisible = ref(false)

const router = useRouter()
async function signup() {
  if (!form.validate()) return

  const userEmail = email.value.value.value!
  const payload: ISignupPayload = {
    email: userEmail,
    username: username.value.value.value!,
    firstName: firstName.value.value.value!,
    lastName: lastName.value.value.value!,
    password: password.value.value.value!,
  }
  await store.signup(payload)
  if (!apiHandle.isSuccess.value) return

  const to: RouteLocationRaw = { name: 'login', query: { email: userEmail, isSignupSuccess: 'true' } }
  router.replace(to)
}

const username = computed(() => form.getField<string>('username')!)
const email = computed(() => form.getField<string>('email')!)
const firstName = computed(() => form.getField<string>('firstName')!)
const lastName = computed(() => form.getField<string>('lastName')!)
const password = computed(() => form.getField<string>('password')!)
const confirmPassword = computed(() => form.getField<string>('confirmPassword')!)
</script>
