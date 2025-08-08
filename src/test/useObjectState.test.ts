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
})
