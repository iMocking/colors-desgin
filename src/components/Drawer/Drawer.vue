<template>
  <teleport to="body">
    <div
      v-if="modelValue"
      class="im-drawer__wrapper"
      :class="{ 'im-drawer__wrapper--visible': visible }"
    >
      <div
        class="im-drawer__mask"
        @click="handleClose"
      />

      <div
        class="im-drawer"
        :class="[
          `im-drawer--${placement}`,
          { 'im-drawer--open': visible }
        ]"
        :style="drawerStyle"
      >
        <div class="im-drawer__header">
          <div class="im-drawer__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button
            v-if="showClose"
            class="im-drawer__close"
            @click="handleClose"
          >
            ×
          </button>
        </div>

        <div class="im-drawer__body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="im-drawer__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

export interface Props {
  modelValue: boolean
  title?: string
  placement?: 'left' | 'right' | 'top' | 'bottom'
  size?: string
  showClose?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  destroyOnClose?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  title: '',
  placement: 'right',
  size: '30%',
  showClose: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  destroyOnClose: false
})

const emit = defineEmits<Emits>()

const visible = ref(false)

const drawerStyle = computed(() => {
  const style: Record<string, string> = {}

  if (['left', 'right'].includes(props.placement)) {
    style.width = props.size
  } else {
    style.height = props.size
  }

  return style
})

const handleClose = () => {
  if (props.closeOnClickModal) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnPressEscape) {
    handleClose()
  }
}

watch(() => props.modelValue, (val) => {
  if (val) {
    nextTick(() => {
      visible.value = true
      emit('open')
      document.addEventListener('keydown', handleKeydown)
    })
  } else {
    visible.value = false
    document.removeEventListener('keydown', handleKeydown)
    if (props.destroyOnClose) {
      setTimeout(() => {
        // 延迟触发销毁
      }, 300)
    }
  }
}, { immediate: true })

// 组件卸载时清理事件监听
// onUnmounted(() => {
//   document.removeEventListener('keydown', handleKeydown)
// })
</script>

<style scoped>
.im-drawer__wrapper {
  @apply fixed inset-0 z-50 overflow-hidden;
  visibility: hidden;
}

.im-drawer__wrapper--visible {
  visibility: visible;
}

.im-drawer__mask {
  @apply absolute inset-0 bg-black bg-opacity-30 transition-opacity;
}

.im-drawer {
  @apply absolute bg-white shadow-lg flex flex-col transition-transform duration-300 ease-in-out;
}

.im-drawer--left {
  @apply top-0 left-0 h-full;
  transform: translateX(-100%);
}

.im-drawer--right {
  @apply top-0 right-0 h-full;
  transform: translateX(100%);
}

.im-drawer--top {
  @apply top-0 left-0 w-full;
  transform: translateY(-100%);
}

.im-drawer--bottom {
  @apply bottom-0 left-0 w-full;
  transform: translateY(100%);
}

.im-drawer--open {
  transform: translate(0);
}

.im-drawer__header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200;
}

.im-drawer__title {
  @apply text-lg font-semibold text-gray-800;
}

.im-drawer__close {
  @apply text-2xl text-gray-500 hover:text-gray-700 focus:outline-none;
}

.im-drawer__body {
  @apply flex-1 overflow-auto p-6;
}

.im-drawer__footer {
  @apply px-6 py-4 border-t border-gray-200;
}
</style>
