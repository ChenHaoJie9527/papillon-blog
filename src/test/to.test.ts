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
    expect(err).toBe('Error')
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
})
