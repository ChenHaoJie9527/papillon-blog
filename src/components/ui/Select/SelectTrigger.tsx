import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import { chevronTransition } from './motion'
import type { SelectTriggerProps } from './types'

/**
 * 打开 / 关闭面板的控件。
 *
 * ## 不可搜索
 * 整块是 `button`：`aria-haspopup="listbox"` + `aria-expanded`，点击 toggle。
 *
 * ## 可搜索
 * 外层改成 `div`，真正的 combobox 是 `SelectValue` 里的 input。
 * 点字段只打开并 focus 输入框；点 Chevron 才 toggle。
 */
export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const ctx = useSelectContext('SelectTrigger')

  const surfaceClassName = cn(
    'relative z-10 flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors',
    'hover:border-(--color-border-strong)',
    ctx.searchable ? undefined : 'focus-visible:ring-2 focus-visible:ring-foreground/20',
    ctx.searchable
      ? ctx.disabled && 'pointer-events-none opacity-50'
      : 'disabled:pointer-events-none disabled:opacity-50',
    className,
  )

  const chevron = (
    <motion.span
      aria-hidden={true}
      animate={{ rotate: ctx.open ? 180 : 0 }}
      transition={ctx.reduce ? { duration: 0 } : chevronTransition}
      className="text-muted-foreground"
    >
      <ChevronDown className="w-4 h-4" />
    </motion.span>
  )

  if (!ctx.searchable) {
    return (
      <button
        type="button"
        id={ctx.triggerId}
        disabled={ctx.disabled}
        data-open={ctx.open}
        data-placement={ctx.placement}
        aria-haspopup="listbox"
        aria-expanded={ctx.open}
        aria-controls={ctx.listId}
        onClick={() => ctx.setOpen(!ctx.open)}
        className={surfaceClassName}
      >
        <span className="flex min-w-0 flex-1 items-center">{children}</span>
        {chevron}
      </button>
    )
  }

  return (
    <div
      id={ctx.triggerId}
      data-open={ctx.open}
      data-placement={ctx.placement}
      aria-disabled={ctx.disabled || undefined}
      onClick={() => {
        if (ctx.disabled) return
        if (!ctx.open) ctx.setOpen(true)
        ctx.searchInputRef.current?.focus()
      }}
      className={surfaceClassName}
    >
      <span className="flex min-w-0 flex-1 items-center">{children}</span>
      <button
        type="button"
        tabIndex={-1}
        aria-label="打开或关闭选项"
        disabled={ctx.disabled}
        onPointerDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
          const next = !ctx.open
          ctx.setOpen(next)
          if (next) ctx.searchInputRef.current?.focus()
        }}
        className="shrink-0"
      >
        {chevron}
      </button>
    </div>
  )
}
