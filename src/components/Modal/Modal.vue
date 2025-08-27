<template>
  <teleport to="body">
    <div
      v-if="modelValue || visible"
      class="im-modal__wrapper"
      :class="{ 'im-modal__wrapper--visible': visible }"
    >
      <div
        class="im-modal__mask"
        @click="handleMaskClick"
      />

      <div
        class="im-modal"
        :class="[
          `im-modal--${size}`,
          modalClass
        ]"
        :style="customStyle"
      >
        <div class="im-modal__header" v-if="showHeader">
          <div class="im-modal__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <button
            v-if="showClose"
            class="im-modal__close"
            @click="handleClose"
          >
            ×
          </button>
        </div>

        <div class="im-modal__body">
          <slot />
        </div>

        <div
          v-if="$slots.footer || showFooter"
          class="im-modal__footer"
          :class="{ 'im-modal__footer--bordered': footerBordered }"
        >
          <slot name="footer">
            <Button @click="handleCancel">
              {{ cancelText }}
            </Button>
            <Button
              type="primary"
              :loading="confirmLoading"
              @click="handleOk"
            >
              {{ okText }}
            </Button>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import Button from '../Button/Button.vue'

export interface Props {
  modelValue?: boolean
  title?: string
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  showHeader?: boolean
  showFooter?: boolean
  footerBordered?: boolean
  showClose?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  cancelText?: string
  okText?: string
  confirmLoading?: boolean
  maskClosable?: boolean
  modalClass?: string
  customStyle?: Record<string, string>
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
  (e: 'close'): void
  (e: 'open'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  title: '',
  size: 'medium',
  showHeader: true,
  showFooter: true,
  footerBordered: true,
  showClose: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  cancelText: '取消',
  okText: '确定',
  confirmLoading: false,
  maskClosable: true,
  modalClass: '',
  customStyle: () => ({})
})

const emit = defineEmits<Emits>()

const visible = ref(false)

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

const handleClose = () => {
  visible.value = false
  if (props.modelValue !== undefined) {
    emit('update:modelValue', false)
  }
  emit('close')
}

const handleCancel = () => {
  handleClose()
  emit('cancel')
}

const handleOk = () => {
  emit('ok')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.closeOnPressEscape) {
    handleClose()
  }
}

watch(() => props.modelValue, (val) => {
  if (val !== undefined) {
    if (val) {
      nextTick(() => {
        visible.value = true
        emit('open')
        document.addEventListener('keydown', handleKeydown)
      })
    } else {
      visible.value = false
      document.removeEventListener('keydown', handleKeydown)
    }
  }
}, { immediate: true })

// 组件卸载时清理事件监听
// onUnmounted(() => {
//   document.removeEventListener('keydown', handleKeydown)
// })
</script>

<style scoped>
.im-modal__wrapper {
  @apply fixed inset-0 z-50 overflow-auto flex items-center justify-center;
  visibility: hidden;
}

.im-modal__wrapper--visible {
  visibility: visible;
}

.im-modal__mask {
  @apply absolute inset-0 bg-black bg-opacity-30 transition-opacity;
}

.im-modal {
  @apply relative bg-white rounded-lg shadow-xl mx-4 my-8 max-h-[calc(100vh-4rem)] flex flex-col;
  animation: modal-fade-in 0.3s ease-out;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.im-modal--small {
  @apply max-w-md;
}

.im-modal--medium {
  @apply max-w-xl;
}

.im-modal--large {
  @apply max-w-3xl;
}

.im-modal--fullscreen {
  @apply w-screen h-screen max-w-full max-h-full m-0 rounded-none;
}

.im-modal__header {
  @apply flex items-center justify-between px-6 py-4 border-b border-gray-200;
}

.im-modal__title {
  @apply text-lg font-semibold text-gray-800;
}

.im-modal__close {
  @apply text-2xl text-gray-500 hover:text-gray-700 focus:outline-none;
}

.im-modal__body {
  @apply flex-1 overflow-auto p-6;
}

.im-modal__footer {
  @apply px-6 py-4 flex justify-end gap-2;
}

.im-modal__footer--bordered {
  @apply border-t border-gray-200;
}
</style>
