// docs/.vitepress/theme/index.ts
// @ts-ignore
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // 注册组件用于文档演示
    // 这里暂时注释掉，等会再配置
  }
}
