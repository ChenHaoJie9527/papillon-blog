import { useRef, useCallback } from 'react'

/**
 * 防抖 hook
 * @param cb 需要防抖的函数
 * @param delay 延迟时间
 * @returns 防抖后的函数
 */
export default function useDebounce<T extends (...args: any[]) => any>(
  cb: T,
  delay: number,
) {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        clearTimeout(timer.current)
      }

      timer.current = setTimeout(() => {
        cb(...args)
      }, delay)
    },
    [cb, delay],
  ) as T

  return debounced
}
