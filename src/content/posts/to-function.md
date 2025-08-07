---
title: 'Promise Error Handling with the to Function'
published: 2025-08-07
draft: false
description: 'Learn how to handle Promise errors elegantly using the to function pattern.'
tags: ['javascript', 'typescript', 'error-handling', 'promises']
---

When working with Promises in JavaScript/TypeScript, error handling can become verbose and repetitive. The `to` function provides an elegant solution that standardizes error handling and makes your code more readable.

## What is the to Function?

The `to` function is a utility that wraps Promise operations and returns a tuple containing either the result or an error. This pattern is inspired by Go's error handling approach and eliminates the need for try-catch blocks.

```typescript title="to function implementation"
export const to = <T, U = Error & BaseError>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
) => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<
      [U, undefined]
    >((err: U) => [extendError(standardizeError(err), errorExt), undefined])
}
```

## Basic Usage

Instead of using try-catch blocks, you can use the `to` function to handle Promise errors:

```typescript title="Basic usage example"
// Traditional approach
async function fetchUserData(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}

// Using the to function
async function fetchUserDataWithTo(id: string) {
  const [error, data] = await to(fetch(`/api/users/${id}`).then((res) => res.json()))

  if (error) {
    console.error('Failed to fetch user:', error)
    return null
  }

  return data
}
```

## Advanced Examples

### 1. Database Operations

```typescript title="Database operations with to function"
async function createUser(userData: UserData) {
  const [error, user] = await to(db.users.create(userData), {
    operation: 'create_user',
    userId: userData.id,
  })

  if (error) {
    logger.error('User creation failed', error)
    return { success: false, error }
  }

  return { success: true, user }
}
```

### 2. API Calls with Retry Logic

```typescript title="API calls with retry logic"
async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const [error, data] = await to(
      fetch(url).then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      }),
      { attempt: i + 1, maxRetries: retries },
    )

    if (!error) return data

    if (i === retries - 1) throw error
    await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
  }
}
```

### 3. File Operations

```typescript title="File operations example"
import { readFile } from 'fs/promises'

async function readConfigFile(path: string) {
  const [error, content] = await to(readFile(path, 'utf-8'), {
    filePath: path,
    operation: 'read_config',
  })

  if (error) {
    console.error(`Failed to read config file: ${path}`, error)
    return null
  }

  try {
    return JSON.parse(content)
  } catch (parseError) {
    console.error('Failed to parse config file', parseError)
    return null
  }
}
```

## Error Standardization

The `to` function automatically standardizes different types of errors:

```typescript title="Error standardization examples"
// String errors
const [error1] = await to(Promise.reject('Something went wrong'))
// error1 = { message: 'Something went wrong' }

// Number errors
const [error2] = await to(Promise.reject(404))
// error2 = { code: 404, message: 'Error 404' }

// Boolean errors
const [error3] = await to(Promise.reject(false))
// error3 = { success: false, message: 'Failure' }

// Function errors
const [error4] = await to(Promise.reject(() => {}))
// error4 = { message: 'Function error', functionName: '', functionString: '() => {}' }

// Object errors
const [error5] = await to(Promise.reject({ custom: 'error', code: 500 }))
// error5 = { message: 'Object error', custom: 'error', code: 500 }
```

## Benefits of Using the to Function

1. **Consistent Error Handling**: All errors are standardized into a predictable format
2. **No Try-Catch Blocks**: Eliminates verbose try-catch syntax
3. **Type Safety**: Full TypeScript support with proper typing
4. **Error Extension**: Ability to add context to errors
5. **Readable Code**: Makes error handling more explicit and readable

## Common Use Cases

- **API Calls**: Handle HTTP requests and responses
- **Database Operations**: Manage database query errors
- **File Operations**: Handle file system errors
- **Third-party Library Integration**: Wrap external library calls
- **Async Operations**: Any Promise-based operation

## Best Practices

