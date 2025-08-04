---
title: '使用闭包特性创建一个用于请求的函数'
published: 2025-08-04
draft: false
description: '这是一个用于解决请求竞态的函数，其中利用闭包特性，单例模式'
author: 'ChenHaoJie9527'
tags: ['javascript', 'typescript']
---

在前端开发中，我们经常会遇到请求竞态（Race Condition）的问题。当用户快速连续触发多个相同的请求时，可能会导致数据不一致或者显示错误的结果。本文将介绍一种利用闭包特性创建的 `createSimpleRequest` 函数，它能有效解决这个问题。

## 函数实现

```typescript
function createSimpleRequest() {
    let latestRequestId = 0;

    const handler = async <T>(
        fn: () => Promise<T>,
        onSuccess?: (data: T) => void
        onError?: (error: any) => void
    ) => {
        const requestId = performance.now();
        latestRequestId = requestId;

        try {
            const result = await fn();
            if(requestId === latestRequestId) {
                onSuccess?.(result)
            }
        } catch (error) {
            if(requestId === latestRequestId) {
                onError?.(error)
            }
        }
    }
    handler.destroy = () => {
        latestRequestId = 0
    }
    return handler;
}

export const simpleRequest = createSimpleRequest();
export {createSimpleRequest}
```

## 1. 使用说明

### 基本用法

```typescript
//创建请求实例
const request = createSimpleRequest()

//使用函数
const fetchUserData = async () => {
  const response = await fetch('/api/user')
  return response.json()
}

const handleSuccess = (data) => {
  console.log('用户数据 =>', data)
}

// 发起请求
request(fetchUserData, handleSuccess)
```

### 在React组件中使用

```typescript
import { useState, useEffect } from 'react'
import { simpleRequest } from './createSimpleRequest'

function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(`/api/users/${userId}`)
      return response.json()
    }

    setLoading(true)
    simpleRequest(fetchUser, (data) => {
      setUser(data)
      setLoading(false)
    })
  }, [userId])

  if(loading) return <div>loading...</div>
  if(!user) return <div>用户不存在</div>

  return <div>
    <h1>{user.name}</h1>
    <p>{user.email}</p>
  </div>
}
```

### 销毁实例

```typescript
const request = createSimpleRequest()

// 当不再需要时，可以销毁实例
request.destroy()
```

## 2. 应用场景

### 搜索功能防抖

```typescript
import { useState } from 'react';
import { simpleRequest } from './createSimpleRequest';

function SearchComponent() {
  const [results, setResults] = useState([]);

  const handleSearch = (query) => {
    const searchAPI = async () => {
      const response = await fetch(`/api/search?q=${query}`);
      return response.json();
    };

    // ✅ 使用全局单例，避免组件重新渲染时创建新实例
    simpleRequest(searchAPI, (data) => {
      setResults(data.results);
    });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 表单提交防重复

```typescript
import { useState, useMemo } from 'react';
import { createSimpleRequest } from './createSimpleRequest';

function SubmitForm() {
  const [submitting, setSubmitting] = useState(false);

  // ✅ 使用 useMemo 确保实例只创建一次，避免重新渲染时重复创建
  const submitRequest = useMemo(() => createSimpleRequest(), []);

  const handleSubmit = async (formData) => {
    const submitAPI = async () => {
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    };

    setSubmitting(true);
    submitRequest(submitAPI, (result) => {
      console.log('提交成功:', result);
      setSubmitting(false);
    });
  };

  return (
    <button
      onClick={() => handleSubmit(data)}
      disabled={submitting}
    >
      {submitting ? '提交中...' : '提交'}
    </button>
  );
}
```

### 数据刷新控制

```typescript
import { useState, useRef, useEffect } from 'react';
import { createSimpleRequest } from './createSimpleRequest';

