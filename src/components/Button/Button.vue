<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface Props {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  block?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  block: false
})

const emit = defineEmits<Emits>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  return [
    'im-btn-base',
    `im-btn-${props.type}`,
    `im-btn-${props.size}`,
    {
      'w-full': props.block,
      'opacity-50 cursor-not-allowed': props.disabled
    }
  ]
})
</script>

<style scoped>
.im-btn-default {
  @apply bg-white text-gray-800 border border-gray-300 hover:bg-gray-50;
}

.im-btn-primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.im-btn-secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600;
}

.im-btn-success {
  @apply bg-green-500 text-white hover:bg-green-600;
}

.im-btn-warning {
  @apply bg-yellow-500 text-white hover:bg-yellow-600;
}

.im-btn-error {
  @apply bg-red-500 text-white hover:bg-red-600;
}

.im-btn-info {
  @apply bg-sky-500 text-white hover:bg-sky-600;
}

.im-btn-small {
  @apply h-8 px-3 text-xs;
}

.im-btn-medium {
  @apply h-10 px-4 py-2;
}

.im-btn-large {
  @apply h-12 px-6 text-lg;
}
</style>
