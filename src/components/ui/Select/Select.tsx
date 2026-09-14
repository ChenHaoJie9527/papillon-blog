import { useState, useCallback, useMemo, useId, useRef, useEffect } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { SelectContext } from './context'
import type { Placement, SelectProps } from './types'
import { useMap } from '@hooks/useMap'
import { toggleValue, toValues, defaultMatch } from './utils'

/**
 * Select 根组件：持有选中值、开关、选项标签表与放置方向。
 *
 * ## 受控 / 非受控
 * - `value` 有值 → 选中值受控，内部 `internal` 不再更新展示，只靠外部回流。
 * - `open` 有值 → 开关受控，`setOpen` 只调用 `onOpenChange`。
 *
 * ## 标签登记
 * `SelectItem` 挂载时 `register(value, label)`，卸载时 `unregister`。
 * 面板关闭并不卸载选项（见 `SelectContent`），所以触发器关闭后仍能显示当前 label。
 *
 * ## 点击外部 / Esc
 * 打开期间在 `window` 上监听 `keydown` 与 `pointerdown`：
 * Esc 或点击根节点以外区域时关闭。监听器在关闭后立即拆除。
 *
 * @example
 * ```tsx
 * <Select defaultValue="apple" onValueChange={console.log}>
 *   <SelectTrigger>
 *     <SelectValue placeholder="选择水果" />
 *   </SelectTrigger>
 *   <SelectContent>
 *     <SelectItem value="apple">苹果</SelectItem>
 *     <SelectItem value="pear">梨</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
export function Select({
  value,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  multiple = false,
  searchable = false,
  searchValue,
  defaultSearchValue = '',
  onSearch,
  filter = true,
}: SelectProps) {
  /** 系统开启「减少动态效果」时为 true，子组件据此跳过弹簧。 */
  const reduce = useReducedMotion() ?? false
  /** 同一页面多个 Select 并存时，用 React id 保证 trigger / list 的 aria 配对唯一。 */
  const baseId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  /** 可搜索时由 SelectValue 把 input 节点挂上来，供 Trigger 点击时 focus。 */
  const searchInputRef = useRef<HTMLInputElement>(null)
  /** 非受控的初始搜索词。 */
  const [internalQuery, setInternalQuery] = useState(defaultSearchValue)
  /** 受控搜索词优先。 */
  const searchControlled = searchValue !== undefined
  /** 最终的搜索词。 */
  const query = searchControlled ? searchValue : internalQuery

  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [internal, setInternal] = useState<string[]>(() => toValues(defaultValue))
  const [labels, { set: setLabel, remove: removeLabel }] = useMap<string, string>()
  const [placement, setPlacement] = useState<Placement>('bottom')

  const isMultiple = multiple === true
  const controlled = value !== undefined
  const values = controlled ? toValues(value) : internal

  const openControlled = openProp !== undefined
  const open = openControlled ? openProp : internalOpen

  /** 更新搜索词。 */
  const setQuery = useCallback(
    (next: string) => {
      if (!searchControlled) setInternalQuery(next)
      onSearch?.(next)
    },
    [onSearch, searchControlled],
  )

  /** 更新展开状态。 */
  const setOpen = useCallback(
    (next: boolean) => {
      if (!openControlled) setInternalOpen(next)
      onOpenChange?.(next)
      // 如果关闭面板，并且可搜索，则清空搜索词
      if (!next && searchable) setQuery('')
    },
    [onOpenChange, openControlled, searchable, setQuery],
  )

  /** 选中一项。单选：替换并关面板；多选：切换该项，不关面板。 */
  const select = useCallback(
    (next: string) => {
      // 判断是否多选，如果是多选，则使用 toggleValue 函数切换选中值，否则直接设置为新值
      const upcoming = isMultiple ? toggleValue(values, next) : [next]

      // 如果受控，则不更新内部状态，否则更新内部状态
      if (!controlled) setInternal(upcoming)

      if (isMultiple) {
        const emit = onValueChange as ((value: string[]) => void) | undefined
        emit?.(upcoming)
        if (searchable) setQuery('')
      } else {
        const emit = onValueChange as ((value: string) => void) | undefined
        emit?.(upcoming[0] ?? '')
        setOpen(false)
      }

      if (searchable) searchInputRef.current?.focus()
    },
    [controlled, onValueChange, setOpen, isMultiple, values, searchable, setQuery],
  )

  /** 依赖具体方法而不是整个 actions 对象，避免对象换引用导致选项反复登记。 */
  const register = useCallback(
    (v: string, label: string) => {
      setLabel(v, label)
    },
    [setLabel],
  )

  // 避免每次选中都换掉 unregister 引用
  const valuesRef = useRef(values)
  valuesRef.current = values

  const unregister = useCallback(
    (v: string) => {
      // 如果值在选中值中，则不删除
      if (valuesRef.current.includes(v)) return
      removeLabel(v)
    },
    [removeLabel],
  )

  /** 选项是否应显示。filter === false 时恒为 true。 */
  const matchItem = useCallback(
    (item: { value: string; label: string }) => {
      if (filter === false) return true
      const fn = typeof filter === 'function' ? filter : defaultMatch
      return fn(query, item)
    },
    [filter, query],
  )

  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointer)

    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [open, setOpen])

  const ctx = useMemo(
    () => ({
      multiple: isMultiple,
      values,
      open,
      setOpen,
      select,
      register,
      unregister,
      labelFor: (v?: string) => (v === undefined ? undefined : labels.get(v)),
      reduce,
      triggerId: `${baseId}-trigger`,
      listId: `${baseId}-list`,
      disabled,
      placement,
      setPlacement,
      searchable,
      query,
      setQuery,
      filter,
      matchItem,
      searchInputRef,
    }),
    [
      isMultiple,
      values,
      open,
      setOpen,
      select,
      register,
      unregister,
      labels,
      reduce,
      baseId,
      disabled,
      placement,
      searchable,
      query,
      setQuery,
      filter,
      matchItem,
      searchInputRef,
    ],
  )

  return (
    <SelectContext value={ctx}>
      <div ref={rootRef} className={cn('relative', className)}>
        {children}
      </div>
    </SelectContext>
  )
}
