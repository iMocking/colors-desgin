# Input 输入框

通过鼠标或键盘输入字符。

## 基础用法

:::demo

:::
```vue 

<template>
  <div class="space-y-4">
    <ImInput v-model="input1" placeholder="请输入内容"/>
    <ImInput v-model="input2" placeholder="禁用状态" disabled/>
    <ImInput v-model="input3" placeholder="只读状态" readonly/>
  </div>
</template>
<script setup lang="ts"> import {ref} from 'vue'

const input1 = ref('')
const input2 = ref('禁用状态')
const input3 = ref('只读状态') </script>
```


## 可清空

:::
demo 使用 [clearable](file://D:\code\github\im-desgin\src\components\Input\Input.vue#L8-L8) 属性即可得到一个可清空的输入框。

:::

```vue

<template>
  <ImInput v-model="input" placeholder="请输入内容" clearable/>
  </div> </template>
<script setup lang="ts"> import {ref} from 'vue'

const input = ref('') </script>
```

## 密码框

:::demo 使用 `type="password"` 来定义一个密码框。

:::

```vue

<template>
  <ImInput v-model="password" type="password" placeholder="请输入密码"/>
  </div> </template>
<script setup lang="ts"> import {ref} from 'vue'

const password = ref('') </script>
```

## 带 icon 的输入框

:::demo 可以通过前置和后置的 slot 在输入框中嵌入图标。

:::

```vue

<template>
  <div class="space-y-4">
    <ImInput v-model="input1" placeholder="请输入内容">
      <template #prepend><span>https://</span></template>
      <template #append><span>.com</span></template>
    </ImInput>
    <ImInput v-model="input2" placeholder="请输入内容">
      <template #prepend>
        <span class="i-carbon-search"></span>
      </template>
    </ImInput>
  </div>
</template>
<script setup lang="ts"> import {ref} from 'vue'

const input1 = ref('')
const input2 = ref('') </script>
```

## 不同尺寸

:::demo 可以通过 [size](file://D:\code\github\im-desgin\src\components\Pagination\Pagination.vue#L146-L146) 属性指定输入框的尺寸。
:::

```vue 

<template>

  <div class="space-y-4">
    <ImInput v-model="input1" placeholder="小型输入框" size="small"/>
    <ImInput v-model="input2" placeholder="默认输入框"/>
    <ImInput v-model="input3" placeholder="大型输入框" size="large"/>
  </div>
</template>
<script setup lang="ts"> import {ref} from 'vue'

const input1 = ref('')
const input2 = ref('')
const input3 = ref('') </script>
```

## Props

| 属性名         | 说明    | 类型                               | 默认值        |
|-------------|-------|----------------------------------|------------|
| modelValue  | 绑定值   | `string \| number`               | `''`       |
| type        | 输入框类型 | `string`                         | `'text'`   |
| placeholder | 占位文本  | `string`                         | `''`       |
| disabled    | 是否禁用  | `boolean`                        | `false`    |
| readonly    | 是否只读  | `boolean`                        | `false`    |
| clearable   | 是否可清空 | `boolean`                        | `false`    |
| size        | 输入框尺寸 | `'small' \| 'medium' \| 'large'` | `'medium'` |

## Events

| 事件名               | 说明        | 类型                                  |
|-------------------|-----------|-------------------------------------|
| update:modelValue | 绑定值改变时触发  | `(value: string \| number) => void` |
| input             | 输入时触发     | `(value: string \| number) => void` |
| change            | 值改变时触发    | `(value: string \| number) => void` |
| focus             | 获得焦点时触发   | `(event: FocusEvent) => void`       |
| blur              | 失去焦点时触发   | `(event: FocusEvent) => void`       |
| clear             | 点击清空按钮时触发 | `() => void`                        |

## Slots

| 插槽名     | 说明      |
|---------|---------|
| prepend | 输入框前置内容 |
| append  | 输入框后置内容 |
