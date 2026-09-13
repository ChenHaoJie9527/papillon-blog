import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useMap } from '@hooks/useMap'

describe('useMap', () => {
  it('应该用条目数组初始化', () => {
    const { result } = renderHook(() => useMap([['apple', '苹果']]))

    const [map] = result.current
    expect(map.get('apple')).toBe('苹果')
    expect(map.size).toBe(1)
  })

  it('应该用空 Map 作为默认值', () => {
    const { result } = renderHook(() => useMap<string, string>())

    expect(result.current[0].size).toBe(0)
  })

  it('set 应该添加或覆盖键值对，并返回新的 Map 引用', () => {
    const { result } = renderHook(() => useMap<string, string>())
    const previous = result.current[0]

    act(() => {
      result.current[1].set('user-1', '陈浩杰')
    })

    expect(result.current[0]).not.toBe(previous)
    expect(result.current[0].get('user-1')).toBe('陈浩杰')

    act(() => {
      result.current[1].set('user-1', '更新后')
    })

    expect(result.current[0].get('user-1')).toBe('更新后')
    expect(result.current[0].size).toBe(1)
  })

  it('remove 应该删除指定键', () => {
    const { result } = renderHook(() =>
      useMap([
        ['a', 1],
        ['b', 2],
      ]),
    )

    act(() => {
      result.current[1].remove('a')
    })

    expect(result.current[0].has('a')).toBe(false)
    expect(result.current[0].get('b')).toBe(2)
    expect(result.current[0].size).toBe(1)
  })

  it('setAll 应该整体替换而不是合并', () => {
    const { result } = renderHook(() =>
      useMap([
        ['apple', '苹果'],
        ['pear', '梨'],
      ]),
    )

    act(() => {
      result.current[1].setAll([['cat', '猫']])
    })

    expect(result.current[0].has('apple')).toBe(false)
    expect(result.current[0].get('cat')).toBe('猫')
    expect(result.current[0].size).toBe(1)
  })

  it('reset 应该清空为新的空 Map', () => {
    const { result } = renderHook(() => useMap([['apple', '苹果']]))

    act(() => {
      result.current[1].reset()
    })

    expect(result.current[0].size).toBe(0)
    expect(result.current[0].get('apple')).toBeUndefined()
  })

  it('action 方法引用应该保持稳定', () => {
    const { result, rerender } = renderHook(() => useMap<string, number>())
    const firstActions = result.current[1]

    rerender()

    expect(result.current[1].set).toBe(firstActions.set)
    expect(result.current[1].setAll).toBe(firstActions.setAll)
    expect(result.current[1].remove).toBe(firstActions.remove)
    expect(result.current[1].reset).toBe(firstActions.reset)
  })
})
