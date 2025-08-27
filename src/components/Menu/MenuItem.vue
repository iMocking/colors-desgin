<template>
  <li
    class="im-menu-item"
    :class="{
      'im-menu-item--active': isActive,
      'im-menu-item--disabled': disabled
    }"
    @click="handleClick"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

export interface Props {
  index?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  index: '',
  disabled: false
})

const rootMenu: any = inject('rootMenu', null)

const isActive = computed(() => {
  return rootMenu?.activeIndex.value === props.index
})

const handleClick = () => {
  if (props.disabled || !rootMenu) return
  rootMenu.handleSelect(props.index)
}
</script>

<style scoped>
.im-menu-item {
  @apply cursor-pointer px-4 py-3 text-sm transition-colors flex items-center;
}

.im-menu--vertical .im-menu-item {
  @apply border-r-2 border-transparent hover:bg-gray-50;
}

.im-menu--horizontal .im-menu-item {
  @apply border-b-2 border-transparent hover:bg-gray-50;
}

.im-menu-item--active {
  @apply text-blue-600 font-medium;
}

.im-menu--vertical .im-menu-item--active {
  @apply border-r-blue-600 bg-blue-50;
}

.im-menu--horizontal .im-menu-item--active {
  @apply border-b-blue-600;
}

.im-menu-item--disabled {
  @apply cursor-not-allowed opacity-50;
}
</style>
