import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useObjectState from '@hooks/useObjectState'

describe('useObjectState', () => {
  it('应该正确初始化状态', () => {
    const initialState = {
      name: 'Join',
      age: 10,
    }
    const { result } = renderHook(() => useObjectState(initialState))

    const [state] = result.current

    expect(state).toEqual(initialState)
  })

  it('应该通过对象更新状态', () => {
    const initialState = {
      name: 'Join',
      age: 10,
    }
    const { result } = renderHook(() => useObjectState(initialState))

    act(() => {
      const [, setState] = result.current
      setState({
        age: 11,
      })
    })

    const [state] = result.current
    expect(state).toEqual({
      name: 'Join',
      age: 11,
    })
  })
  it('应该通过函数更新', () => {
    const initialState = { name: 'Join', age: 10 }
    const { result } = renderHook(() => useObjectState(initialState))

    act(() => {
      const [, setState] = result.current
      setState((s: typeof initialState) => ({
        ...s,
        age: s.age + 10,
      }))
    })

    const [state] = result.current
    expect(state).toEqual({
      name: 'Join',
      age: 20,
    })
  })

  it('应该合并多个更新', () => {
    const initialState = { name: 'Join', age: 10 }
    const { result } = renderHook(() => useObjectState(initialState))

    act(() => {
      const [, setState] = result.current
      setState({
        age: 20,
      })
      setState({
        name: 'Join2',
      })
    })

    const [state] = result.current
    expect(state).toEqual({
      name: 'Join2',
      age: 20,
    })
  })

  it('应该处理空对象更新', () => {
    const initialState = { name: 'Join', age: 10 }
    const { result } = renderHook(() => useObjectState(initialState))

    act(() => {
      const [, setState] = result.current
      setState({})
    })

    const [state] = result.current
    expect(state).toEqual({
      name: 'Join',
      age: 10,
    })
  })

  it('应该保持引用稳定性', () => {
    const initialState = { name: 'Join', age: 10 }
    const { result, rerender } = renderHook(() => useObjectState(initialState))

    const firstRender = result.current

    rerender()

    const secondRender = result.current

    expect(firstRender[0]).toBe(secondRender[0])
    expect(firstRender[1]).toBe(secondRender[1])
  })

  it('应该处理 null 和 undefined', () => {
    const initialState = { name: 'Join', age: 10 }
    const { result } = renderHook(() => useObjectState(initialState))

    act(() => {
      const [, setState] = result.current
      setState(null)
    })

    const [state] = result.current
    expect(state).toEqual(initialState)

    act(() => {
      const [, setState] = result.current
      setState(undefined)
    })

    const [state2] = result.current
    expect(state2).toEqual(initialState)
  })
})
