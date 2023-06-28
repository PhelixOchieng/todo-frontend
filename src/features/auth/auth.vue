<template>
  <div class="w-screnn relative h-screen overflow-hidden">
    <div class="absolute inset-0">
      <img src="/images/auth-backdrop.jpg" alt="property" class="h-full w-full object-cover" />
    </div>
    <div
      class="absolute inset-0 bg-gradient-to-b from-black/90 to-black/30 sm:bg-gradient-to-r sm:to-transparent"
    />
    <div
      class="absolute left-1/2 top-1/2 flex h-4/5 w-[calc(100%-12*0.25rem)] -translate-x-1/2 -translate-y-1/2 flex-col text-white sm:left-8 sm:w-[340px] sm:translate-x-0"
    >
      <button class="flex w-max items-center gap-x-2" @click="$router.back()">
        <ArrowLongLeftIcon class="h-5 w-5" />
        <span>View Properties</span>
      </button>
      <div
        class="mt-4 flex-1 rounded-lg border border-white/10 bg-gradient-to-t from-black/80 to-transparent shadow-lg shadow-black backdrop-blur-md sm:bg-gradient-to-l"
      >
        <Transition
          mode="out-in"
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="isLogin" class="flex h-full flex-col p-3">
            <p v-if="email" class="success mb-3 bg-green-50">
              You account has been created successfully. Login below to continue.
            </p>
            <Login :signup-email="email" @goto-signup="gotoSignup" />
          </div>
          <div v-else class="flex h-full flex-col p-3">
            <Signup @goto-login="gotoLogin" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Transition } from 'vue'
import { ArrowLongLeftIcon } from '@heroicons/vue/24/outline'

import Login from './components/Login.vue'
import Signup from './components/Signup.vue'

const images = [
  {
    src: '/images/hero-1.jpg',
    alt: 'white concrete house near green tree during daytime',
  },
  {
    src: '/images/hero-2.jpg',
    alt: 'gray wooden house',
  },
  {
    src: '/images/hero-3.jpg',
    alt: 'brown black wooden house',
  },
]

const isLogin = ref(true)
const email = ref<string | null>(null)

function gotoLogin(signupEmail?: string) {
  isLogin.value = true
  email.value = signupEmail ?? null
}

const imgIdx = ref(Math.floor(Math.random() * images.length))
function gotoNextImage() {
  imgIdx.value = (imgIdx.value + 1) % images.length
}

function gotoSignup() {
  isLogin.value = false
  email.value = null
}
</script>
