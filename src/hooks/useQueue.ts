import { useCallback, useState } from 'react'

/**
 * 操作队列hook
 * @param initialValue 初始值，接受一个数组，可以说任意类型的数组
 * @returns add 将元素添加到队列末尾
 * @returns remove 从队列中移除并返回第一个元素
 * @returns clear 清空队列方法
 * @return at 获取队列中指定位置的元素方法
 * @returns queue 当前队列
 * @returns size 队列长度
 * @returns setQueueState 全量设置队列内容
 */
export default function useQueue<T>(initialValue: T[]) {
  const [queue, setQueue] = useState(initialValue)

  const add = useCallback((element: T) => {
    setQueue((s) => [...s, element])
  }, [])

  const remove = useCallback(() => {
    let firstItem: T | undefined
    setQueue((s) => {
      firstItem = s[0]
      return s.slice(1)
    })

    return firstItem
  }, [])

  const clear = useCallback(() => {
    setQueue([])
  }, [])

  const at = useCallback(
    (index: number) => {
      return queue.at(index)
    },
    [queue],
  )

  const setQueueState = useCallback((newQueue: T[] | ((prevQueue: T[]) => T[])) => {
    setQueue(newQueue)
  }, [])

  return {
    queue,
    add,
    size: queue.length,
    remove,
    clear,
    at,
    setQueueState,
  }
}
