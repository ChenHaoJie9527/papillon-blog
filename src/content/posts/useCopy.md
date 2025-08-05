---
title: '一个可以复制文本到粘贴板的hook'
published: 2025-08-05
draft: false
description: '这是一个零依赖，高兼容，轻量化的复制粘贴解决方案'
author: 'ChenHaoJie9527'
tags: ['hooks']
---

在前端开发中，通常会有一些Copy的按钮，需要支持复制粘贴的功能。现代浏览器复制粘贴的核心是`navigator.clipboard.writeText(value)`，一些老旧浏览器可能没办法使用这个API，但是可以使用`document.execCommand("copy")`解决方案。

## 函数实现

```typescript
function useCopy() {
  const [copied, setCopied] = useState(null)
  const copyHandle = useCallback(() => {
    try {
      // 优先使用现代 Clipboard API
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        setCopied(value)
      } else {
        throw new Error('writeText not supported')
      }
    } catch (error) {
      oldSchoolCopy(value)
      setCopied(value)
    }
  }, [])
  const resetHandle = useCallback(() => {
    setCoped(null)
  }, [])

  return {
    copied,
    copyHandle,
    resetHandle,
  }
}

// 传统复制方案
function oldSchoolCopy(text) {
  try {
    const tempTextArea = document.createElement('textarea')
    tempTextArea.value = text
    tempTextArea.style.position = 'fixed'
    tempTextArea.style.left = '-999999px'
    tempTextArea.style.top = '-999999px'
    document.body.appendChild(tempTextArea)
    tempTextArea.focus()
    tempTextArea.select()
    document.execCommand('copy')
    document.body.removeChild(tempTextArea)
  } catch (error) {
    console.error('Old school copy failed:', error)
  }
}
```

## 使用示例

### 基础用法

```tsx
import React from 'react'
import { useCopy } from './useCopy'

function CopyButton() {
  const { copied, copyHandle, resetHandle } = useCopy()

  const handleCopy = async () => {
    const success = await copyHandle('Hello, World!')
    if (success) {
      console.log('复制成功!')
    } else {
      console.log('复制失败!')
    }
  }

  return (
    <div>
      <button onClick={handleCopy}>{copied ? '已复制!' : '复制文本'}</button>
      {copied && <button onClick={resetHandle}>重置</button>}
    </div>
  )
}
```

### 复制代码块

```tsx
function CopyCodeBlock() {
  const { copied, copyHandle } = useCopy()
  const code = `function hello() {
  console.log('Hello, World!')
}`

  return (
    <div className="relative">
      <pre className="bg-gray-100 p-4 rounded">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => copyHandle(code)}
        className="absolute top-2 right-2 px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
      >
        {copied ? '✓' : '复制'}
      </button>
    </div>
  )
}
```

### 带反馈的复制按钮

```tsx
function CopyWithFeedback() {
  const { copied, copy } = useCopy()
  const [isLoading, setIsLoading] = useState(false)

  const handleCopy = async (text: string) => {
    setIsLoading(true)
    try {
      const success = await copy(text)
      if (success) {
        // 显示成功提示
        setTimeout(() => {
          // 可以在这里添加 toast 通知
        }, 100)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={() => handleCopy('要复制的文本')}
      disabled={isLoading}
      className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
    >
      {isLoading ? '复制中...' : copied ? '已复制!' : '复制'}
    </button>
  )
}
```

## 兼容性分析

### 现代浏览器支持

| 浏览器  | Clipboard API 支持 | 最低版本 |
| ------- | ------------------ | -------- |
| Chrome  | ✅ 支持            | 66+      |
| Firefox | ✅ 支持            | 63+      |
| Safari  | ✅ 支持            | 13.1+    |
| Edge    | ✅ 支持            | 79+      |
| Opera   | ✅ 支持            | 53+      |

### 传统方法兼容性

`document.execCommand('copy')` 方法在以下浏览器中支持：

| 浏览器  | 支持版本 |
| ------- | -------- |
| Chrome  | 43+      |
| Firefox | 41+      |
| Safari  | 9+       |
| IE      | 10+      |
| Edge    | 12+      |

### 降级策略

采用了优雅降级的策略：

1. **优先使用现代 API**：首先尝试使用 `navigator.clipboard.writeText()`
2. **降级到传统方法**：如果不支持，则使用 `document.execCommand('copy')`
3. **错误处理**：两种方法都失败时，返回 `false` 并记录错误

### 安全考虑

- **HTTPS 要求**：现代 Clipboard API 只在 HTTPS 环境下工作
- **用户交互**：某些浏览器要求复制操作必须由用户交互触发
- **权限**：某些浏览器可能需要用户授权剪贴板访问权限
