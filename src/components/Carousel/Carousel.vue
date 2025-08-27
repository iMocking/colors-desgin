<template>
  <div
    class="im-carousel"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div
      class="im-carousel__container"
      :style="{ height: height }"
    >
      <div
        class="im-carousel__track"
        :style="trackStyle"
        @transitionend="onTransitionEnd"
      >
        <slot />
      </div>
    </div>

    <div
      v-if="indicatorPosition !== 'none'"
      class="im-carousel__indicators"
      :class="`im-carousel__indicators--${indicatorPosition}`"
    >
      <button
        v-for="(item, index) in items"
        :key="index"
        class="im-carousel__indicator"
        :class="{ 'im-carousel__indicator--active': index === activeIndex }"
        @click="setActiveItem(index)"
      />
    </div>

    <button
      v-if="arrow !== 'never'"
      class="im-carousel__arrow im-carousel__arrow--left"
      :class="{ 'im-carousel__arrow--always': arrow === 'always' }"
      @click="prev"
    >
      &lt;
    </button>

    <button
      v-if="arrow !== 'never'"
      class="im-carousel__arrow im-carousel__arrow--right"
      :class="{ 'im-carousel__arrow--always': arrow === 'always' }"
      @click="next"
    >
      &gt;
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, provide, useSlots } from 'vue'

export interface Props {
  height?: string
  initialIndex?: number
  trigger?: 'hover' | 'click'
  autoplay?: boolean
  interval?: number
  indicatorPosition?: 'outside' | 'inside' | 'none'
  arrow?: 'always' | 'hover' | 'never'
  type?: '' | 'card'
  loop?: boolean
}

interface Emits {
  (e: 'change', current: number, prev: number): void
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  initialIndex: 0,
  trigger: 'hover',
  autoplay: true,
  interval: 3000,
  indicatorPosition: 'inside',
  arrow: 'hover',
  type: '',
  loop: true
})

const emit = defineEmits<Emits>()

const activeIndex = ref(props.initialIndex)
const items = ref<any[]>([])
const timer = ref<number | null>(null)
const isTransitioning = ref(false)
const isHovering = ref(false)

const trackStyle = computed(() => {
  const translateX = -activeIndex.value * 100
  return {
    transform: `translateX(${translateX}%)`,
    transition: isTransitioning.value ? 'transform 0.3s ease-in-out' : 'none'
  }
})

const setActiveItem = (index: number) => {
  if (index === activeIndex.value || isTransitioning.value) return

  const prevIndex = activeIndex.value
  activeIndex.value = index
  isTransitioning.value = true
  emit('change', index, prevIndex)
}

const prev = () => {
  if (isTransitioning.value) return

  let targetIndex = activeIndex.value - 1
  if (targetIndex < 0) {
    targetIndex = props.loop ? items.value.length - 1 : 0
  }
  setActiveItem(targetIndex)
}

const next = () => {
  if (isTransitioning.value) return

  let targetIndex = activeIndex.value + 1
  if (targetIndex >= items.value.length) {
    targetIndex = props.loop ? 0 : items.value.length - 1
  }
  setActiveItem(targetIndex)
}

const onTransitionEnd = () => {
  isTransitioning.value = false
}

const startTimer = () => {
  if (!props.autoplay || isHovering.value) return

  stopTimer()
  timer.value = window.setTimeout(() => {
    next()
    startTimer()
  }, props.interval)
}

const stopTimer = () => {
  if (timer.value) {
    clearTimeout(timer.value)
    timer.value = null
  }
}

const handleMouseEnter = () => {
  isHovering.value = true
  stopTimer()
}

const handleMouseLeave = () => {
  isHovering.value = false
  startTimer()
}

const registerItem = (item: any) => {
  items.value.push(item)
}

const unregisterItem = (uid: number) => {
  const index = items.value.findIndex((item: any) => item.uid === uid)
  if (index !== -1) {
    items.value.splice(index, 1)
  }
}

provide('carousel', {
  activeIndex,
  trigger: props.trigger,
  registerItem,
  unregisterItem
})

onMounted(() => {
  if (props.autoplay) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style scoped>
.im-carousel {
  @apply relative overflow-hidden rounded-lg;
}

.im-carousel__container {
  @apply relative w-full overflow-hidden;
}

.im-carousel__track {
  @apply flex;
}

.im-carousel__indicators {
  @apply absolute flex justify-center items-center z-10;
}

.im-carousel__indicators--inside {
  @apply bottom-4 left-0 right-0;
}

.im-carousel__indicators--outside {
  @apply bottom-0 left-0 right-0 mb-[-20px];
}

.im-carousel__indicator {
  @apply w-3 h-3 mx-1 rounded-full border-0 bg-white bg-opacity-50 cursor-pointer transition-all;
}

.im-carousel__indicator--active {
  @apply bg-white bg-opacity-100;
}

.im-carousel__arrow {
  @apply absolute top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full bg-white bg-opacity-30 text-white flex items-center justify-center text-xl cursor-pointer transition-all z-10 border-0;
  display: none;
}

.im-carousel:hover .im-carousel__arrow {
  display: block;
}

.im-carousel__arrow--always {
  display: block;
}

.im-carousel__arrow--left {
  @apply left-4;
}

.im-carousel__arrow--right {
  @apply right-4;
}

.im-carousel__arrow:hover {
  @apply bg-opacity-50;
}
</style>
