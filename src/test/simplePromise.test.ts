import SimplePromise from '@lib/simplePromise'
import { describe, it, expect } from 'vitest'

describe('SimplePromise', () => {
  it('should be a class', () => {
    expect(SimplePromise).toBeDefined()
  })

  it('初始化 SimplePromise', () => {
    const promise = new SimplePromise(() => {})

    expect(promise.state).toBe('pending')
    expect(promise.value).toBeUndefined()
    expect(promise.reason).toBeUndefined()
    expect(promise.onFulfilledCallbacks).toEqual([])
    expect(promise.onRejectedCallbacks).toEqual([])
  })

  it('resolve 函数', () => {
    const promise = new SimplePromise((resolve: any) => {
      resolve('success')
    })

    expect(promise.state).toBe('fulfilled')
    expect(promise.value).toBe('success')
    expect(promise.reason).toBeUndefined()
    expect(promise.onFulfilledCallbacks).toEqual([])
    expect(promise.onRejectedCallbacks).toEqual([])
  })

  it('reject 函数', () => {
    const promise = new SimplePromise((resolve: any, reject: any) => {
      reject('error')
    })

    expect(promise.state).toBe('rejected')
    expect(promise.value).toBeUndefined()
    expect(promise.reason).toBe('error')
    expect(promise.onFulfilledCallbacks).toEqual([])
    expect(promise.onRejectedCallbacks).toEqual([])
  })

  it('状态只能变更一次', () => {
    const promise = new SimplePromise((resolve: any, reject: any) => {
      resolve('success')
      reject('error') // 被忽略
    })

    expect(promise.state).toBe('fulfilled')
    expect(promise.value).toBe('success')
    expect(promise.reason).toBeUndefined()
    expect(promise.onFulfilledCallbacks).toEqual([])
    expect(promise.onRejectedCallbacks).toEqual([])
  })

  it('executor 抛出错误应该被 reject', () => {
    const promise = new SimplePromise(() => {
      throw new Error('error')
    })
    expect(promise.state).toBe('rejected')
    expect(promise.value).toBeUndefined()
    expect(promise.reason?.message).toBe('error')
    expect(promise.onFulfilledCallbacks).toEqual([])
    expect(promise.onRejectedCallbacks).toEqual([])
  })

  it('then 方法应该返回新的promise', () => {
    const promise = new SimplePromise((resolve: any) => {
      resolve('success')
    })

    const result = promise.then((res) => res)
    expect(result).toBeInstanceOf(SimplePromise)
  })

  it('then 方法返回成功回调', () => {
    const promise = new SimplePromise((resolve: any) => {
      resolve('success')
    })

    promise.then((value: any) => {
      console.log(value)
    })

    expect(promise.state).toBe('fulfilled')
    expect(promise.value).toBe('success')
    expect(promise.reason).toBeUndefined()
    expect(promise.onFulfilledCallbacks).toEqual([])
    expect(promise.onRejectedCallbacks).toEqual([])
  })

  it('then 方法返回失败回调', () => {
    const promise = new SimplePromise((resolve: any, reject: any) => {
      reject('error')
    })

    promise.then(
      (value: any) => {
        // 不会执行
        console.log(value)
      },
      (err: any) => {
        // 会执行
        expect(err).toBe('error')
      },
    )
  })

  it('catch 方法处理失败', () => {
    const promise = new SimplePromise((resolve: any, reject: any) => {
      reject('error')
    })

    promise.catch((err: any) => {
      expect(err).toBe('error')
    })
  })

  it('异步 resolve', (done) => {
    const promise = new SimplePromise((resolve: any) => {
      setTimeout(() => {
        resolve('async success')
      }, 100)
    })

    promise.then((value: any) => {
      expect(value).toBe('async success')
    })
  })

  it('异步 reject', (done) => {
    const promise = new SimplePromise((resolve: any, reject: any) => {
      setTimeout(() => {
        reject('async error')
      }, 100)
    })

    promise.catch((reason: any) => {
      expect(reason).toBe('async error')
    })
  })

  it('then 回调抛出错误应该被捕获', (done) => {
    const promise = new SimplePromise((resolve: any) => {
      resolve('success')
    })

    promise
      .then((value: any) => {
        throw new Error('then error')
      })
      .catch((error: any) => {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('then error')
      })
  })
})
