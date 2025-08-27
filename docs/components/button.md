# Button 按钮

常用的操作按钮。

## 基础用法

:::demo
使用 [type](file://D:\code\github\im-desgin\src\components\Notification\NotificationManager.ts#L7-L7)、[size](file://D:\code\github\im-desgin\src\components\Pagination\Pagination.vue#L146-L146)、[disabled](file://D:\code\github\im-desgin\node_modules\@vue\runtime-core\dist\runtime-core.d.ts#L1115-L1115)
等属性来定义按钮的样式。

```vue

<template>
  <div class="flex flex-wrap gap-2">
    <ImButton>默认按钮</ImButton>
    <ImButton type="primary">主要按钮</ImButton>
    <ImButton type="secondary">次要按钮</ImButton>
    <ImButton type="success">成功按钮</ImButton>
    <ImButton type="warning">警告按钮</ImButton>
    <ImButton type="error">错误按钮</ImButton>
  </div>
  <div class="flex flex-wrap gap-2 mt-4">
    <ImButton size="small">小型按钮</ImButton>
    <ImButton size="medium">中等按钮</ImButton>
    <ImButton size="large">大型按钮</ImButton>
  </div>
  <div class="flex flex-wrap gap-2 mt-4">
    <ImButton disabled>禁用按钮</ImButton>
    <ImButton type="primary" disabled>禁用主要按钮</ImButton>
  </div>
</template>
```

:::

## 不同尺寸

:::demo Button 组件提供除了默认值以外的三种尺寸。

```vue

<template>
  <div class="flex items-center gap-2">
    <ImButton size="small">小按钮</ImButton>
    <ImButton>默认按钮</ImButton>
    <ImButton size="large">大按钮</ImButton>
  </div>
</template>
```
:::

## 禁用状态

:::demo
你可以使用 [disabled](file://D:\code\github\im-desgin\node_modules\@vue\runtime-core\dist\runtime-core.d.ts#L1115-L1115)
属性来定义按钮是否被禁用。
```vue 

<template>
  <div class="flex gap-2">
    <ImButton disabled>默认按钮</ImButton>
    <ImButton type="primary" disabled>主要按钮</ImButton>
    <ImButton type="success" disabled>成功按钮</ImButton>
  </div>
</template>
```
:::

## 块级按钮

:::demo 使用 [block](file://D:\code\github\im-desgin\src\components\Button\Button.vue#L6-L6) 属性将使按钮适合其父宽度。
```vue 

<template>
  <div class="space-y-2">
    <ImButton block>默认按钮</ImButton>
    <ImButton type="primary" block>主要按钮</ImButton>
  </div>
</template>
```
:::

## Props

| 属性名      | 说明      | 类型                                                                           | 默认值         |
|----------|---------|------------------------------------------------------------------------------|-------------|
| type     | 按钮类型    | `'primary' \| 'secondary' \| 'success' \| 'warning' \| 'error' \| 'default'` | `'default'` |
| size     | 按钮尺寸    | `'small' \| 'medium' \| 'large'`                                             | `'medium'`  |
| disabled | 是否禁用    | `boolean`                                                                    | `false`     |
| block    | 是否为块级元素 | `boolean`                                                                    | `false`     |

## Events

| 事件名   | 说明     | 类型                            |
|-------|--------|-------------------------------|
| click | 按钮点击事件 | `(event: MouseEvent) => void` |

## Slots

| 插槽名     | 说明   |
|---------|------|
| default | 按钮内容 |
