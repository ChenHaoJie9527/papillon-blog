import { useState, useCallback } from 'react'

/**
 * 使用对象状态管理
 * @param initialState 初始状态，类型为对象
 * @returns 状态和处理状态的函数
 */
function useObjectState<T extends Record<string, unknown>>(initialState: T) {
  const [state, setState] = useState<T>(initialState)

  const handlerState = useCallback((arg: unknown) => {
    if (typeof arg === 'function') {
      setState((s) => {
        const newState = arg(s)

        return {
          ...s,
          ...newState,
        }
      })
    }

    if (typeof arg === 'object' && arg !== null) {
      setState((s) => ({
        ...s,
        ...arg,
      }))
    }
  }, [])

  return [state, handlerState] as const
}

export default useObjectState
