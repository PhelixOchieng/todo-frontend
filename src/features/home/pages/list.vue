<template>
  <main class="c-container bg-orange-100 pb-20 pt-8">
    <div v-if="apiHandle.isLoading.value" class="flex items-center gap-x-3">
      <p>Fetching properties...</p>
      <DotsLoader />
    </div>
    <Status
      v-else-if="apiHandle.isError.value"
      variant="error"
      class="error mx-auto mb-3 bg-red-50 first-letter:capitalize md:max-w-[580px]"
    >
      {{ apiMsg }}
    </Status>
    <template v-else>

      <div v-if="properties.length === 0" class="text-center">
        <p>You have not added any todos yet</p>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useApiHandle } from '@/core/api/composables'
import { DotsLoader, Status, AvatarImage } from '@/features/common/components'

import { usePropertiesStore } from '../store'

const store = usePropertiesStore()
const { propertiesApiStatus: apiStatus, propertiesApiMsg: apiMsg, properties } = storeToRefs(store)
const apiHandle = useApiHandle(apiStatus)

// getTodos()
function getTodos() {
  store.retrieveAll({
    page: 1,
    limit: 100,
  })
}
</script>
