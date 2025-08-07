import { to } from '@lib/index'
import { describe, it, expect } from 'vitest'

describe('to', () => {
  it('解析时应返回值', async () => {
    const [err, data] = await to(Promise.resolve('test'))
    expect(err).toBeNull()
    expect(data).toBe('test')
  })
  it('解析失败时应返回错误', async () => {
    const promise = Promise.reject('Error')

    const [err, data] = await to(promise)
    expect(err?.message).toBe('Error')
    expect(data).toBeUndefined()
  })
  it('如果是一个空的reject，则返回一个错误', async () => {
    const promise = Promise.reject()
    const [err, data] = await to(promise)
    expect(err?.message).toBe('Empty error')
    expect(data).toBeUndefined()
  })

  it('应该支持错误扩展', async () => {
    const errorExt = {
      context: 'test context',
      timestamp: Date.now(),
    }
    const promise = Promise.reject(new Error('Original Error'))
    const [err, data] = await to(promise, errorExt)
    expect(err?.message).toBe('Original Error')
    expect(data).toBeUndefined()
  })

  it('应该处理不同类型的错误', async () => {
    // 字符串错误
    const [err1] = await to(Promise.reject('String error'))
    expect(err1?.message).toBe('String error')

    // Error 对象
    const [err2] = await to(Promise.reject(new Error('Error object')))
    expect(err2?.message).toBe('Error object')

    // 自定义错误对象
    const customError = { code: 404, message: 'Not found' }
    const [err3] = await to(Promise.reject(customError))
    expect(err3?.message).toBe('Not found')
  })
  it('应该处理网络请求场景', async () => {
    // 模拟成功的 API 调用
    const mockApiCall = () =>
      Promise.resolve({ status: 200, data: { id: 1, name: 'test' } })
    const [err, data] = await to(mockApiCall())
    expect(err).toBeNull()
    expect(data).toEqual({ status: 200, data: { id: 1, name: 'test' } })

    // 模拟失败的 API 调用
    const mockFailedApiCall = () =>
      Promise.reject({ status: 500, message: 'Server error' })
    const [err2, data2] = await to(mockFailedApiCall())
    expect(err2).toEqual({ status: 500, message: 'Server error' })
    expect(data2).toBeUndefined()
  })
  it('应该处理边界情况', async () => {
    const [err1, data1] = await to(Promise.resolve(null))
    expect(err1).toBeNull()
    expect(data1).toBeNull()

    const [err2, data2] = await to(Promise.resolve(undefined))
    expect(err2).toBeNull()
    expect(data2).toBeUndefined()

    const [err3, data3] = await to(Promise.resolve(''))
    expect(err3).toBeNull()
    expect(data3).toBe('')

    const [err4, data4] = await to(Promise.resolve({}))
    expect(err4).toBeNull()
    expect(data4).toEqual({})
  })

  it('应该处理复杂数据结构', async () => {
    const data = {
      users: [
        {
          id: 1,
          name: 'John',
        },
      ],
      metadata: {
        total: 1,
        page: 1,
      },
    }

    const [err, result] = await to(Promise.resolve(data))

    expect(err).toBeNull()
    expect(result).toEqual(data)
  })

  it('应该正确处理错误扩展与不同类型错误的组合', async () => {
    const errorExt = {
      source: 'api',
      retryCount: 1,
    }

    // 字符串错误 + 扩展
    const [err1, data1] = await to(Promise.reject('Network error'), errorExt)
    expect(err1?.message).toBe('Network error')
    expect(err1?.source).toBe('api')
    expect(err1?.retryCount).toBe(1)
    expect(data1).toBeUndefined()
  })

  it('应该快速处理大量并发请求', async () => {
    const promises = Array.from({ length: 100 }, (_, i) =>
      to(Promise.resolve(`result-${i}`)),
    )

    const start = Date.now()
    const results = await Promise.all(promises)
    const end = Date.now()

    expect(results).toHaveLength(100)
    expect(
      results.every(([err, data]) => err === null && data.startsWith('result-')),
    ).toBe(true)
    expect(end - start).toBeLessThan(1000) // 应该在1秒内完成
  })
})
