import { useRef, useCallback } from 'react'

/**
 * 节流 hook
 * @param cb 需要节流的函数
 * @param delay 延迟时间
 * @returns 节流后的函数
 */
export default function useThrottle<T extends (...args: any[]) => any>(
  cb: T,
  delay: number,
) {
  const lastTime = useRef(0)

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now()

      if (now - lastTime.current >= delay) {
        lastTime.current = now
        cb(...args)
      }
    },
    [cb, delay],
  ) as T

  return throttled
}
