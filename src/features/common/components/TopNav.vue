<template>
  <nav
    class="sticky top-0 bg-white/60 h-16 border-b text-white backdrop-blur-xl"
    :style="{ zIndex: todos.length + 2 }"
  >
    <div class="flex items-center justify-between h-full px-3">
      <RouterLink :to="{ name: 'home' }">Todos</RouterLink>
      <ul class="flex items-center"></ul>

      <div class="flex items-center">
        <RouterLink v-if="isUserAuthed" :to="{ name: 'profile' }">
          <AvatarImage class="rounded-full bg-slate-100 p-3" />
        </RouterLink>
        <RouterLink v-else :to="{ name: 'login' }" class="btn">Login</RouterLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { AvatarImage } from '@/features/common/components'
import { useAuthStore } from '@/features/auth/store'
import { useTodosStore } from '@/features/home/store'

const store = useAuthStore()
const { isUserAuthed } = storeToRefs(store)

const todosStore = useTodosStore()
const { todos } = storeToRefs(todosStore)
</script>
