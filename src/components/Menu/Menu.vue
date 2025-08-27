<template>
  <ul
    class="im-menu"
    :class="[
      `im-menu--${mode}`,
      { 'im-menu--collapsed': collapsed }
    ]"
  >
    <slot />
  </ul>
</template>

<script setup lang="ts">
import { provide, ref, watch } from 'vue'

export interface Props {
  mode?: 'vertical' | 'horizontal'
  defaultActive?: string
  defaultOpeneds?: string[]
  uniqueOpened?: boolean
  collapsed?: boolean
  backgroundColor?: string
  textColor?: string
  activeTextColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'vertical',
  defaultActive: '',
  defaultOpeneds: () => [],
  uniqueOpened: false,
  collapsed: false,
  backgroundColor: '',
  textColor: '',
  activeTextColor: ''
})

const emit = defineEmits<{
  (e: 'select', index: string): void
  (e: 'open', index: string): void
  (e: 'close', index: string): void
}>()

const activeIndex = ref(props.defaultActive)
const openedMenus = ref([...props.defaultOpeneds])

const openMenu = (index: string) => {
  if (openedMenus.value.includes(index)) return

  if (props.uniqueOpened) {
    openedMenus.value = [index]
  } else {
    openedMenus.value.push(index)
  }

  emit('open', index)
}

const closeMenu = (index: string) => {
  const indexInOpened = openedMenus.value.indexOf(index)
  if (indexInOpened !== -1) {
    openedMenus.value.splice(indexInOpened, 1)
    emit('close', index)
  }
}

const handleSelect = (index: string) => {
  activeIndex.value = index
  emit('select', index)
}

provide('rootMenu', {
  activeIndex,
  openedMenus,
  props,
  openMenu,
  closeMenu,
  handleSelect
})

watch(() => props.defaultActive, (newVal) => {
  activeIndex.value = newVal
})

watch(() => props.defaultOpeneds, (newVal) => {
  openedMenus.value = [...newVal]
})
</script>

<style scoped>
.im-menu {
  @apply list-none m-0 p-0;
}

.im-menu--vertical {
  @apply border-r border-gray-200;
}

.im-menu--horizontal {
  @apply flex items-center border-b border-gray-200;
}

.im-menu--collapsed {
  @apply w-16;
}
</style>
