<template>
  <TopNav />
  <RouterView class="pb-8" />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import { TopNav } from '@/features/common/components'
</script>
