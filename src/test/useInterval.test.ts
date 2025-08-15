import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import useInterval from '../hooks/useInterval'

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should call callback at specified interval', () => {
    const callback = vi.fn()
    const ms = 1000

    renderHook(() => useInterval(callback, ms))

    // 初始时不应该调用
    expect(callback).not.toHaveBeenCalled()

    // 1秒后应该调用一次
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)

    // 再过1秒应该调用第二次
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should not start interval when ms is null', () => {
    const callback = vi.fn()

    renderHook(() => useInterval(callback, null))

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(callback).not.toHaveBeenCalled()
  })

  it('should clear interval when clearInterval is called', () => {
    const callback = vi.fn()
    const ms = 1000

    const { result } = renderHook(() => useInterval(callback, ms))

    // 1秒后调用一次
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)

    // 清除定时器
    act(() => {
      result.current()
    })

    // 再过1秒不应该再调用
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should update callback when callback changes', () => {
    const callback1 = vi.fn()
    const callback2 = vi.fn()
    const ms = 1000

    const { rerender } = renderHook(
      ({ callback }) => useInterval(callback, ms),
      { initialProps: { callback: callback1 } }
    )

    // 1秒后调用第一个回调
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).not.toHaveBeenCalled()

    // 更新回调函数
    rerender({ callback: callback2 })

    // 再过1秒应该调用新的回调
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback1).toHaveBeenCalledTimes(1)
    expect(callback2).toHaveBeenCalledTimes(1)
  })

  it('should call callback immediately when immediate option is true', () => {
    const callback = vi.fn()
    const ms = 1000

    renderHook(() => useInterval(callback, ms, { immediate: true }))

    // 立即应该调用一次
    expect(callback).toHaveBeenCalledTimes(1)

    // 1秒后应该调用第二次
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should not call callback immediately when immediate option is false', () => {
    const callback = vi.fn()
    const ms = 1000

    renderHook(() => useInterval(callback, ms, { immediate: false }))

    // 初始时不应该调用
    expect(callback).not.toHaveBeenCalled()

    // 1秒后应该调用一次
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should not call callback immediately when immediate option is not provided', () => {
    const callback = vi.fn()
    const ms = 1000

    renderHook(() => useInterval(callback, ms))

    // 初始时不应该调用
    expect(callback).not.toHaveBeenCalled()

    // 1秒后应该调用一次
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should handle immediate option with null ms', () => {
    const callback = vi.fn()

    renderHook(() => useInterval(callback, null, { immediate: true }))

    // 即使设置了 immediate，当 ms 为 null 时也不应该调用
    expect(callback).not.toHaveBeenCalled()
  })
})
