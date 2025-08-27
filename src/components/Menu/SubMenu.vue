<template>
  <li class="im-sub-menu">
    <div
      class="im-sub-menu__title"
      :class="{
        'im-sub-menu__title--active': isOpened,
        'im-sub-menu__title--disabled': disabled
      }"
      @click="handleClick"
    >
      <slot name="title" />
      <span
        class="im-sub-menu__icon"
        :class="{ 'im-sub-menu__icon--opened': isOpened }"
      >
        ▼
      </span>
    </div>

    <transition name="slide">
      <ul v-show="isOpened" class="im-sub-menu__content">
        <slot />
      </ul>
    </transition>
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

const isOpened = computed(() => {
  return rootMenu?.openedMenus.value.includes(props.index)
})

const handleClick = () => {
  if (props.disabled || !rootMenu) return

  if (isOpened.value) {
    rootMenu.closeMenu(props.index)
  } else {
    rootMenu.openMenu(props.index)
  }
}
</script>

<style scoped>
.im-sub-menu {
  @apply list-none;
}

.im-sub-menu__title {
  @apply cursor-pointer px-4 py-3 text-sm transition-colors flex items-center justify-between;
}

.im-menu--vertical .im-sub-menu__title {
  @apply hover:bg-gray-50 border-r-2 border-transparent;
}

.im-menu--horizontal .im-sub-menu__title {
  @apply hover:bg-gray-50 border-b-2 border-transparent;
}

.im-sub-menu__title--active {
  @apply text-blue-600 font-medium;
}

.im-menu--vertical .im-sub-menu__title--active {
  @apply border-r-blue-600 bg-blue-50;
}

.im-menu--horizontal .im-sub-menu__title--active {
  @apply border-b-blue-600;
}

.im-sub-menu__title--disabled {
  @apply cursor-not-allowed opacity-50;
}

.im-sub-menu__icon {
  @apply text-xs transition-transform ml-2;
}

.im-sub-menu__icon--opened {
  @apply rotate-180;
}

.im-sub-menu__content {
  @apply list-none m-0 p-0;
}

.im-menu--vertical .im-sub-menu__content {
  @apply bg-gray-50;
}

.slide-enter-active,
.slide-leave-active {
  @apply transition-all duration-300 overflow-hidden;
}

.slide-enter-from,
.slide-leave-to {
  @apply max-h-0 opacity-0;
}

.slide-enter-to,
.slide-leave-from {
  @apply max-h-96 opacity-100;
}
</style>
