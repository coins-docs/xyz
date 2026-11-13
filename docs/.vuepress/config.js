import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'

const BASE = '/'

export default defineUserConfig({
  lang: 'en-US',
  base: BASE,

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: `${BASE}coins-favicon.png` }]
  ],

  title: 'Coins.xyz API Documentation',
  description: 'Complete API documentation for Coins.xyz',

  // Markdown 配置：提取所有级别的标题，供左侧自动目录使用
  markdown: {
    headers: {
      level: [1, 2, 3, 4, 5, 6],
    },
  },

  theme: defaultTheme({
    logo: 'https://static.pro.coins.xyz/static_web/static_pro/images/logo_icon_light.svg',

    navbar: [
      { text: 'Rest API', link: '/rest-api' },
      { text: 'Web Socket Streams', link: '/web-socket-streams' },
      { text: 'User Data Stream', link: '/user-data-stream' },
      { text: 'Errors', link: '/errors' }
    ],

    sidebar: [
      {
        text: 'API Documentation',
        children: [
          '/rest-api',
          '/web-socket-streams',
          '/user-data-stream',
          '/errors'
        ]
      }
    ],

    // 不显示 "编辑此页"
    editLink: false,

    // 显示最后更新时间
    lastUpdated: true,

    // 不显示贡献者
    contributors: false,

    // 自定义容器文案
    tip: 'TIP',
    warning: 'WARNING',
    danger: 'DANGER',
  }),

  bundler: viteBundler(),
})
