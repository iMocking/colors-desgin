<template>
  <div
    class="im-carousel__item"
    :class="{ 'im-carousel__item--active': isActive, 'im-carousel__item--card': isCardType }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, getCurrentInstance } from 'vue'

export interface Props {
  name?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  label: ''
})

const instance = getCurrentInstance()
const carousel: any = inject('carousel', null)

const isActive = computed(() => {
  return carousel?.activeIndex.value === (instance?.uid || 0)
})

const isCardType = computed(() => {
  // 根据carousel的type属性判断
  return false
})

onMounted(() => {
  if (carousel) {
    carousel.registerItem({
      uid: instance?.uid,
      name: props.name,
      label: props.label
    })
  }
})

onUnmounted(() => {
  if (carousel) {
    carousel.unregisterItem(instance?.uid)
  }
})
</script>

<style scoped>
.im-carousel__item {
  @apply flex-shrink-0 w-full;
}

.im-carousel__item--active {
  /* 激活状态样式 */
}
</style>
