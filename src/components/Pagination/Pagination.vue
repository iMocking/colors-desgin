<template>
  <div class="im-pagination">
    <button
      class="im-pagination__btn im-pagination__prev"
      :disabled="currentPage <= 1"
      @click="prev"
    >
      &lt;
    </button>

    <template v-if="showQuickJumper">
      <button
        v-for="page in pages"
        :key="page"
        class="im-pagination__btn"
        :class="{ 'im-pagination__btn--active': page === currentPage }"
        @click="handlePageClick(page)"
      >
        {{ page }}
      </button>
    </template>

    <template v-else>
      <!-- 简化版分页 -->
      <button
        v-for="page in simplePages"
        :key="page"
        class="im-pagination__btn"
        :class="{ 'im-pagination__btn--active': page === currentPage }"
        @click="handlePageClick(page)"
      >
        {{ page }}
      </button>
    </template>

    <button
      class="im-pagination__btn im-pagination__next"
      :disabled="currentPage >= pageCount"
      @click="next"
    >
      &gt;
    </button>

    <div v-if="showTotal" class="im-pagination__total">
      共 {{ total }} 条
    </div>

    <div v-if="showSizer" class="im-pagination__sizer">
      <select :value="pageSize" @change="handleSizeChange">
        <option
          v-for="size in pageSizes"
          :key="size"
          :value="size"
        >
          {{ size }} 条/页
        </option>
      </select>
    </div>

    <div v-if="showQuickJumper" class="im-pagination__jump">
      跳至
      <input
        type="number"
        min="1"
        :max="pageCount"
        class="im-pagination__jump-input"
        @change="handleJump"
      />
      页
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface Props {
  modelValue: number
  pageSize?: number
  total: number
  pageSizes?: number[]
  showTotal?: boolean
  showSizer?: boolean
  showQuickJumper?: boolean
  simple?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number): void
  (e: 'update:pageSize', value: number): void
  (e: 'change', page: number, pageSize: number): void
  (e: 'size-change', size: number): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 1,
  pageSize: 10,
  total: 0,
  pageSizes: () => [10, 20, 30, 40, 50],
  showTotal: false,
  showSizer: false,
  showQuickJumper: false,
  simple: false
})

const emit = defineEmits<Emits>()

const currentPage = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const pageCount = computed(() => {
  return Math.ceil(props.total / props.pageSize)
})

const pages = computed(() => {
  const pagerCount = 7
  const halfPagerCount = (pagerCount - 1) / 2
  const currentPage = props.modelValue
  const pageCountValue = pageCount.value

  let showPrevMore = false
  let showNextMore = false

  if (pageCountValue > pagerCount) {
    if (currentPage > pagerCount - halfPagerCount) {
      showPrevMore = true
    }
    if (currentPage < pageCountValue - halfPagerCount) {
      showNextMore = true
    }
  }

  const array: number[] = []

  if (showPrevMore && !showNextMore) {
    const startPage = pageCountValue - (pagerCount - 2)
    for (let i = startPage; i < pageCountValue; i++) {
      array.push(i)
    }
  } else if (!showPrevMore && showNextMore) {
    for (let i = 2; i < pagerCount; i++) {
      array.push(i)
    }
  } else if (showPrevMore && showNextMore) {
    const offset = Math.floor(pagerCount / 2) - 1
    for (let i = currentPage - offset; i <= currentPage + offset; i++) {
      array.push(i)
    }
  } else {
    for (let i = 2; i < pageCountValue; i++) {
      array.push(i)
    }
  }

  if (showPrevMore) {
    array.unshift('...')
  }
  if (showNextMore) {
    array.push('...')
  }

  if (pageCountValue > 1) {
    array.unshift(1)
    array.push(pageCountValue)
  }

  return array.filter((page): page is number => typeof page === 'number')
})

const simplePages = computed(() => {
  const pages = []
  const pageCountValue = pageCount.value
  const currentPage = props.modelValue

  if (pageCountValue <= 5) {
    for (let i = 1; i <= pageCountValue; i++) {
      pages.push(i)
    }
  } else {
    let start = Math.max(1, currentPage - 2)
    let end = Math.min(pageCountValue, start + 4)

    if (end - start < 4) {
      start = Math.max(1, end - 4)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

const prev = () => {
  if (currentPage.value > 1) {
    const newPage = currentPage.value - 1
    currentPage.value = newPage
    emit('change', newPage, props.pageSize)
  }
}

const next = () => {
  if (currentPage.value < pageCount.value) {
    const newPage = currentPage.value + 1
    currentPage.value = newPage
    emit('change', newPage, props.pageSize)
  }
}

const handlePageClick = (page: number) => {
  if (page !== currentPage.value) {
    currentPage.value = page
    emit('change', page, props.pageSize)
  }
}

const handleSizeChange = (event: Event) => {
  const size = Number((event.target as HTMLSelectElement).value)
  emit('update:pageSize', size)
  emit('size-change', size)

  // 重置到第一页
  currentPage.value = 1
  emit('change', 1, size)
}

const handleJump = (event: Event) => {
  const target = event.target as HTMLInputElement
  const page = parseInt(target.value, 10)

  if (!isNaN(page) && page >= 1 && page <= pageCount.value) {
    currentPage.value = page
    emit('change', page, props.pageSize)
  }
  target.value = ''
}
</script>

<style scoped>
.im-pagination {
  @apply flex items-center gap-2 text-sm;
}

.im-pagination__btn {
  @apply flex items-center justify-center min-w-[32px] h-8 px-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0;
}

.im-pagination__btn:disabled {
  @apply opacity-50 cursor-not-allowed hover:bg-white;
}

.im-pagination__btn--active {
  @apply bg-blue-500 text-white border-blue-500 hover:bg-blue-600;
}

.im-pagination__total {
  @apply ml-2 text-gray-600;
}

.im-pagination__sizer select {
  @apply ml-2 h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.im-pagination__jump {
  @apply ml-2 flex items-center text-gray-600;
}

.im-pagination__jump-input {
  @apply mx-1 w-12 h-8 px-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
