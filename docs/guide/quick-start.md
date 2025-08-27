# 快速开始

本节将介绍如何在项目中使用 IM Design 组件。

## 创建 Vue 项目

如果你还没有 Vue 项目，可以使用 Vite 快速创建一个：

```bash
    npm create vite@latest my-project --template vue-ts
    cd my-project
    npm install
```

## 安装 IM Design

```bash 
    npm install im-design
```

## 完整引入

```ts 
// main.ts import { createApp } from 'vue' import App from './App.vue' import IMDesign from 'im-design' import 'im-design/style.css'
    import {createApp} from 'vue'
    import App from './App.vue'
    import IMDesign from 'im-design'
    import 'im-design/style.css'
    
    const app = createApp(App)
    app.use(IMDesign)
    app.mount('#app')
```

## 使用组件

在你的组件中使用 IM Design 组件：

```vue

<template>
  <div class="p-4"><h1>IM Design 演示</h1>
    <div class="mb-4">
      <ImButton type="primary" @click="handleClick">点击我</ImButton>
    </div>

    <div class="mb-4">
      <ImInput v-model="inputValue" placeholder="请输入内容"/>
    </div>

    <div class="mb-4">
      <ImButton type="success">成功按钮</ImButton>
      <ImButton type="warning">警告按钮</ImButton>
      <ImButton type="error">错误按钮</ImButton>
    </div>
  </div>
</template>
<script setup lang="ts"> import {ref} from 'vue'

const inputValue = ref('')
const handleClick = () => {
  alert('按钮被点击了！')
} </script>
```
## 按需引入

```vue

<template>
  <div>
    <Button type="primary">按钮</Button>
    <Input v-model="value"/></div>
</template>
<script setup lang="ts"> import {Button, Input} from 'im-design'
import {ref} from 'vue'

const value = ref('') </script>
```

## 运行项目

```bash 
    npm run dev
```

现在你应该能看到一个包含 IM Design 组件的页面了！
