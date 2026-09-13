/**
 * 把受控值或非受控初始值转换为内部数组。
 *
 * @param raw 受控值或非受控初始值
 * @returns 内部数组
 * @example
 * ```tsx
 * toValues('apple') // ['apple']
 * toValues(['apple', 'pear']) // ['apple', 'pear']
 * ```
 */
export function toValues(raw?: string | string[]) {
  if (raw === undefined) {
    return []
  }

  return Array.isArray(raw) ? raw : [raw]
}

/** 切换选中值。多选时添加或移除，单选时替换。
 *
 * @param prev 当前选中值
 * @param next 新选中值
 * @returns 新选中值
 * @example
 * ```tsx
 * toggleValue(['apple', 'pear'], 'apple') // ['pear']
 * toggleValue(['apple', 'pear'], 'orange') // ['apple', 'pear', 'orange']
 * ```
 */
export function toggleValue(prev: string[], next: string) {
  return prev.includes(next) ? prev.filter((v) => v !== next) : [...prev, next]
}
