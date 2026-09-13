import { useCallback, useState } from 'react'

/**
 * 表示 Map 或键值对数组的类型.
 * @template K - Map 的键类型.
 * @template V - Map 的值类型.
 */
type MapOrEntries<K, V> = Map<K, V> | [K, V][]

type useMapActions<K, V> = {
  /** 设置键值对. */
  set: (key: K, value: V) => void
  /** 设置多个键值对. */
  setAll: (entries: MapOrEntries<K, V>) => void
  /** 删除键值对. */
  remove: (key: K) => void
  /** 重置Map为空状态. */
  reset: Map<K, V>['clear']
}

/**
 * 表示 `useMap` hook 的返回类型.
 * 隐藏一些 setter 方法，以禁用自动补全.
 * @template K - Map 的键类型.
 * @template V - Map 的值类型.
 */

type UseMapReturn<K, V> = [
  Omit<Map<K, V>, 'set' | 'clear' | 'delete'>,
  useMapActions<K, V>,
]

/**
 * 一个自定义钩子，用于通过设置器操作管理键值对 `Map` 状态。
 * @template K - Map 的键类型.
 * @template V - Map 的值类型.
 * @param {MapOrEntries<K, V>} [initialState] - Map 的初始状态，可以是一个 Map 或一个键值对数组 (可选).
 * @returns {UseMapReturn<K, V>} 一个包含 Map 状态和操作 Map 的函数的元组.
 *
 * @example
 * ```tsx
 * const [map, mapActions] = useMap();
 * mapActions.set('key', 'value');
 * mapActions.remove('key');
 * mapActions.reset();
 * // Access the `map` state and use `mapActions` to set, remove, or reset entries.
 * console.log(map);
 * ```
 */

export function useMap<K, V>(
  initialState: MapOrEntries<K, V> = new Map(),
): UseMapReturn<K, V> {
  const [map, setMap] = useState(new Map(initialState))

  const actions: useMapActions<K, V> = {
    set: useCallback((key, value) => {
      setMap((prev) => {
        const copy = new Map(prev)
        copy.set(key, value)
        return copy
      })
    }, []),

    setAll: useCallback((entries) => {
      setMap(() => new Map(entries))
    }, []),

    remove: useCallback((key) => {
      setMap((prev) => {
        const copy = new Map(prev)
        copy.delete(key)
        return copy
      })
    }, []),

    reset: useCallback(() => {
      setMap(() => new Map())
    }, []),
  }

  return [map, actions]
}
