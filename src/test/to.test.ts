import { to } from '@lib/index'
import { describe, it, expect } from 'vitest'


describe('to', () => {
  it('should return a value when resolved', async () => {
    const [err, data] = await to(Promise.resolve('test'))
    expect(err).toBeNull()
    expect(data).toBe('test')
  })
})
