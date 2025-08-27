<template>
  <teleport to="body">
    <transition name="notification">
      <div
        v-if="visible"
        class="im-notification"
        :class="[
          `im-notification--${type}`,
          `im-notification--${placement}`
        ]"
        @mouseenter="clearTimer"
        @mouseleave="startTimer"
      >
        <div class="im-notification__icon" v-if="showIcon">
          <slot name="icon">
            <span v-if="type === 'success'">✓</span>
            <span v-else-if="type === 'warning'">⚠</span>
            <span v-else-if="type === 'error'">✕</span>
            <span v-else-if="type === 'info'">ℹ</span>
          </slot>
        </div>

        <div class="im-notification__content">
          <div class="im-notification__title" v-if="title">
            {{ title }}
          </div>
          <div class="im-notification__message">
            <slot>{{ message }}</slot>
          </div>
        </div>

        <button
          v-if="showClose"
          class="im-notification__close"
          @click="close"
        >
          ×
        </button>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export interface Props {
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  message?: string
  duration?: number
  showIcon?: boolean
  showClose?: boolean
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  onClose?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  message: '',
  duration: 4500,
  showIcon: true,
  showClose: true,
  placement: 'top-right',
  onClose: undefined
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const visible = ref(true)
let timer: number | null = null

const close = () => {
  visible.value = false
  if (props.onClose) {
    props.onClose()
  }
  emit('close')
}

const startTimer = () => {
  if (props.duration > 0) {
    timer = window.setTimeout(() => {
      close()
    }, props.duration)
  }
}

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

onMounted(() => {
  startTimer()
})

onUnmounted(() => {
  clearTimer()
})
</script>

<style scoped>
.im-notification {
  @apply fixed z-50 min-w-[300px] max-w-[400px] p-4 rounded-md shadow-lg flex items-start gap-3;
}

.im-notification--top-right {
  @apply top-4 right-4;
}

.im-notification--top-left {
  @apply top-4 left-4;
}

.im-notification--bottom-right {
  @apply bottom-4 right-4;
}

.im-notification--bottom-left {
  @apply bottom-4 left-4;
}

.im-notification--success {
  @apply bg-green-100 border border-green-200 text-green-800;
}

.im-notification--warning {
  @apply bg-yellow-100 border border-yellow-200 text-yellow-800;
}

.im-notification--error {
  @apply bg-red-100 border border-red-200 text-red-800;
}

.im-notification--info {
  @apply bg-blue-100 border border-blue-200 text-blue-800;
}

.im-notification__icon {
  @apply flex-shrink-0 text-lg font-bold;
}

.im-notification__content {
  @apply flex-1;
}

.im-notification__title {
  @apply font-medium mb-1;
}

.im-notification__message {
  @apply text-sm;
}

.im-notification__close {
  @apply flex-shrink-0 text-xl text-gray-500 hover:text-gray-700 focus:outline-none;
}

.notification-enter-active,
.notification-leave-active {
  @apply transition-all duration-300;
}

.notification-enter-from {
  @apply opacity-0 transform translate-x-4;
}

.notification-enter-to {
  @apply opacity-100 transform translate-x-0;
}

.notification-leave-from {
  @apply opacity-100 transform translate-x-0;
}

.notification-leave-to {
  @apply opacity-0 transform translate-x-4;
}
</style>
