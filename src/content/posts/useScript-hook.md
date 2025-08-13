---
title: 'useScript: 一个优雅的 React 动态脚本加载 Hook'
published: 2025-08-11
draft: false
description: '深入探讨 useScript 自定义 Hook 的实现原理和使用场景，简化 React 中的动态脚本加载管理。'
tags: ['react', 'typescript', 'hooks']
---

在 React 开发中，我们经常需要动态加载外部 JavaScript 脚本，比如第三方库、分析工具、支付系统等。传统的脚本加载方式往往需要手动管理 DOM 操作、事件监听和清理逻辑。今天，我们将深入探讨一个自定义 Hook —— `useScript`，它能够优雅地处理动态脚本加载的完整生命周期。

## 为什么需要 useScript？

在 React 中，当我们使用传统的脚本加载方式时，会遇到以下问题：

```typescript
// 传统方式加载脚本
const loadScript = (src: string) => {
  const script = document.createElement('script')
  script.src = src
  script.async = true
  document.body.appendChild(script)

  // 需要手动处理加载状态
  script.onload = () => {
    console.log('Script loaded')
  }

  script.onerror = () => {
    console.error('Script failed to load')
  }
}

// 在组件中使用
useEffect(() => {
  loadScript('https://example.com/script.js')
}, [])
```

这种方式存在以下问题：

1. **状态管理复杂**: 需要手动管理加载状态（loading、ready、error）
2. **重复加载**: 没有检测脚本是否已经存在
3. **内存泄漏**: 组件卸载时没有正确清理事件监听器
4. **类型安全**: 缺乏 TypeScript 类型支持
5. **代码重复**: 每次使用都需要重复相同的逻辑

`useScript` 就是为了解决这些问题而生的。

## useScript 的实现原理

让我们来看看 `useScript` 的核心实现：

```typescript
import { useEffect, useRef, useState } from 'react'

type Options = {
  removeOnUnmount: boolean
}

export default function useScript(src: string, options: Options) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unknown'>(
    'loading',
  )
  const optionRef = useRef(options)

  useEffect(() => {
    // 检查是否已经加载了脚本
    let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`)

    // 检查脚本状态
    const domStatus = script?.getAttribute('data-status')

    // 如果脚本已经加载，则设置状态
    if (domStatus) {
      setStatus(domStatus as 'loading' | 'ready' | 'error' | 'unknown')
      return
    }

    if (script === null) {
      script = document.createElement('script')
      script.src = src
      script.async = true
      script.setAttribute('data-status', 'loading')

      document.body.appendChild(script)

      const handleScriptLoad = () => {
        script?.setAttribute('data-status', 'ready')
        setStatus('ready')
        removeEventListeners()
      }

      const handleScriptError = () => {
        script?.setAttribute('data-status', 'error')
        setStatus('error')
        removeEventListeners()
      }

      const removeEventListeners = () => {
        script?.removeEventListener('load', handleScriptLoad)
        script?.removeEventListener('error', handleScriptError)
      }

      script.addEventListener('load', handleScriptLoad)
      script.addEventListener('error', handleScriptError)

      const removeOnUnmount = optionRef.current.removeOnUnmount

      return () => {
        if (removeOnUnmount) {
          // 移除脚本
          script?.remove()
          removeEventListeners()
        }
      }
    } else {
      setStatus('unknown')
    }
  }, [src])

  return status
}
```

### 关键特性分析

1. **智能检测**: 使用 `document.querySelector` 检查脚本是否已经存在
2. **状态持久化**: 通过 `data-status` 属性在 DOM 中保存脚本状态
3. **事件管理**: 自动处理 `load` 和 `error` 事件
4. **内存管理**: 支持在组件卸载时自动清理脚本和事件监听器
5. **类型安全**: 完整的 TypeScript 类型支持

## 核心功能详解

### 1. 脚本检测机制

```typescript
// 检查是否已经加载了脚本
let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`)

// 检查脚本状态
const domStatus = script?.getAttribute('data-status')

// 如果脚本已经加载，则设置状态
if (domStatus) {
  setStatus(domStatus as 'loading' | 'ready' | 'error' | 'unknown')
  return
}
```

这个机制确保：

- 避免重复加载相同的脚本
- 快速恢复已加载脚本的状态
- 支持页面刷新后的状态恢复

### 2. 动态脚本创建

```typescript
if (script === null) {
  script = document.createElement('script')
  script.src = src
  script.async = true
  script.setAttribute('data-status', 'loading')

  document.body.appendChild(script)
}
```

创建新脚本时：

