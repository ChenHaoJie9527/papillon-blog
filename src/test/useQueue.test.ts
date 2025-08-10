import useQueue from '@hooks/useQueue'
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('useQueue', () => {
  it('应该正确初始化队列', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    expect(result.current.queue).toEqual([1, 2, 3])
  })

  it('应该处理空数组初始化', () => {
    const { result } = renderHook(() => useQueue([]))

    expect(result.current.queue).toEqual([])
    expect(result.current.size).toEqual(0)
    expect(result.current.at(0)).toBeUndefined()
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

  it('应该正确移除元素', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))
    let firstItem: number | undefined
    act(() => {
      firstItem = result.current.remove()
    })

    expect(firstItem).toEqual(1)
    expect(result.current.size).toEqual(2)
    expect(result.current.queue).toEqual([2, 3])
  })

  it('应该正确清空队列', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    act(() => {
      result.current.clear()
    })

    expect(result.current.size).toEqual(0)
    expect(result.current.queue).toEqual([])
  })

  it('应该处理空队列的情况', () => {
    const { result } = renderHook(() => useQueue([]))

    expect(result.current.at(0)).toBeUndefined()
    expect(result.current.at(1)).toBeUndefined()
    expect(result.current.at(-1)).toBeUndefined()
  })

  describe('useQueue at method', () => {
    it('应该测试获取队列中指定位置的元素', () => {
      const { result } = renderHook(() => useQueue([1, 2, 3]))
      expect(result.current.at(0)).toEqual(1)
      expect(result.current.at(1)).toEqual(2)
      expect(result.current.at(2)).toEqual(3)
      expect(result.current.at(3)).toBeUndefined()
      expect(result.current.at(-1)).toEqual(3)
    })

    it('应该处理单元素数组', () => {
      const { result } = renderHook(() => useQueue([42]))

      expect(result.current.queue).toEqual([42])
      expect(result.current.size).toEqual(1)
      expect(result.current.at(0)).toEqual(42)
      expect(result.current.at(-1)).toEqual(42)
    })

    it('应该处理边界索引', () => {
      const { result } = renderHook(() => useQueue(['a', 'b', 'c']))

      // 正常索引
      expect(result.current.at(0)).toEqual('a')
      expect(result.current.at(2)).toEqual('c')

      // 超出范围的索引
      expect(result.current.at(3)).toBeUndefined()
      expect(result.current.at(10)).toBeUndefined()
      expect(result.current.at(Number.MAX_SAFE_INTEGER)).toBeUndefined()

      // 负数索引
      expect(result.current.at(-1)).toEqual('c')
      expect(result.current.at(-10)).toBeUndefined()
      expect(result.current.at(Number.MIN_SAFE_INTEGER)).toBeUndefined()
    })

    it('应该处理特殊数值索引', () => {
      const { result } = renderHook(() => useQueue([1, 2, 3]))

      // NaN: 将索引转换成整数，NaN转化为0
      expect(result.current.at(NaN)).toEqual(1)

      // Infinity
      expect(result.current.at(Infinity)).toBeUndefined()
      expect(result.current.at(-Infinity)).toBeUndefined()

      // 小数 小数会被转换成整数，这是一个向下取整，0.5会变成0，1.9会变成1
      expect(result.current.at(0.5)).toEqual(1)
      expect(result.current.at(1.9)).toEqual(2)
    })

    it('应该在队列变化后正确获取元素', () => {
      const { result } = renderHook(() => useQueue([1, 2, 3]))

      // 初始状态
      expect(result.current.at(0)).toEqual(1)
      expect(result.current.at(2)).toEqual(3)

      // 添加元素后
      act(() => {
        result.current.add(4)
      })
      expect(result.current.at(0)).toEqual(1)
      expect(result.current.at(3)).toEqual(4)

      // 移除元素后
      act(() => {
        result.current.remove()
      })
      expect(result.current.at(0)).toEqual(2)
      expect(result.current.at(2)).toEqual(4)
      expect(result.current.at(3)).toBeUndefined()

      // 清空后
      act(() => {
        result.current.clear()
      })
      expect(result.current.at(0)).toBeUndefined()
    })

    it('应该处理不同类型的数组元素', () => {
      const mixedArray = [1, 'hello', { id: 1 }, [1, 2, 3]]
      const { result } = renderHook(() => useQueue(mixedArray))

      expect(result.current.at(0)).toEqual(1)
      expect(result.current.at(1)).toEqual('hello')
      expect(result.current.at(2)).toEqual({ id: 1 })
      expect(result.current.at(3)).toEqual([1, 2, 3])
    })

    it('应该处理大数组的性能', () => {
      const largeArray = Array.from({ length: 1000 }, (_, i) => i)
      const { result } = renderHook(() => useQueue(largeArray))

      expect(result.current.at(0)).toEqual(0)
      expect(result.current.at(999)).toEqual(999)
      expect(result.current.at(1000)).toBeUndefined()
    })
  })

  it('应该支持全量设置队列', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    act(() => {
      result.current.setQueueState([4, 5, 6])
    })

    expect(result.current.queue).toEqual([4, 5, 6])
    expect(result.current.size).toEqual(3)
  })

  it('应该支持函数形式的 setQueueState', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    act(() => {
      result.current.setQueueState((s) => [...s, 7, 8])
    })

    expect(result.current.queue).toEqual([1, 2, 3, 7, 8])
    expect(result.current.size).toEqual(5)
  })

  it('应该支持函数形式的 setQueueState 进行复杂操作', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3, 4, 5]))

    act(() => {
      result.current.setQueueState((s) => s.filter((x) => x % 2 === 0))
    })

    expect(result.current.queue).toEqual([2, 4])
    expect(result.current.size).toEqual(2)
  })

  it('应该处理空队列的 remove 操作', () => {
    const { result } = renderHook(() => useQueue([]))

    const removedItem = result.current.remove()
    expect(removedItem).toBeUndefined()
    expect(result.current.queue).toEqual([])
    expect(result.current.size).toEqual(0)
  })

  it('应该处理单元素队列的 remove 操作', () => {
    const { result } = renderHook(() => useQueue([99]))

    act(() => {
      const removedItem = result.current.remove()
      expect(removedItem).toEqual(99)
    })

    expect(result.current.queue).toEqual([])
    expect(result.current.size).toEqual(0)
  })

  it('应该支持清空后重新设置', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]))

    act(() => {
      result.current.clear()
    })
    expect(result.current.queue).toEqual([])

    act(() => {
      result.current.setQueueState([9, 10])
    })
    expect(result.current.queue).toEqual([9, 10])
  })
})
