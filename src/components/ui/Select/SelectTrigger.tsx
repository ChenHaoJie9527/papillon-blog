import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import { chevronTransition } from './motion'
import type { SelectTriggerProps } from './types'

/**
 * 打开 / 关闭面板的按钮。
 *
 * ## 无障碍
 * - `aria-haspopup="listbox"` + `aria-expanded` 声明这是列表框触发器
 * - `aria-controls` 指向 `SelectContent` 的 `listId`
 *
 * ## 圆角
 * 默认 `rounded-lg`，由 className 覆盖（例如 `rounded-xl` / `rounded-2xl`）。
 * 开合只动 Chevron，不写 inline `border-radius`，避免盖掉 Tailwind。
 * 需要按打开方向改近侧圆角时，用 `data-open` / `data-placement` 自己写选择器。
 */
export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const ctx = useSelectContext('SelectTrigger')

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
      className={cn(
        'relative z-10 flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors',
        'hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-foreground/20',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      <span className="flex min-w-0 flex-1 items-center">{children}</span>

      <motion.span
        aria-hidden={true}
        animate={{ rotate: ctx.open ? 180 : 0 }}
        transition={ctx.reduce ? { duration: 0 } : chevronTransition}
        className="text-muted-foreground"
      >
        <ChevronDown className="w-4 h-4" />
      </motion.span>
    </button>
  )
}
