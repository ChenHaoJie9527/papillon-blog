import type { ReactNode } from 'react'

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

export type SelectFilterItem = {
  value: string
  label: string
}

export type SelectFilterFn = (query: string, item: SelectFilterItem) => boolean

/** 默认本地过滤：trim 后忽略大小写，命中 label 或 value 即可。 */
export function defaultMatch(query: string, item: SelectFilterItem) {
  const v = query.trim().toLowerCase()
  if (!v) {
    return true
  }

  return item.label.toLowerCase().includes(v) || item.value.toLowerCase().includes(v)
}

/**
 * 触发器文案 / 搜索文本。
 * label 显式传入优先；否则字符串 children；再否则 value。
 */
export function resolveItemLabel(value: string, children: ReactNode, label?: string) {
  if (label) {
    return label
  }

  if (typeof children === 'string') {
    return children
  }

  return value
}
