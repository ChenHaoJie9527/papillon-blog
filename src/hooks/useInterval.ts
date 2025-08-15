import { useEffect, useRef } from 'react'

function useInterval(
  callback: () => void,
  ms: number | null,
  options?: {
    immediate?: boolean // 是否立即执行
  },
) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const callbackRef = useRef(callback)

  // 保存最新的回调函数
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // 设置定时器
  useEffect(() => {
    if (ms === null) {
      return
    }

    if (options?.immediate) {
      callbackRef.current()
    }

    intervalRef.current = setInterval(() => {
      callbackRef.current()
    }, ms)

    // 清理函数
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [ms, options?.immediate])

  // 返回清除定时器的函数
  const clearIntervalHandler = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  return clearIntervalHandler
}

export default useInterval