1. **Always Check for Errors**: Always destructure the result and check for errors
2. **Add Context**: Use the `errorExt` parameter to add relevant context
3. **Log Errors**: Implement proper logging for debugging
4. **Handle Gracefully**: Provide fallback values or user-friendly error messages
5. **Type Your Errors**: Define proper error types for better type safety

```typescript title="Best practices example"
interface ApiError extends Error {
  statusCode?: number
  endpoint?: string
}

async function fetchUserProfile(userId: string) {
  const [error, user] = await to<User, ApiError>(
    fetch(`/api/users/${userId}`).then((res) => res.json()),
    { endpoint: `/api/users/${userId}`, userId },
  )

  if (error) {
    // Log with context
    logger.error('Failed to fetch user profile', {
      userId,
      endpoint: error.endpoint,
      message: error.message,
    })

    // Return fallback or throw
    return null
  }

  return user
}
```

The `to` function is a powerful utility that can significantly improve your Promise error handling experience. By standardizing error formats and eliminating try-catch boilerplate, it makes your code more maintainable and easier to debug.

## source code implementation

```typescript
const errorStrategies = {
  string: (value: string) => ({ message: value }),
  number: (value: number) => ({ code: value, message: `Error ${value}` }),
  boolean: (value: boolean) => ({
    success: value,
    message: value ? 'Success' : 'Failure',
  }),
  function: (value: Function) => ({
    message: 'Function error',
    functionName: value.name,
    functionString: value.toString(),
  }),
  object: (value: object) => ({
    message: 'Object error',
    ...value,
  }),
  default: (value: unknown) => ({
    message: String(value),
    originalValue: value,
  }),
}

const typeGuards = {
  isEmpty: (value: unknown): value is undefined | null | '' =>
    value === undefined || value === null || value === '',
  isError: (value: unknown): value is Error => value instanceof Error,
  isObject: (value: unknown): value is object =>
    typeof value === 'object' && value !== null,
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number',
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isFunction: (value: unknown): value is Function => typeof value === 'function',
} as const

const standardizeError = <U>(err: U): U => {
  const toErrorObject = (error: Error) => ({
    message: error.message,
    name: error.name,
    stack: error.stack,
  })

  // 使用策略模式处理不同类型的错误
  const processError = (value: unknown): Record<string, unknown> => {
    if (typeGuards.isString(value)) return errorStrategies.string(value)
    if (typeGuards.isNumber(value)) return errorStrategies.number(value)
    if (typeGuards.isBoolean(value)) return errorStrategies.boolean(value)
    if (typeGuards.isFunction(value)) return errorStrategies.function(value)
    if (typeGuards.isObject(value)) return errorStrategies.object(value)
    return errorStrategies.default(value)
  }

  return (
    typeGuards.isEmpty(err)
      ? toErrorObject(new Error('Empty error'))
      : typeGuards.isError(err)
        ? toErrorObject(err)
        : processError(err)
  ) as U
}

type BaseError = {
  [key: string]: unknown
}

// 合并错误扩展
const extendError = <U>(err: U, errorExt?: Record<string, unknown>): U =>
  errorExt ? ({ ...err, ...errorExt } as U) : err

export const to = <T, U = Error & BaseError>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
) => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<
      [U, undefined]
    >((err: U) => [extendError(standardizeError(err), errorExt), undefined])
}
```

这篇博客文章详细介绍了 `to` 函数的使用方法、应用场景和最佳实践。文章包含了：

1. **函数介绍**：解释了 `to` 函数的作用和原理
2. **基本用法**：展示了传统 try-catch 与 `to` 函数的对比
3. **高级示例**：包括数据库操作、API 调用、文件操作等实际场景
4. **错误标准化**：展示了不同类型错误的处理方式
5. **优势分析**：列出了使用 `to` 函数的好处
6. **最佳实践**：提供了使用建议和注意事项

文章使用了适当的代码块、标题层级和示例，符合现有博客的格式风格。

```

```
