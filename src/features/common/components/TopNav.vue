<template>
  <nav
    class="sticky top-0 h-16 border-b bg-white/60 backdrop-blur-xl"
    :style="{ zIndex: todos?.length ?? 0 + 2 }"
  >
    <div class="flex h-full items-center justify-between px-3">
      <RouterLink :to="{ name: 'home' }">Todos</RouterLink>
      <ul class="flex items-center"></ul>

      <div class="flex items-center">
        <RouterLink
          v-if="isUserAuthed && user"
          :to="{ name: 'profile' }"
          class="default flex items-center gap-x-2"
        >
          <p class="opacity-80 text-sm">
            Hi,
            {{ user.username }}
          </p>
          <AvatarImage class="rounded-full bg-slate-100 p-3" :src="user.avatarUrl" />
        </RouterLink>
        <!-- <RouterLink v-else :to="{ name: 'login' }" class="btn">Login</RouterLink> -->
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AvatarImage } from '@/features/common/components'
import { useAuthStore } from '@/features/auth/store'
import { useTodosStore } from '@/features/home/store'
import { useProfileStore } from '@/features/profile/store'

const store = useAuthStore()
const { isUserAuthed } = storeToRefs(store)

const profileStore = useProfileStore()
const { user } = storeToRefs(profileStore)

const todosStore = useTodosStore()
const { todos } = storeToRefs(todosStore)

profileStore.getProfile()
</script>
