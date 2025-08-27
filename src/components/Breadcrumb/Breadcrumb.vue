<template>
  <nav class="im-breadcrumb" aria-label="Breadcrumb">
    <ol class="im-breadcrumb__list">
      <slot />
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { provide } from 'vue'

export interface Props {
  separator?: string
}

const props = withDefaults(defineProps<Props>(), {
  separator: '/'
})

provide('breadcrumb-separator', props.separator)
</script>

<style scoped>
.im-breadcrumb {
  @apply text-sm;
}

.im-breadcrumb__list {
  @apply flex items-center space-x-2;
}
</style>
