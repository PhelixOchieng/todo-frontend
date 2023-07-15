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
        <div class="mb-3 flex justify-center gap-x-4">
          <div
            v-for="_ in 2"
            class="relative grid aspect-square w-20 place-items-center overflow-hidden rounded-full bg-orange-50"
          >
            <div class="relative aspect-square w-10 rounded-full bg-sky-100">
              <div
                ref="eyes"
                :class="[
                  'absolute aspect-square w-8 rounded-full bg-blue-800 p-2',
                  { 'opacity-0': eyesStatus === 'closed' },
                ]"
                :style="{ left: `${eyeX - 16}px`, top: `${eyeY - 16}px` }"
              >
                <div class="h-full w-full rounded-full bg-black" />
              </div>
            </div>
            <div
              :class="[
                'absolute inset-0 bg-orange-800 transition-transform',
                eyesStatus === 'partiallyOpen'
                  ? '-translate-y-[45%]'
                  : eyesStatus === 'closed'
                  ? '-translate-y-[35%]'
                  : '-translate-y-[80%]',
              ]"
            />
            <div
              :class="[
                'absolute inset-0 bg-orange-800 transition-transform delay-75',
                eyesStatus === 'partiallyOpen'
                  ? 'translate-y-[65%]'
                  : eyesStatus === 'closed'
                  ? 'translate-y-[67%]'
                  : 'translate-y-[90%]',
              ]"
            />
          </div>
        </div>
        <form class="space-y-3" @submit.prevent="login">
          <FormInputField
            label="Email"
            name="email"
            type="email"
            :field="email"
            @focus="eyesStatus = 'open'"
          >
            <template #suffix> <EmailIcon /> </template>
          </FormInputField>
          <div class="relative">
            <FormInputField
              label="Password"
              :field="password"
              :type="isPasswordVisible ? 'text' : 'password'"
              @focus="eyesStatus = isPasswordVisible ? 'partiallyOpen' : 'closed'"
              @blur="eyesStatus = 'open'"
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
                        isPasswordVisible
                          ? 'origin-top-right scale-x-0'
                          : 'origin-left scale-x-100',
                      ]"
                      aria-role="none"
                    />
                  </div>
                </button>
              </template>
            </FormInputField>
            <div
              class="pointer-events-none absolute inset-0 flex items-start gap-x-[2.6px] px-3 opacity-0"
            >
              <div
                v-for="_ in password.value.value?.length ?? 0"
                class="aspect-square w-[4px] shrink-0 rounded bg-black"
              />
              <span class="block h-1 w-1 shrink-0 bg-red-300" />
            </div>
          </div>

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
    <div
      class="relative hidden flex-1 bg-gradient-to-r from-white to-primary/80 sm:grid sm:place-items-center"
    >
      <div class="mt-8 flex max-w-[200px] flex-wrap items-start gap-1">
        <div
          v-for="_ in password.value.value?.length ?? 0"
          class="aspect-square w-2 shrink-0 rounded bg-black"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
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

const eyesStatus = ref<'open' | 'closed' | 'partiallyOpen'>('open')
watch(isPasswordVisible, (v) => {
  if (v) eyesStatus.value = 'partiallyOpen'
  else eyesStatus.value = 'closed'
})

const eyes = ref<HTMLDivElement[] | null>()
const eyeX = ref(0)
const eyeY = ref(0)
function handleEyes(value: string | null) {
  const eyeBallRect = eyes.value![0].parentElement!.getBoundingClientRect()
  const eyeBallRadius = eyeBallRect.width / 2

  const x = (value?.length ?? 0) * 1.0
  const maxX = eyeBallRect.width

  const adj = eyeBallRadius - x
  const hyp = eyeBallRadius
  const opp = Math.sqrt(hyp ** 2 - adj ** 2)
  const y = eyesStatus.value === 'partiallyOpen' ? 0 : opp
  console.log(hyp, adj, opp)

  const minY = 0
  const maxY = eyeBallRadius
  const r = eyeBallRadius * Math.sin((20 * Math.PI) / 180) * 1

  eyeX.value = Math.min(x, maxX)
  eyeY.value = mapRange(y, [minY, maxY], [minY + r, maxY + r]) + eyeBallRadius
}

function mapRange(value: number, from: [number, number], to: [number, number]) {
  const fromRange = from[1] - from[0]
  const toRange = to[1] - to[0]
  const fromPerc = Math.max(value - from[0], from[0]) / fromRange

  const toValue = Math.min(fromPerc * toRange + to[0], to[1])
  return toValue
}

email.value.onInputChange(handleEyes)
password.value.onInputChange(handleEyes)
onMounted(() => handleEyes(''))
</script>
