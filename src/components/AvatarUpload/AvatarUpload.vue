<template>
  <div class="im-avatar-upload">
    <div
      class="im-avatar-upload__trigger"
      :class="{ 'im-avatar-upload__trigger--disabled': disabled }"
      @click="handleClick"
    >
      <input
        ref="inputRef"
        type="file"
        class="im-avatar-upload__input"
        :accept="accept"
        :disabled="disabled"
        @change="handleChange"
      />

      <div v-if="imageUrl" class="im-avatar-upload__preview">
        <img
          :src="imageUrl"
          :alt="name"
          class="im-avatar-upload__image"
        />
        <div
          v-if="!disabled"
          class="im-avatar-upload__overlay"
          @click.stop="handlePreviewClick"
        >
          <span class="im-avatar-upload__icon">👁</span>
        </div>
      </div>

      <div v-else class="im-avatar-upload__placeholder">
        <div class="im-avatar-upload__icon">{{ uploadIcon }}</div>
        <div v-if="text" class="im-avatar-upload__text">{{ text }}</div>
      </div>
    </div>

    <div
      v-if="showFileList && fileList.length"
      class="im-avatar-upload__file-list"
    >
      <div
        v-for="(file, index) in fileList"
        :key="index"
        class="im-avatar-upload__file-item"
      >
        <span class="im-avatar-upload__file-name">{{ file.name }}</span>
        <span class="im-avatar-upload__file-size">{{ formatFileSize(file.size) }}</span>
        <button
          v-if="!disabled"
          class="im-avatar-upload__file-remove"
          @click="removeFile(index)"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface FileItem {
  name: string
  size: number
  type: string
  url?: string
  raw: File
}

export interface Props {
  modelValue?: string
  name?: string
  size?: number
  accept?: string
  disabled?: boolean
  showFileList?: boolean
  multiple?: boolean
  limit?: number
  maxSize?: number
  text?: string
  uploadIcon?: string
  autoUpload?: boolean
  drag?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void
  (e: 'change', file: File, fileList: FileItem[]): void
  (e: 'success', response: any, file: FileItem, fileList: FileItem[]): void
  (e: 'error', error: any, file: FileItem, fileList: FileItem[]): void
  (e: 'remove', file: FileItem, fileList: FileItem[]): void
  (e: 'exceed', files: File[], fileList: FileItem[]): void
  (e: 'preview', file: FileItem): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  name: 'avatar',
  size: 120,
  accept: 'image/*',
  disabled: false,
  showFileList: false,
  multiple: false,
  limit: 1,
  maxSize: 2 * 1024 * 1024, // 2MB
  text: '点击上传',
  uploadIcon: '+',
  autoUpload: true,
  drag: false
})

const emit = defineEmits<Emits>()

const inputRef = ref<HTMLInputElement | null>(null)
const fileList = ref<FileItem[]>([])
const imageUrl = ref(props.modelValue)

const handleClick = () => {
  if (props.disabled || !inputRef.value) return
  inputRef.value.click()
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  if (props.limit && fileList.value.length + files.length > props.limit) {
    emit('exceed', Array.from(files), fileList.value)
    return
  }

  handleFiles(Array.from(files))
  target.value = ''
}

const handleFiles = (files: File[]) => {
  files.forEach(file => {
    if (props.maxSize && file.size > props.maxSize) {
      // 文件过大
      return
    }

    if (!props.accept.includes(file.type) && !file.type.startsWith('image/')) {
      // 文件类型不匹配
      return
    }

    const fileItem: FileItem = {
      name: file.name,
      size: file.size,
      type: file.type,
      raw: file
    }

    fileList.value.push(fileItem)

    if (props.autoUpload) {
      uploadFile(fileItem)
    }

    emit('change', file, fileList.value)
  })
}

const uploadFile = (fileItem: FileItem) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    imageUrl.value = result
    emit('update:modelValue', result)
    emit('success', { url: result }, fileItem, fileList.value)
  }
  reader.onerror = (error) => {
    emit('error', error, fileItem, fileList.value)
  }
  reader.readAsDataURL(fileItem.raw)
}

const removeFile = (index: number) => {
  const removedFile = fileList.value[index]
  fileList.value.splice(index, 1)
  emit('remove', removedFile, fileList.value)

  if (removedFile.url === imageUrl.value) {
    imageUrl.value = ''
    emit('update:modelValue', '')
  }
}

const handlePreviewClick = () => {
  if (fileList.value.length > 0) {
    emit('preview', fileList.value[fileList.value.length - 1])
  }
}

const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return size + ' B'
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return (size / (1024 * 1024)).toFixed(1) + ' MB'
  }
}

watch(() => props.modelValue, (val) => {
  imageUrl.value = val
})
</script>

<style scoped>
.im-avatar-upload {
  @apply inline-block;
}

.im-avatar-upload__trigger {
  @apply relative cursor-pointer inline-block border-2 border-dashed border-gray-300 rounded-lg transition-colors hover:border-blue-500;
}

.im-avatar-upload__trigger--disabled {
  @apply cursor-not-allowed opacity-50;
}

.im-avatar-upload__input {
  @apply hidden;
}

.im-avatar-upload__preview {
  @apply relative;
}

.im-avatar-upload__image {
  @apply block rounded-lg object-cover;
  width: v-bind('`${props.size}px`');
  height: v-bind('`${props.size}px`');
}

.im-avatar-upload__overlay {
  @apply absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 transition-opacity hover:opacity-100;
}

.im-avatar-upload__icon {
  @apply text-white text-xl;
}

.im-avatar-upload__placeholder {
  @apply flex flex-col items-center justify-center text-gray-400;
  width: v-bind('`${props.size}px`');
  height: v-bind('`${props.size}px`');
}

.im-avatar-upload__text {
  @apply mt-1 text-xs;
}

.im-avatar-upload__file-list {
  @apply mt-2;
}

.im-avatar-upload__file-item {
  @apply flex items-center justify-between py-2 px-3 bg-gray-50 rounded text-sm;
}

.im-avatar-upload__file-name {
  @apply truncate max-w-[120px];
}

.im-avatar-upload__file-size {
  @apply text-gray-500 mx-2;
}

.im-avatar-upload__file-remove {
  @apply text-gray-400 hover:text-red-500;
}
</style>
