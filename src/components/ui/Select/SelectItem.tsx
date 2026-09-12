import { useLayoutEffect } from 'react'
import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import { itemVariants } from './motion'
import type { SelectItemProps } from './types'

/**
 * 列表中的一项。
 *
 * ## 标签登记
 * 在 layout effect 里把 `value → label` 登记到根组件。
 * `children` 为字符串时用它做 label（触发器展示更友好）；否则用 `value`。
 *
 * 依赖里只列 `register` / `unregister` 引用（根组件用 `useCallback` 固定），
 * 避免把整个 context 对象放进依赖导致每次父渲染都重新登记。
 *
 * ## 无障碍
 * 外层是 `motion.li` 以配合 listbox；真正可聚焦的是内部 `role="option"` 按钮。
 * 选中项展示勾选图标，并用 `aria-selected` 同步给辅助技术。
 */
export function SelectItem({ value, disabled, className, children }: SelectItemProps) {
  const ctx = useSelectContext('SelectItem')
  const selected = ctx.value === value
  const label = typeof children === 'string' ? children : value

  useLayoutEffect(() => {
    ctx.register(value, label)
    return () => {
      ctx.unregister(value)
    }
  }, [ctx.register, ctx.unregister, value, label])

  return (
    <motion.li variants={ctx.reduce ? undefined : itemVariants}>
      <button
        type="button"
        role="option"
        aria-selected={selected}
        disabled={disabled}
        onClick={() => ctx.select(value)}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-sm outline-none transition-colors',
          selected
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:bg-muted',
          'disabled:pointer-events-none disabled:opacity-50',
          className,
        )}
      >
        {children}
        {selected && <Check className="w-4 h-4" />}
      </button>
    </motion.li>
  )
}
