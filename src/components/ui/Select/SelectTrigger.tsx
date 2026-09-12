import { ChevronDown } from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import {
  CORNER_RADIUS,
  chevronTransition,
  initialTransition,
  triggerRadiusKeyframes,
  triggerRadiusTransition,
} from './motion'
import type { SelectTriggerProps } from './types'

/**
 * 打开 / 关闭面板的按钮。
 *
 * ## 无障碍
 * - `aria-haspopup="listbox"` + `aria-expanded` 声明这是列表框触发器
 * - `aria-controls` 指向 `SelectContent` 的 `listId`
 *
 * ## 圆角动画
 * 面板贴着触发器一侧展开时，二者「近侧」要先变成直角再分开成圆角胶囊。
 * 放置在下方时动画下圆角；翻转到上方时动画上圆角。远侧始终保持 `CORNER_RADIUS`，
 * 并用 `initialTransition`（duration: 0）避免翻转瞬间出现孤立的方角。
 */
export function SelectTrigger({ className, children }: SelectTriggerProps) {
  const ctx = useSelectContext('SelectTrigger')
  const isTop = ctx.placement === 'top'
  const kf = triggerRadiusKeyframes(ctx.open)
  const kft = triggerRadiusTransition(ctx.open, ctx.reduce)

  return (
    <motion.button
      type="button"
      id={ctx.triggerId}
      disabled={ctx.disabled}
      aria-haspopup="listbox"
      aria-expanded={ctx.open}
      aria-controls={ctx.listId}
      onClick={() => ctx.setOpen(!ctx.open)}
      initial={false}
      animate={{
        borderTopLeftRadius: isTop ? kf : CORNER_RADIUS,
        borderTopRightRadius: isTop ? kf : CORNER_RADIUS,
        borderBottomLeftRadius: isTop ? CORNER_RADIUS : kf,
        borderBottomRightRadius: isTop ? CORNER_RADIUS : kf,
      }}
      transition={{
        borderTopLeftRadius: isTop ? kft : initialTransition,
        borderTopRightRadius: isTop ? kft : initialTransition,
        borderBottomLeftRadius: isTop ? initialTransition : kft,
        borderBottomRightRadius: isTop ? initialTransition : kft,
      }}
      className={cn(
        'relative z-10 flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors',
        'hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-foreground/20',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
    >
      {children}
      <motion.span
        aria-hidden={true}
        animate={{ rotate: ctx.open ? 180 : 0 }}
        transition={ctx.reduce ? { duration: 0 } : chevronTransition}
        className="text-muted-foreground"
      >
        <ChevronDown className="w-4 h-4" />
      </motion.span>
    </motion.button>
  )
}
