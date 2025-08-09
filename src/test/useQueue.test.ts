import useQueue from '@hooks/useQueue'
import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('useQueue', () => {
  it('应该正确初始化队列', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    expect(result.current.queue).toEqual([1, 2, 3])
  })
})
