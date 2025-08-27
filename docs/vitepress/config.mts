// docs/.vitepress/config.mts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'IM Design',
  description: 'A Vue 3 UI Component Library',

  base: '/',

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/introduction' },
      { text: '组件', link: '/components/button' },
      { text: 'GitHub', link: 'https://github.com/your-username/im-design' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '安装', link: '/guide/installation' },
            { text: '快速开始', link: '/guide/quick-start' }
          ]
        }
      ],
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' }
          ]
        },
        {
          text: '表单组件',
          items: [
            { text: 'Form 表单', link: '/components/form' },
            { text: 'Pagination 分页', link: '/components/pagination' }
          ]
        },
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Carousel 轮播', link: '/components/carousel' },
            { text: 'NoticeBar 通知栏', link: '/components/notice-bar' }
          ]
        },
        {
          text: '反馈组件',
          items: [
            { text: 'Modal 对话框', link: '/components/modal' },
            { text: 'Drawer 抽屉', link: '/components/drawer' },
            { text: 'Notification 通知', link: '/components/notification' },
            { text: 'Loading 加载', link: '/components/loading' }
          ]
        },
        {
          text: '导航组件',
          items: [
            { text: 'Menu 菜单', link: '/components/menu' },
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' }
          ]
        },
        {
          text: '业务组件',
          items: [
            { text: 'AvatarUpload 头像上传', link: '/components/avatar-upload' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-username/im-design' }
    ]
  }
})