- 设置为异步加载，不阻塞页面渲染
- 标记初始状态为 `loading`
- 添加到 `document.body` 中

### 3. 事件监听管理

```typescript
const handleScriptLoad = () => {
  script?.setAttribute('data-status', 'ready')
  setStatus('ready')
  removeEventListeners()
}

const handleScriptError = () => {
  script?.setAttribute('data-status', 'error')
  setStatus('error')
  removeEventListeners()
}

const removeEventListeners = () => {
  script?.removeEventListener('load', handleScriptLoad)
  script?.removeEventListener('error', handleScriptError)
}
```

事件处理确保：

- 加载成功时更新状态为 `ready`
- 加载失败时更新状态为 `error`
- 自动清理事件监听器，避免内存泄漏

### 4. 清理机制

```typescript
return () => {
  if (removeOnUnmount) {
    // 移除脚本
    script?.remove()
    removeEventListeners()
  }
}
```

清理逻辑支持：

- 根据 `options.removeOnUnmount` 决定是否移除脚本
- 自动清理事件监听器
- 防止内存泄漏

## 使用示例

### 基本用法

```typescript
import useScript from './hooks/useScript'

function GoogleAnalytics() {
  const status = useScript('https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID', {
    removeOnUnmount: false
  })

  if (status === 'loading') {
    return <div>Loading Google Analytics...</div>
  }

  if (status === 'error') {
    return <div>Failed to load Google Analytics</div>
  }

  if (status === 'ready') {
    return <div>Google Analytics loaded successfully!</div>
  }

  return null
}
```

### 条件加载

```typescript
function PaymentForm({ paymentMethod }: { paymentMethod: 'stripe' | 'paypal' }) {
  const stripeStatus = useScript(
    'https://js.stripe.com/v3/',
    { removeOnUnmount: true }
  )

  const paypalStatus = useScript(
    'https://www.paypal.com/sdk/js',
    { removeOnUnmount: true }
  )

  if (paymentMethod === 'stripe' && stripeStatus === 'ready') {
    return <StripePaymentForm />
  }

  if (paymentMethod === 'paypal' && paypalStatus === 'ready') {
    return <PayPalPaymentForm />
  }

  return <div>Loading payment form...</div>
}
```

### 动态加载第三方库

```typescript
function ChartComponent({ chartType }: { chartType: 'chartjs' | 'd3' }) {
  const chartjsStatus = useScript(
    'https://cdn.jsdelivr.net/npm/chart.js',
    { removeOnUnmount: true }
  )

  const d3Status = useScript(
    'https://d3js.org/d3.v7.min.js',
    { removeOnUnmount: true }
  )

  useEffect(() => {
    if (chartType === 'chartjs' && chartjsStatus === 'ready') {
      // 初始化 Chart.js
      const ctx = document.getElementById('chart') as HTMLCanvasElement
      new Chart(ctx, {
        // 图表配置
      })
    }
  }, [chartType, chartjsStatus])

  return <canvas id="chart" />
}
```

## 高级用法

### 1. 批量脚本加载

```typescript
function useMultipleScripts(sources: string[]) {
  const statuses = sources.map(src =>
    useScript(src, { removeOnUnmount: true })
  )

  const allReady = statuses.every(status => status === 'ready')
  const hasError = statuses.some(status => status === 'error')

  return {
    statuses,
    allReady,
    hasError,
    isLoading: statuses.some(status => status === 'loading')
  }
}

// 使用示例
function AdvancedComponent() {
  const { allReady, hasError, isLoading } = useMultipleScripts([
    'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js',
    'https://cdn.jsdelivr.net/npm/moment@2.29.4/moment.min.js',
    'https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js'
  ])

  if (isLoading) return <div>Loading libraries...</div>
  if (hasError) return <div>Failed to load some libraries</div>
  if (allReady) return <div>All libraries loaded!</div>

  return null
}
```

### 2. 脚本加载超时处理

```typescript
function useScriptWithTimeout(src: string, timeout: number = 10000) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'timeout'>(
    'loading',
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('timeout')
    }, timeout)

    return () => clearTimeout(timer)
  }, [timeout])

  const scriptStatus = useScript(src, { removeOnUnmount: true })

  useEffect(() => {
    if (scriptStatus === 'ready') {
      setStatus('ready')
    } else if (scriptStatus === 'error') {
      setStatus('error')
    }
  }, [scriptStatus])

  return status
}
```

### 3. 脚本加载重试机制

