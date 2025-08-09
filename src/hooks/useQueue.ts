import { useCallback, useState } from 'react'

/**
 * 操作队列hook
 * @param initialValue 初始值，接受一个数组，可以说任意类型的数组
 * @returns add 添加元素方法
 * @returns remove 删除元素方法
 * @returns clear 清空队列方法
 * @return at 获取队列中指定位置的元素方法
 * @returns queue 当前队列
 * @returns size 队列长度
 */
export default function useQueue<T>(initialValue: readonly T[]) {
  const [queue, setQueue] = useState(initialValue)

  const add = useCallback((element: T) => {
    setQueue((s) => [...s, element])
  }, [])

  return {
    queue,
    add,
    size: queue.length,
  }
}
