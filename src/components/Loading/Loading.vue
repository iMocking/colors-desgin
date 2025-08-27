<template>
  <div
    v-if="visible"
    class="im-loading"
    :class="{ 'im-loading--fullscreen': fullscreen }"
  >
    <div
      class="im-loading__mask"
      :class="{ 'im-loading__mask--fullscreen': fullscreen }"
      @click="handleMaskClick"
    />

    <div
      class="im-loading__spinner"
      :class="[
        `im-loading__spinner--${spinner}`,
        { 'im-loading__spinner--fullscreen': fullscreen }
      ]"
    >
      <div v-if="spinner === 'default'" class="im-loading__default-spinner">
        <div class="im-loading__default-dot" />
        <div class="im-loading__default-dot" />
        <div class="im-loading__default-dot" />
        <div class="im-loading__default-dot" />
      </div>

      <div v-else-if="spinner === 'circle'" class="im-loading__circle-spinner" />

      <div v-else-if="spinner === 'wave'" class="im-loading__wave-spinner">
        <div class="im-loading__wave-bar" />
        <div class="im-loading__wave-bar" />
        <div class="im-loading__wave-bar" />
        <div class="im-loading__wave-bar" />
        <div class="im-loading__wave-bar" />
      </div>

      <div
        v-if="text || $slots.default"
        class="im-loading__text"
      >
        <slot>{{ text }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

export interface Props {
  modelValue?: boolean
  text?: string
  spinner?: 'default' | 'circle' | 'wave'
  fullscreen?: boolean
  background?: string
  customClass?: string
  lock?: boolean
  closeOnClickMask?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  text: '',
  spinner: 'default',
  fullscreen: false,
  background: '',
  customClass: '',
  lock: false,
  closeOnClickMask: false
})

const emit = defineEmits<Emits>()

const visible = ref(props.modelValue !== undefined ? props.modelValue : false)

const handleMaskClick = () => {
  if (props.closeOnClickMask) {
    close()
  }
}

const close = () => {
  visible.value = false
  if (props.modelValue !== undefined) {
    emit('update:modelValue', false)
  }
  emit('close')
}

watch(() => props.modelValue, (val) => {
  if (val !== undefined) {
    visible.value = val
  }
})

// 如果是全屏加载，锁定body滚动
watch(() => visible.value, (val) => {
  if (props.fullscreen && props.lock) {
    if (val) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
})
</script>

<style scoped>
.im-loading {
  @apply relative;
}

.im-loading--fullscreen {
  @apply fixed inset-0 z-50;
}

.im-loading__mask {
  @apply absolute inset-0 bg-transparent;
}

.im-loading__mask--fullscreen {
  @apply bg-black bg-opacity-30;
}

.im-loading__spinner {
  @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center;
}

.im-loading__spinner--fullscreen {
  @apply z-50;
}

/* Default Spinner */
.im-loading__default-spinner {
  @apply relative w-12 h-12;
}

.im-loading__default-dot {
  @apply absolute w-3 h-3 bg-blue-500 rounded-full;
  animation: im-loading-default 1.2s ease-in-out infinite;
}

.im-loading__default-dot:nth-child(1) {
  @apply top-0 left-0;
  animation-delay: -0.3s;
}

.im-loading__default-dot:nth-child(2) {
  @apply top-0 right-0;
  animation-delay: -0.15s;
}

.im-loading__default-dot:nth-child(3) {
  @apply bottom-0 right-0;
  animation-delay: 0s;
}

.im-loading__default-dot:nth-child(4) {
  @apply bottom-0 left-0;
  animation-delay: -0.45s;
}

@keyframes im-loading-default {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Circle Spinner */
.im-loading__circle-spinner {
  @apply w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full;
  animation: im-loading-circle 1s linear infinite;
}

@keyframes im-loading-circle {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Wave Spinner */
.im-loading__wave-spinner {
  @apply flex items-end h-12 gap-1;
}

.im-loading__wave-bar {
  @apply w-2 h-4 bg-blue-500 rounded-sm;
  animation: im-loading-wave 1.2s ease-in-out infinite;
}

.im-loading__wave-bar:nth-child(1) {
  animation-delay: -1.2s;
  height: 2rem;
}

.im-loading__wave-bar:nth-child(2) {
  animation-delay: -1.1s;
  height: 1.5rem;
}

.im-loading__wave-bar:nth-child(3) {
  animation-delay: -1s;
  height: 1rem;
}

.im-loading__wave-bar:nth-child(4) {
  animation-delay: -0.9s;
  height: 1.5rem;
}

.im-loading__wave-bar:nth-child(5) {
  animation-delay: -0.8s;
  height: 2rem;
}

@keyframes im-loading-wave {
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

.im-loading__text {
  @apply mt-2 text-sm text-gray-700;
}
</style>
