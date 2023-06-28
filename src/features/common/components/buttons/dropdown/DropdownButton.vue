<template>
  <Menu as="div" class="relative inline-block text-left">
    <div>
      <MenuButton as="template">
        <slot name="trigger" />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <MenuItems
        class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <MenuItem v-for="(item, i) of items" :key="`item-${i}`" v-slot="{ active, close }">
          <slot v-bind="{ item, active, close }" name="dropdown-item">
            <p>{{ item.name }}</p>
          </slot>
        </MenuItem>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts" setup generic="T">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

import type { IProps } from './interface'

defineProps<IProps<T>>()
</script>
