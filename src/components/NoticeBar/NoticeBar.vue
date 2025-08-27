<template>
  <div
    v-if="visible"
    class="im-notice-bar"
    :class="[
      `im-notice-bar--${type}`,
      { 'im-notice-bar--scrollable': scrollable }
    ]"
    @click="handleClick"
  >
    <div class="im-notice-bar__left">
      <slot name="left-icon">
        <span v-if="type === 'info'" class="im-notice-bar__icon">ℹ</span>
        <span v-else-if="type === 'warning'" class="im-notice-bar__icon">⚠</span>
        <span v-else-if="type === 'danger'" class="im-notice-bar__icon">⚠</span>
      </slot>
    </div>

    <div ref="wrapRef" class="im-notice-bar__wrap">
      <div
        ref="contentRef"
        class="im-notice-bar__content"
        :class="{ 'im-notice-bar__content--scrolling': scrollable && scrolling }"
        :style="contentStyle"
      >
        <slot>{{ text }}</slot>
      </div>
    </div>

    <div v-if="closable || mode" class="im-notice-bar__right">
      <slot name="right-icon">
        <span
          v-if="closable"
          class="im-notice-bar__close"
          @click.stop="handleClose"
        >
          ×
        </span>
        <span
          v-else-if="mode === 'link'"
          class="im-notice-bar__link"
          @click.stop="handleLink"
        >
          &gt;
        </span>
        <span
          v-else-if="mode === 'closeable'"
          class="im-notice-bar__close"
          @click.stop="handleClose"
        >
          ×
        </span>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

export interface Props {
  text?: string
  type?: 'info' | 'warning' | 'danger'
  mode?: '' | 'closeable' | 'link'
  closable?: boolean
  scrollable?: boolean
  delay?: number
  speed?: number
  color?: string
  backgroundColor?: string
}

interface Emits {
  (e: 'close'): void
  (e: 'click'): void
  (e: 'link'): void
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  type: 'info',
  mode: '',
  closable: false,
  scrollable: true,
  delay: 1000,
  speed: 50,
  color: '',
  backgroundColor: ''
})

const emit = defineEmits<Emits>()

const visible = ref(true)
const wrapRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const scrolling = ref(false)
const animationFrame = ref<number | null>(null)

const contentStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.color) {
    style.color = props.color
  }

  if (props.backgroundColor) {
    style.backgroundColor = props.backgroundColor
  }

  return style
})

const startScroll = () => {
  if (!props.scrollable || !wrapRef.value || !contentRef.value) return

  nextTick(() => {
    const wrapWidth = wrapRef.value?.offsetWidth || 0
    const contentWidth = contentRef.value?.offsetWidth || 0

    if (contentWidth > wrapWidth) {
      scrolling.value = true

      setTimeout(() => {
        if (!contentRef.value) return

        let position = 0
        const totalDistance = contentWidth
        const step = props.speed / 100

        const animate = () => {
          if (!contentRef.value) return

          position -= step
          if (Math.abs(position) >= totalDistance + wrapWidth) {
            position = wrapWidth
          }

          contentRef.value.style.transform = `translateX(${position}px)`
          animationFrame.value = requestAnimationFrame(animate)
        }

        animationFrame.value = requestAnimationFrame(animate)
      }, props.delay)
    }
  })
}

const stopScroll = () => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
    animationFrame.value = null
  }
}

const handleClose = () => {
  visible.value = false
  stopScroll()
  emit('close')
}

const handleClick = () => {
  emit('click')
}

const handleLink = () => {
  emit('link')
}

onMounted(() => {
  startScroll()
})

onUnmounted(() => {
  stopScroll()
})
</script>

<style scoped>
.im-notice-bar {
  @apply flex items-center w-full h-10 px-4 text-sm;
}

.im-notice-bar--info {
  @apply bg-blue-50 text-blue-800;
}

.im-notice-bar--warning {
  @apply bg-yellow-50 text-yellow-800;
}

.im-notice-bar--danger {
  @apply bg-red-50 text-red-800;
}

.im-notice-bar__left {
  @apply flex-shrink-0 mr-2;
}

.im-notice-bar__icon {
  @apply font-bold;
}

.im-notice-bar__wrap {
  @apply flex-1 overflow-hidden whitespace-nowrap;
}

.im-notice-bar__content {
  @apply inline-block;
}

.im-notice-bar__content--scrolling {
  @apply inline-block absolute;
}

.im-notice-bar__right {
  @apply flex-shrink-0 ml-2;
}

.im-notice-bar__close,
.im-notice-bar__link {
  @apply cursor-pointer font-bold;
}
</style>
