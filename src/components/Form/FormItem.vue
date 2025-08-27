<template>
  <div
    class="im-form-item"
    :class="{
      'im-form-item-inline': formContext?.inline,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating'
    }"
  >
    <label
      v-if="label"
      class="im-form-item__label"
      :style="{ width: formContext?.labelWidth }"
    >
      {{ label }}
      <span v-if="required" class="im-form-item__required">*</span>
    </label>

    <div class="im-form-item__content">
      <slot />
      <div v-if="validateMessage" class="im-form-item__error">
        {{ validateMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, reactive } from 'vue'

interface FormContext {
  model: Record<string, any>
  rules: Record<string, any>
  labelPosition: string
  labelWidth: string
  inline?: boolean
  registerItem: (item: any) => void
  unregisterItem: (prop: string) => void
  validateField: (prop: string) => Promise<boolean>
}

export interface Props {
  label?: string
  prop?: string
  required?: boolean
  rules?: any
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  prop: '',
  required: false,
  rules: undefined
})

const formContext = inject<FormContext | undefined>('formContext')

const validateState = ref<'success' | 'error' | 'validating'>('')
const validateMessage = ref('')

const getRules = () => {
  const rules = props.rules || (formContext?.rules?.[props.prop] || [])
  return Array.isArray(rules) ? rules : [rules]
}

const validate = async (): Promise<boolean> => {
  if (!props.prop) return true

  const rules = getRules()
  if (rules.length === 0) return true

  validateState.value = 'validating'

  // 简单验证逻辑
  for (const rule of rules) {
    const value = formContext?.model?.[props.prop]

    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      validateState.value = 'error'
      validateMessage.value = rule.message || `${props.label} 是必填项`
      return false
    }

    if (rule.pattern && value && !rule.pattern.test(value)) {
      validateState.value = 'error'
      validateMessage.value = rule.message || `${props.label} 格式不正确`
      return false
    }

    if (rule.validator) {
      try {
        rule.validator(rule, value)
      } catch (error: any) {
        validateState.value = 'error'
        validateMessage.value = error.message || '验证失败'
        return false
      }
    }
  }

  validateState.value = 'success'
  validateMessage.value = ''
  return true
}

onMounted(() => {
  if (props.prop) {
    formContext?.registerItem?.({
      prop: props.prop,
      validate
    })
  }
})

onUnmounted(() => {
  if (props.prop) {
    formContext?.unregisterItem?.(props.prop)
  }
})
</script>

<style scoped>
.im-form-item {
  @apply mb-4 flex;
}

.im-form-item-inline {
  @apply inline-flex mr-4 mb-0;
}

.im-form-item__label {
  @apply block text-sm font-medium text-gray-700 mb-1;
  text-align: right;
  padding-right: 12px;
  vertical-align: middle;
  line-height: 40px;
}

.im-form-item-inline .im-form-item__label {
  @apply mb-0 mr-2;
  line-height: inherit;
}

.im-form-item__content {
  @apply flex-1 relative;
  line-height: 40px;
}

.im-form-item__error {
  @apply text-red-500 text-xs mt-1;
  line-height: 1;
}

.is-error .im-form-item__content {
  @apply relative;
}
</style>
