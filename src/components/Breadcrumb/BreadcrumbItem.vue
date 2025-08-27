<template>
  <li class="im-breadcrumb__item">
    <component
      :is="to ? 'router-link' : 'span'"
      :to="to"
      class="im-breadcrumb__link"
      :class="{ 'im-breadcrumb__link--active': isCurrent }"
    >
      <slot />
    </component>

    <span
      v-if="!isLast"
      class="im-breadcrumb__separator"
    >
      {{ separator }}
    </span>
  </li>
</template>

<script setup lang="ts">
import { inject, useSlots } from 'vue'

export interface Props {
  to?: string | Record<string, any>
  isCurrent?: boolean
  isLast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  isCurrent: false,
  isLast: false
})

const separator = inject('breadcrumb-separator', '/')
</script>

<style scoped>
.im-breadcrumb__item {
  @apply flex items-center;
}

.im-breadcrumb__link {
  @apply text-gray-500 hover:text-gray-700 transition-colors;
}

.im-breadcrumb__link--active {
  @apply text-gray-900 font-medium;
}

.im-breadcrumb__separator {
  @apply mx-2 text-gray-400;
}
</style>