function DataTable() {
  const [data, setData] = useState([]);

  // ✅ 使用 useRef 确保实例在组件生命周期内保持不变
  const refreshRequestRef = useRef(null);

  if (!refreshRequestRef.current) {
    refreshRequestRef.current = createSimpleRequest();
  }

  const refreshData = () => {
    const fetchData = async () => {
      const response = await fetch('/api/data');
      return response.json();
    };

    refreshRequestRef.current(fetchData, (newData) => {
      setData(newData);
    });
  };

  // 组件卸载时清理实例
  useEffect(() => {
    return () => {
      if (refreshRequestRef.current) {
        refreshRequestRef.current.destroy();
      }
    };
  }, []);

  // 用户可以快速点击刷新按钮，但只有最后一次请求的结果会被处理
  return (
    <div>
      <button onClick={refreshData}>刷新数据</button>
      <table>
        {/* 表格内容 */}
      </table>
    </div>
  );
}
```

### 将这个函数封装成自定义Hook

```typescript
import { useRef, useEffect } from 'react'
import { createSimpleRequest } from '../createSimpleRequest'

export function useSimpleRequest() {
  const requestRef = useRef(null)

  if (!current.current) {
    requestRef.current = createSimpleRequest()
  }

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        requestRef.current.destroy()
      }
    }
  }, [])

  return requestRef.current;
}

// 在组件中使用自定义hook
function SearchComponent() {
  const [results, setResults] = useState([]);
  const searchRequest = useSimpleRequest(); // ✅ 使用自定义Hook

  const handleSearch = (query) => {
    const searchAPI = async () => {
      const response = await fetch(`/api/search?q=${query}`);
      return response.json();
    };

    searchRequest(searchAPI, (data) => {
      setResults(data.results);
    });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="搜索..."
      />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 3. 利用的知识点

### 闭包 (closure)

函数 `createSimpleRequest` 返回的 `handler` 函数能够访问外部作用域中的 `latestRequestId` 变量，这就是闭包的典型应用：

```typescript
function createSimpleRequest() {
  let latestRequestId = 0; // 这个变量被内部函数访问

  const handler = async <T>(...) => {
    // 这里可以访问和修改 latestRequestId
    latestRequestId = requestId;
  };

  return handler; // 返回的函数仍然可以访问 latestRequestId
}
```

### 单例模式（Singleton Pattern）

通过 `export const simpleRequest = createSimpleRequest();` 导出一个全局实例，确保整个应用中使用同一个请求处理器：

```typescript
// 全局单例
export const simpleRequest = createSimpleRequest()

// 在应用的任何地方都可以使用同一个实例
simpleRequest(fetchData, handleSuccess)
```

### 泛型（Generics）

函数使用Typescript泛型来保证类型安全

```typescript
const handler = async <T>(fn: () => Promise<T>, onSuccess: (data: T) => void) => {
  // T 类型会在编译时被推断
  const result = await fn() // result 的类型是 T
  onSuccess(result) // 传递给 onSuccess 的参数类型也是 T
}
```

### 高阶函数（Higher-Order Function）

`createSimpleRequest` 是一个高阶函数，它返回另一个函数：

```typescript
// createSimpleRequest 是高阶函数
const request = createSimpleRequest() // 返回 handler 函数

// handler 函数可以接收其他函数作为参数
request(fetchData, handleSuccess)
```

### 函数式编程概念

- **纯函数**：`createSimpleRequest` 每次调用都返回新的实例
- **不可变性**：通过比较 `requestId` 来确保只处理最新的请求
- **副作用隔离**：通过闭包将状态封装在函数内部

### 性能优化

使用 `performance.now()` 生成唯一的时间戳作为请求ID，比递增计数器更精确：

```typescript
const requestId = performance.now() // 高精度时间戳
```

## React组件中的最佳实践

在React组件中使用 `createSimpleRequest` 时，需要注意以下几点：

1. **全局单例优先**：对于大多数场景，直接使用 `simpleRequest` 全局实例是最佳选择
2. **组件级实例**：如果需要在组件级别管理实例，使用 `useMemo` 或 `useRef`
3. **自定义Hook**：对于复杂场景，可以封装成自定义Hook
4. **清理资源**：在组件卸载时记得调用 `destroy()` 方法

## 总结

`createSimpleRequest` 函数巧妙地结合了闭包、单例模式、泛型等JavaScript/TypeScript的核心概念，提供了一个简洁而强大的解决方案来处理请求竞态问题。它不仅解决了实际问题，还展示了现代JavaScript开发中的最佳实践。

这个函数的设计思路可以应用到其他类似的场景中，比如事件处理、动画控制等需要"只处理最新请求"的场景。在React应用中，合理使用单例模式和适当的实例管理策略，可以充分发挥这个函数的优势。
