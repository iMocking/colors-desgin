<template>
  <div class="im-input-wrapper" :class="{ 'im-input-group': $slots.prepend || $slots.append }">
    <div v-if="$slots.prepend" class="im-input-prepend">
      <slot name="prepend" />
    </div>

    <input
      ref="inputRef"
      :class="inputClasses"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    />

    <div v-if="$slots.append" class="im-input-append">
      <slot name="append" />
    </div>

    <div v-if="clearable && modelValue" class="im-input-clear" @click="clear">
      <span>×</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'input', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  clearable: false,
  size: 'medium'
})

const emit = defineEmits<Emits>()
const inputRef = ref<HTMLInputElement | null>(null)

const inputClasses = computed(() => {
  return [
    'im-input-base',
    `im-input-${props.size}`,
    {
      'im-input-disabled': props.disabled,
      'im-input-clearable': props.clearable
    }
  ]
})

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
  emit('input', value)
}

const handleChange = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('change', value)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const clear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

// 暴露方法给父组件
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>

<style scoped>
.im-input-wrapper {
  position: relative;
  display: inline-flex;
  width: 100%;
  align-items: center;
}

.im-input-base {
  @apply im-input-base;
  flex: 1;
}

.im-input-small {
  @apply h-8 text-xs px-2 py-1;
}

.im-input-medium {
  @apply h-10 text-sm px-3 py-2;
}

.im-input-large {
  @apply h-12 text-base px-4 py-3;
}

.im-input-disabled {
  @apply cursor-not-allowed opacity-70;
}

.im-input-clear {
  position: absolute;
  right: 8px;
  cursor: pointer;
  color: #999;
  font-size: 16px;
}

.im-input-group {
  @apply im-input-base flex items-center;
  padding: 0;
}

.im-input-prepend,
.im-input-append {
  @apply flex items-center px-2 bg-gray-100 text-gray-600;
}

.im-input-prepend {
  @apply border-r border-gray-300 rounded-l-md;
}

.im-input-append {
  @apply border-l border-gray-300 rounded-r-md;
}
</style>
