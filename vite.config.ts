import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  base: '/4star/',
  publicDir: '网页配置文件',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api-bili': {
        target: 'https://api.bilibili.com',
        changeOrigin: true,
        headers: {
          referer: 'https://www.bilibili.com'
        },
        rewrite: (path) => path.replace(/^\/api-bili/, '')
      },
      '/html-bili': {
        target: 'https://r.jina.ai',
        changeOrigin: true,
        headers: {
          referer: 'https://www.bilibili.com'
        },
        rewrite: (path) => path.replace(/^\/html-bili/, '')
      },
      '/img-bili': {
        target: 'https://i0.hdslb.com',
        changeOrigin: true,
        headers: {
          referer: 'https://www.bilibili.com',
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36'
        },
        rewrite: (path) => path.replace(/^\/img-bili/, '')
      }
    }
  }
})