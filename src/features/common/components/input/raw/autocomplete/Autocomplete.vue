<template>
  <div class="">
    <label v-if="label" :for="inputId" class="block">
      {{ label }}
      <DotsLoader v-if="loading" class="ml-1 inline-flex" />
    </label>

    <Combobox v-model="selectedOption" :disabled="disabled">
      <div class="relative">
        <div
          class="form-input relative w-full rounded border-slate-300 bg-transparent pr-7 text-left transition focus:border-primary focus:ring-primary dark:border-slate-300/20"
        >
          <ComboboxInput
            :class="[
              'w-full border-none bg-transparent p-0 text-left focus:outline-none focus:ring-0',
              valueClass,
            ]"
            :displayValue="(opt) => (opt as IAutocompleteOption<T>)?.value ?? ''"
            @change="query = $event.target.value"
          />
          <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="bg-container dark:bg-container-dark dark:text-dark absolute mt-2 max-h-60 w-full overflow-auto rounded-md py-1 text-base text-light shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredOptions.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="option in filteredOptions"
              as="template"
              :key="option.value"
              :value="option"
              v-slot="{ selected, active }"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-secondary/10 text-secondary': active,
                  // 'text-gray-900': !active
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ option.value }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-secondary': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

import type { IAutocompleteOption, IProps } from './interface'
import { DotsLoader } from '../../..'

const props = withDefaults(defineProps<IProps<T>>(), {
  placeholder: 'Pick an option...',
  disabled: false,
})
const emit = defineEmits<{ 'update:modelValue': [value: T | null] }>()

let query = ref('')

const selectedOption = computed<IAutocompleteOption<T> | null>({
	get() {
		const opts = props.options;
		const value = props.modelValue
		if (opts === null || value === null) return null
		
		return opts?.find((opt) => opt.key === value)
	},
	set(value) {
		emit('update:modelValue', value?.key ?? null)
	}
})

let filteredOptions = computed<IAutocompleteOption<T>[]>(() => {
  const opts = props.options
  if (!opts) return []

  return query.value === ''
    ? opts
    : opts.filter((option) =>
        option.value
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.value.toLowerCase().replace(/\s+/g, '')),
      )
})

const inputId = computed<string>(() => {
  let id = props.id ?? props.name
  if (!id && props.label) id = props.label.toLowerCase()

  return id ?? ''
})
</script>
