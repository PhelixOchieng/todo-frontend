<template>
  <div class="h-screen bg-primary/5 pt-20">
    <div class="c-container">
      <div class="mx-auto w-80">
        <p class="mb-10 text-center">
          Remember your password?
          <RouterLink :to="{ name: 'login' }"> Login </RouterLink>
          Instead
        </p>
        <div class="flex w-full items-center justify-between gap-x-3">
          <div class="text-center">
            <div
              :class="[
                'mx-auto w-max rounded-full p-2 transition-colors',
                twMerge(
                  'bg-slate-200',
                  step === 1 ? 'bg-secondary/20 text-secondary-dark' : '',
                  step > 1 ? 'bg-secondary' : '',
                ),
              ]"
              :style="`transition-delay: ${
                step === 1 ? dots * dotDelayFactor + dotDelayFactor : 0
              }ms`"
            >
              <EnvelopeIcon class="mx-auto h-5 w-5" />
            </div>
            <p style="font-variant: small-caps" class="mt-1 text-xs">Email</p>
          </div>
          <div class="flex flex-1 -translate-y-3 justify-around gap-x-1">
            <div
              v-for="i in dots"
              aria-role="none"
              :class="[
                'h-2 w-2 rounded-full transition-colors duration-300 ease-out',
                step > 1 ? 'bg-secondary' : 'bg-slate-200',
              ]"
              :key="`dot-${i}`"
              :style="`transition-delay: ${(step === 1 ? dots - i : i) * dotDelayFactor}ms`"
            />
          </div>
          <div class="text-center">
            <div
              :class="[
                'mx-auto w-max rounded-full p-2',
                twMerge('bg-slate-200', step === 2 ? 'bg-secondary/20 text-secondary-dark' : ''),
              ]"
            >
              <LockClosedIcon class="mx-auto h-5 w-5" />
            </div>
            <p style="font-variant: small-caps" class="mt-1 text-xs">Password</p>
          </div>
        </div>

        <div class="mt-4">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300"
            leave-active-class="transition-all duration-300"
            :enter-from-class="`opacity-0 ${step === 1 ? '-translate-x-5' : 'translate-x-5'}`"
            :leave-to-class="`opacity-0 ${step === 1 ? 'translate-x-5' : '-translate-x-5'}`"
          >
            <EmailValidation v-if="step === 1" @success="step = 2" />
            <PasswordEntry v-else @back="step = 1" />
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { twMerge } from 'tailwind-merge'
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/vue/24/outline'

import EmailValidation from '../components/EmailValidation.vue'
import PasswordEntry from '../components/PasswordEntry.vue'

const step = ref(1)
const dots = 10
const dotDelayFactor = 25
</script>
