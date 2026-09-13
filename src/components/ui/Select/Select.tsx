import { useState, useCallback, useMemo, useId, useRef, useEffect } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { SelectContext } from './context'
import type { Placement, SelectProps } from './types'
import { useMap } from '@hooks/useMap'
import { toggleValue, toValues } from './utils'

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
}: SelectProps) {
  /** 系统开启「减少动态效果」时为 true，子组件据此跳过弹簧。 */
  const reduce = useReducedMotion() ?? false
  /** 同一页面多个 Select 并存时，用 React id 保证 trigger / list 的 aria 配对唯一。 */
  const baseId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const [internal, setInternal] = useState<string[]>(() => toValues(defaultValue))
  const [labels, { set: setLabel, remove: removeLabel }] = useMap<string, string>()
  const [placement, setPlacement] = useState<Placement>('bottom')

  const isMultiple = multiple === true
  const controlled = value !== undefined
  const values = controlled ? toValues(value) : internal

  const openControlled = openProp !== undefined
  const open = openControlled ? openProp : internalOpen

  const setOpen = useCallback(
    (next: boolean) => {
      if (!openControlled) setInternalOpen(next)
      onOpenChange?.(next)
    },
    [onOpenChange, openControlled],
  )

  const select = useCallback(
    (next: string) => {
      // 判断是否多选，如果是多选，则使用 toggleValue 函数切换选中值，否则直接设置为新值
      const upcoming = isMultiple ? toggleValue(values, next) : [next]

      // 如果受控，则不更新内部状态，否则更新内部状态
      if (!controlled) setInternal(upcoming)

      // TODO: 这里的 if else 可读性太差，可以考虑使用一个辅助函数来处理值
      if (isMultiple) {
        const emit = onValueChange as ((value: string[]) => void) | undefined
        emit?.(upcoming)
      } else {
        const emit = onValueChange as ((value: string) => void) | undefined
        emit?.(upcoming[0] ?? '')
        setOpen(false)
      }

      // 单选选中后关闭面板
      if (!isMultiple) {
        setOpen(false)
      }
    },
    [controlled, onValueChange, setOpen, isMultiple, setOpen, values],
  )

  /** 依赖具体方法而不是整个 actions 对象，避免对象换引用导致选项反复登记。 */
  const register = useCallback(
    (v: string, label: string) => {
      setLabel(v, label)
    },
    [setLabel],
  )

  const unregister = useCallback(
    (v: string) => {
      removeLabel(v)
    },
    [removeLabel],
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
