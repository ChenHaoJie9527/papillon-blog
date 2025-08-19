---
title: 'Service Worker 框架无关的缓存与激活机制'
published: 2025-08-19
draft: false
description: 'Service Worker 作为 Web 标准技术，可以在任何框架中使用。本文展示在 Vue、React、Angular 等不同框架中的实现方式。'
tags: ['service-worker', 'pwa']
---

Service Worker 是 Web 标准技术，完全独立于任何前端框架。它可以在 Vue、React、Angular 或原生 JavaScript 应用中工作。本文将展示在不同框架中如何实现相同的 Service Worker 功能。

## Service Worker 的框架无关性

Service Worker 是浏览器原生 API，不依赖于任何框架：

```javascript
// 在任何框架中都可以使用相同的注册代码
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then((registration) => console.log('SW registered'))
    .catch((error) => console.log('SW registration failed'))
}
```

## 不同框架中的实现

### 1. Vue 应用中的实现

```javascript
// main.js (Vue 3)
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

```javascript
// 在 Vue 组件中使用
export default {
  mounted() {
    this.checkForUpdates()
  },
  methods: {
    checkForUpdates() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.addEventListener('updatefound', () => {
              // 处理更新
            })
          }
        })
      }
    },
  },
}
```

### 2. React 应用中的实现

```javascript
// index.js (React)
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

```javascript
// React Hook 示例
import { useEffect } from 'react'

function useServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // 显示更新提示
                if (confirm('新版本可用，是否刷新？')) {
                  window.location.reload()
                }
              }
            })
          })
        }
      })
    }
  }, [])
}

// 在组件中使用
function App() {
  useServiceWorker()

  return <div>Your app content</div>
}
```

### 3. Angular 应用中的实现

```typescript
// main.ts (Angular)
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'

platformBrowserDynamic().bootstrapModule(AppModule)

// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
  })
}
```

```typescript
// Angular Service
import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class ServiceWorkerService {
  checkForUpdates() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            // 处理更新逻辑
          })
        }
      })
    }
  }
}
```

### 4. 原生 JavaScript 应用

```javascript
// 原生 JavaScript 实现
class ServiceWorkerManager {
  constructor() {
    this.init()
  }

  async init() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        this.setupUpdateListener(registration)
      } catch (error) {
        console.error('SW registration failed:', error)
      }
    }
  }

  setupUpdateListener(registration) {
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          this.showUpdateNotification()
        }
      })
    })
  }

  showUpdateNotification() {
    if (confirm('新版本可用，是否刷新页面？')) {
      window.location.reload()
    }
  }
}

// 使用
new ServiceWorkerManager()
```

## 通用的 Service Worker 文件

无论使用什么框架，Service Worker 文件本身都是相同的：

```javascript
// public/sw.js - 适用于所有框架
const CACHE_NAME = 'app-cache-v1'
const STATIC_CACHE = 'static-v1'
const DYNAMIC_CACHE = 'dynamic-v1'

// 安装阶段
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/static/js/bundle.js',
        '/static/css/main.css',
      ])
    }),
  )
})

// 激活阶段
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE].includes(cacheName)) {
              return caches.delete(cacheName)
            }
          }),
        )
      }),
    ]),
  )
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  const { request } = event

  // API 请求 - 网络优先
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone()
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, responseClone))
          return response
        })
        .catch(() => caches.match(request)),
    )
  }

  // 静态资源 - 缓存优先
  else if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(request).then((response) => response || fetch(request)),
    )
  }

  // 其他请求 - 网络优先
  else {
    event.respondWith(fetch(request))
  }
})
```

## 框架特定的工具和插件

### Vue CLI PWA 插件

```bash
# Vue 项目
vue add pwa
```

```javascript
// vue.config.js
module.exports = {
  pwa: {
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },
  },
}
```

### Create React App PWA

```bash
# React 项目
npx create-react-app my-app --template cra-template-pwa
```

```javascript
// src/index.js
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

serviceWorkerRegistration.register()
```

### Angular PWA

```bash
# Angular 项目
ng add @angular/pwa
```

```typescript
// app.module.ts
import { ServiceWorkerModule } from '@angular/service-worker'

@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production
    })
  ]
})
```

## 通用最佳实践

### 1. 版本管理

```javascript
// 所有框架通用的版本管理
const APP_VERSION = '1.0.0'
const CACHE_NAME = `app-cache-${APP_VERSION}`

// 在应用代码中检查版本
async function checkAppVersion() {
  const response = await fetch('/version.json')
  const { version } = await response.json()

  if (version !== APP_VERSION) {
    // 提示用户刷新
    showUpdateNotification()
  }
}
```

### 2. 离线处理

```javascript
// 通用的离线页面处理
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/offline.html')
        }
      }),
  )
})
```

### 3. 消息通信

```javascript
// Service Worker 中
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// 应用代码中（适用于所有框架）
function skipWaiting() {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SKIP_WAITING',
    })
  }
}
```

## 调试技巧

### Chrome DevTools

```javascript
// 在所有框架中都可以使用的调试代码
if (process.env.NODE_ENV === 'development') {
  // 开发环境下的调试
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('SW Message:', event.data)
  })
}
```

### 状态检查

```javascript
// 通用的状态检查函数
async function getServiceWorkerStatus() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration()
    if (registration) {
      console.log('SW State:', registration.active?.state)
      console.log('SW Script URL:', registration.active?.scriptURL)
    }
  }
}
```

## 总结

Service Worker 的框架无关性使其成为构建 PWA 的理想选择：

1. **标准化**: 基于 Web 标准，不依赖特定框架
2. **兼容性**: 在所有现代浏览器中工作
3. **灵活性**: 可以与任何前端框架结合使用
4. **工具支持**: 各框架都有相应的工具和插件

无论你使用 Vue、React、Angular 还是原生 JavaScript，Service Worker 的核心概念和实现方式都是相同的。框架只是提供了不同的集成方式和开发体验。
