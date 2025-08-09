import useQueue from '@hooks/useQueue'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('useQueue', () => {
  it('应该正确初始化队列', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    expect(result.current.queue).toEqual([1, 2, 3])
  })

  it('应该正确添加元素', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    act(() => {
      result.current.add(4)
    })

    expect(result.current.queue).toEqual([1, 2, 3, 4])
  })

  it('应该正确获取队列长度', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    expect(result.current.size).toEqual(3)
  })
})