```typescript
function useScriptWithRetry(src: string, maxRetries: number = 3) {
  const [retryCount, setRetryCount] = useState(0)
  const [key, setKey] = useState(0)

  const status = useScript(`${src}?v=${key}`, { removeOnUnmount: true })

  const retry = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1)
      setKey((prev) => prev + 1)
    }
  }, [retryCount, maxRetries])

  useEffect(() => {
    if (status === 'error' && retryCount < maxRetries) {
      const timer = setTimeout(retry, 1000 * Math.pow(2, retryCount)) // 指数退避
      return () => clearTimeout(timer)
    }
  }, [status, retryCount, retry, maxRetries])

  return { status, retryCount, retry, canRetry: retryCount < maxRetries }
}
```

## 最佳实践

### 1. 选择合适的 removeOnUnmount 选项

```typescript
// 对于全局库，通常设置为 false
const analyticsStatus = useScript('https://analytics.js', { removeOnUnmount: false })

// 对于特定功能的库，通常设置为 true
const chartStatus = useScript('https://chart.js', { removeOnUnmount: true })
```

### 2. 错误处理和用户反馈

```typescript
function ScriptLoader({ src, children }: { src: string, children: React.ReactNode }) {
  const status = useScript(src, { removeOnUnmount: false })

  switch (status) {
    case 'loading':
      return <div className="loading-spinner">Loading...</div>
    case 'error':
      return (
        <div className="error-message">
          <p>Failed to load required script</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )
    case 'ready':
      return <>{children}</>
    default:
      return <div>Unknown status</div>
  }
}
```

### 3. 性能优化

```typescript
// 使用 React.memo 避免不必要的重新渲染
const ScriptStatus = React.memo(({ src }: { src: string }) => {
  const status = useScript(src, { removeOnUnmount: true })
  return <span className={`status-${status}`}>{status}</span>
})

// 延迟加载非关键脚本
function LazyScriptLoader({ src, delay = 2000 }: { src: string, delay?: number }) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShouldLoad(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  const status = useScript(shouldLoad ? src : '', { removeOnUnmount: true })

  return shouldLoad ? <div>Script status: {status}</div> : null
}
```

## 常见问题与解决方案

### 1. 脚本加载顺序问题

```typescript
// 确保依赖脚本按顺序加载
function useOrderedScripts(scripts: string[]) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [statuses, setStatuses] = useState<Record<string, string>>({})

  const currentScript = scripts[currentIndex]
  const currentStatus = useScript(currentScript, { removeOnUnmount: true })

  useEffect(() => {
    if (currentStatus === 'ready' && currentIndex < scripts.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentStatus, currentIndex, scripts.length])

  useEffect(() => {
    setStatuses((prev) => ({ ...prev, [currentScript]: currentStatus }))
  }, [currentScript, currentStatus])

  return { statuses, currentIndex, allReady: currentIndex === scripts.length - 1 }
}
```

### 2. 跨域脚本加载

```typescript
// 处理跨域脚本加载
function useCrossOriginScript(src: string, options: Options & { crossorigin?: string }) {
  const status = useScript(src, options)

  useEffect(() => {
    const script = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement
    if (script && options.crossorigin) {
      script.crossOrigin = options.crossorigin
    }
  }, [src, options.crossorigin])

  return status
}
```

### 3. 脚本加载状态同步

```typescript
// 在多个组件间同步脚本状态
function useSharedScript(src: string, options: Options) {
  const status = useScript(src, options)

  // 使用 Context 或状态管理库共享状态
  useEffect(() => {
    // 更新全局状态
    window.__scriptStatuses = window.__scriptStatuses || {}
    window.__scriptStatuses[src] = status
  }, [src, status])

  return status
}
```

## 总结

`useScript` 是一个功能强大且设计优雅的 React Hook，它解决了动态脚本加载中的常见问题：

### 主要优势

1. **简化开发**: 将复杂的脚本加载逻辑封装在一个 Hook 中
2. **状态管理**: 提供完整的加载状态反馈
3. **内存安全**: 自动处理事件监听器的清理
4. **类型安全**: 完整的 TypeScript 支持
5. **性能优化**: 避免重复加载和内存泄漏

### 适用场景

- 第三方库的动态加载
- 分析工具的按需加载
- 支付系统的条件加载
- 图表库的延迟加载
- 国际化资源的动态加载

### 扩展方向

- 支持 CSS 文件的动态加载
- 添加加载进度指示器
- 实现脚本预加载策略
- 支持 Service Worker 缓存
- 添加脚本版本管理

通过合理使用 `useScript`，我们可以构建更加灵活、高效的 React 应用，为用户提供更好的体验。

---

_本文介绍了 `useScript` Hook 的完整实现和使用方法。如果你有任何问题或建议，欢迎在评论区讨论！_
