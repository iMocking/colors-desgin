<template>
  <div class="im-table-wrapper">
    <div class="im-table-container">
      <table class="im-table">
        <thead v-if="showHeader" class="im-table__thead">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="getHeaderClass(column)"
              @click="handleSort(column)"
            >
              <div class="im-table__cell-content">
                {{ column.title }}
                <span
                  v-if="column.sortable"
                  class="im-table__sort"
                  :class="getSortClass(column.key)"
                >
                  <span class="im-table__sort-asc">↑</span>
                  <span class="im-table__sort-desc">↓</span>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="im-table__tbody">
          <template v-for="(row, index) in currentData" :key="getRowKey(row, index)">
            <tr class="im-table__row">
              <td
                v-for="column in columns"
                :key="column.key"
                :class="getCellClass(column)"
              >
                <div class="im-table__cell-content">
                  <slot
                    :name="column.key"
                    :row="row"
                    :index="index"
                    :value="row[column.key]"
                  >
                    {{ row[column.key] }}
                  </slot>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="currentData.length === 0" class="im-table__row--empty">
            <td :colspan="columns.length" class="im-table__empty">
              <slot name="empty">
                <div class="im-table__empty-text">暂无数据</div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showPagination" class="im-table__pagination">
      <Pagination
        v-model="currentPage"
        :page-size="pageSize"
        :total="data.length"
        @change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Pagination from '../Pagination/Pagination.vue'

export interface Column {
  key: string
  title: string
  sortable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
}

export interface Props {
  data: any[]
  columns: Column[]
  rowKey?: string | ((row: any, index: number) => string)
  showHeader?: boolean
  showPagination?: boolean
  pageSize?: number
  defaultSort?: {
    key: string
    order: 'asc' | 'desc'
  }
}

interface Emits {
  (e: 'sort-change', sort: { key: string; order: 'asc' | 'desc' } | null): void
  (e: 'page-change', page: number, pageSize: number): void
  (e: 'size-change', size: number): void
}

const props = withDefaults(defineProps<Props>(), {
  data: () => [],
  columns: () => [],
  rowKey: 'id',
  showHeader: true,
  showPagination: false,
  pageSize: 10,
  defaultSort: undefined
})

const emit = defineEmits<Emits>()

const currentPage = ref(1)
const sortState = ref(props.defaultSort || null)

const sortedData = computed(() => {
  if (!sortState.value) return props.data

  const { key, order } = sortState.value
  return [...props.data].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]

    if (aVal < bVal) {
      return order === 'asc' ? -1 : 1
    }
    if (aVal > bVal) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })
})

const currentData = computed(() => {
  if (!props.showPagination) return sortedData.value

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return sortedData.value.slice(start, end)
})

const getRowKey = (row: any, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }
  return row[props.rowKey] || index
}

const getHeaderClass = (column: Column) => {
  return [
    'im-table__th',
    {
      'im-table__th--sortable': column.sortable,
      [`im-table__th--${column.align}`]: column.align
    }
  ]
}

const getCellClass = (column: Column) => {
  return [
    'im-table__td',
    {
      [`im-table__td--${column.align}`]: column.align
    }
  ]
}

const getSortClass = (key: string) => {
  if (!sortState.value || sortState.value.key !== key) {
    return ''
  }
  return `im-table__sort--${sortState.value.order}`
}

const handleSort = (column: Column) => {
  if (!column.sortable) return

  const key = column.key
  let order: 'asc' | 'desc' = 'asc'

  if (sortState.value && sortState.value.key === key) {
    if (sortState.value.order === 'asc') {
      order = 'desc'
    } else {
      // 如果已经是desc，则取消排序
      sortState.value = null
      emit('sort-change', null)
      return
    }
  }

  sortState.value = { key, order }
  emit('sort-change', sortState.value)
}

const handlePageChange = (page: number, pageSize: number) => {
  currentPage.value = page
  emit('page-change', page, pageSize)
}

const handleSizeChange = (size: number) => {
  emit('size-change', size)
  // 重置到第一页
  currentPage.value = 1
}

watch(() => props.defaultSort, (newSort) => {
  sortState.value = newSort || null
})
</script>

<style scoped>
.im-table-wrapper {
  @apply bg-white rounded-lg border border-gray-200;
}

.im-table-container {
  @apply overflow-x-auto;
}

.im-table {
  @apply min-w-full divide-y divide-gray-200;
}

.im-table__thead {
  @apply bg-gray-50;
}

.im-table__th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.im-table__th--center {
  @apply text-center;
}

.im-table__th--right {
  @apply text-right;
}

.im-table__th--sortable {
  @apply cursor-pointer hover:bg-gray-100;
}

.im-table__sort {
  @apply inline-flex flex-col ml-1 text-gray-400;
}

.im-table__sort-asc,
.im-table__sort-desc {
  @apply text-xs leading-3;
}

.im-table__sort--asc .im-table__sort-asc {
  @apply text-blue-500;
}

.im-table__sort--desc .im-table__sort-desc {
  @apply text-blue-500;
}

.im-table__tbody {
  @apply bg-white divide-y divide-gray-200;
}

.im-table__row {
  @apply hover:bg-gray-50;
}

.im-table__td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500;
}

.im-table__td--center {
  @apply text-center;
}

.im-table__td--right {
  @apply text-right;
}

.im-table__cell-content {
  @apply flex items-center;
}

.im-table__row--empty {
  @apply hover:bg-transparent;
}

.im-table__empty {
  @apply px-6 py-12 text-center;
}

.im-table__empty-text {
  @apply text-gray-500;
}

.im-table__pagination {
  @apply px-6 py-3 border-t border-gray-200 flex justify-end;
}
</style>
