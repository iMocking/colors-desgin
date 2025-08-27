<template>
  <form class="im-form" @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script setup lang="ts">
import { provide, reactive } from 'vue'

interface FormItem {
  prop: string
  value: any
  validate: () => Promise<boolean>
}

export interface Props {
  model: Record<string, any>
  rules?: Record<string, any>
  labelPosition?: 'left' | 'right' | 'top'
  labelWidth?: string
  inline?: boolean
}

interface Emits {
  (e: 'submit', data: Record<string, any>): void
  (e: 'validate', isValid: boolean, errors?: Record<string, any>): void
}

const props = withDefaults(defineProps<Props>(), {
  model: () => ({}),
  rules: () => ({}),
  labelPosition: 'right',
  labelWidth: '100px',
  inline: false
})

const emit = defineEmits<Emits>()

// 表单项注册管理
const formItems = reactive<FormItem[]>([])

const registerItem = (item: FormItem) => {
  formItems.push(item)
}

const unregisterItem = (prop: string) => {
  const index = formItems.findIndex(item => item.prop === prop)
  if (index > -1) {
    formItems.splice(index, 1)
  }
}

// 表单验证
const validate = async (): Promise<boolean> => {
  const validations = formItems.map(item => item.validate())
  try {
    const results = await Promise.all(validations)
    const isValid = results.every(result => result)
    emit('validate', isValid)
    return isValid
  } catch (errors) {
    emit('validate', false, errors as Record<string, any>)
    return false
  }
}

const validateField = async (prop: string): Promise<boolean> => {
  const item = formItems.find(item => item.prop === prop)
  if (item) {
    return await item.validate()
  }
  return false
}

const resetFields = () => {
  formItems.forEach(item => {
    // 重置值和验证状态
  })
}

const clearValidate = () => {
  formItems.forEach(item => {
    // 清除验证状态
  })
}

const handleSubmit = async () => {
  const isValid = await validate()
  if (isValid) {
    emit('submit', props.model)
  }
}

// 提供给子组件的上下文
provide('formContext', {
  model: props.model,
  rules: props.rules,
  labelPosition: props.labelPosition,
  labelWidth: props.labelWidth,
  inline: props.inline,
  registerItem,
  unregisterItem,
  validateField
})

defineExpose({
  validate,
  validateField,
  resetFields,
  clearValidate
})
</script>

<style scoped>
.im-form {
  @apply w-full;
}
</style>
