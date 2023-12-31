<template>
  <div class="px-3 pt-4">
    <div class="flex items-center justify-between">
      <BackButton class="mb-4">
        <h1>My Profile</h1>
      </BackButton>
      <UpdateProfile v-if="user" :user="user" />
    </div>
    <Status v-if="apiHandle.isError.value" variant="error" @retry="getProfile">{{ apiMsg }}</Status>
    <section v-if="user" class="flex gap-x-6">
      <AvatarImage
        class="aspect-square w-[200px] max-w-md"
        :src="user.avatarUrl"
        alt="Profile image"
      />
      <div class="flex-1 space-y-4">
        <p>@{{ user.username }}</p>
        <div class="flex gap-x-8">
          <div>
            <p class="text-sm opacity-70">First Name</p>
            <p>{{ user.firstName }}</p>
          </div>
          <div>
            <p class="text-sm opacity-70">Last Name</p>
            <p>{{ user.lastName }}</p>
          </div>
        </div>
        <div>
          <p class="text-sm opacity-70">Email</p>
          <p>{{ user.email }}</p>
        </div>
        <div>
          <div class="flex gap-x-8">
            <div>
              <p class="text-sm opacity-70">Joined</p>
              <p>{{ parseTime(user.createdAt) }}</p>
            </div>
            <div v-if="user.updatedAt">
              <p class="text-sm opacity-70">Updated</p>
              <p>{{ parseTime(user.updatedAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="mt-6">
      <h2>Actions</h2>
      <Button
        v-if="authStore.isUserAuthed"
        variant="text-icon"
        class="mt-4"
        :loading="isLoggingOut"
        @click="logout"
      >
        Logout
        <LogoutIcon />
      </Button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ArrowRightOnRectangleIcon as LogoutIcon } from '@heroicons/vue/20/solid'

import { delay, parseTime } from '@/common/functional'
import { useApiHandle } from '@/core/api/composables'
import { AvatarImage, BackButton, Button, Status } from '@/features/common/components'

import UpdateProfile from '../components/UpdateProfile.vue'

import { useAuthStore } from '../../auth/store'
import { useProfileStore } from '../store'

const authStore = useAuthStore()
const store = useProfileStore()
const { userApiStatus: apiStatus, userApiMsg: apiMsg, user } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

getProfile()
function getProfile() {
  store.getProfile()
}

const isLoggingOut = ref(false)
const router = useRouter()
async function logout() {
  isLoggingOut.value = true

  await delay(500)
  authStore.logout()

  isLoggingOut.value = false
  router.replace({ name: 'login' })
}
</script>
