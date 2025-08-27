# 安装

## 环境支持

需要 Node.js 版本 14.18+ 或 16+。

## 使用包管理器

在你的项目中执行以下命令来安装 IM Design：

::: code-group

```bash 
  [npm] npm install im-design
```

```bash 
  [yarn] yarn add im-design
```

```bash 
  [pnpm] pnpm add im-design
```

:::

## 完整引入

```ts 
    // main.ts import { createApp } from 'vue' import App from './App.vue' import IMDesign from 'im-design' import 'im-design/style.css'
const app = createApp(App)
app.use(IMDesign)
app.mount('#app')
```

## 按需引入

### 手动引入

```ts 
    // main.ts import { createApp } from 'vue' import App from './App.vue' import { Button, Input } from 'im-design' import 'im-design/style.css'
const app = createApp(App)
app.component('ImButton', Button)
app.component('ImInput', Input)
app.mount('#app')
```

### 自动引入（推荐）

安装 `unplugin-vue-components` 和 `unplugin-auto-import`：

```bash 
    npm install -D unplugin-vue-components unplugin-auto-import
```

然后在 [vite.config.ts](file://D:\code\github\im-desgin\vite.config.ts) 中配置：

```ts
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {IMDesignResolver} from 'im-design/resolver'

export default defineConfig({
    plugins: [
        vue(),
        Components({
            resolvers: [
                IMDesignResolver()
            ]
        })
    ]
})
```

## 样式引入

IM Design 使用 Tailwind CSS 作为样式系统，你需要在项目中配置 Tailwind CSS：

```bash
  npm install -D tailwindcss postcss autoprefixer npx tailwindcss init -p
```

```js
 /**
 * @type {import('tailwindcss').Config}
 */
export default {
    content: [
        "./index.html", "./src/**/.{vue,js,ts,jsx,tsx}", "./node_modules/im-design/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {extend: {},},
    plugins: [],
}
```

配置 `postcss.config.js`：

```js
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}

```

在你的 CSS 入口文件中引入 Tailwind：

```css 
@tailwind base;
@tailwind components;
@tailwind utilities;
```
