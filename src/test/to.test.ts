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
})
