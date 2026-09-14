import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { EASE_OUT } from '@components/lib/select-ease'
import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import {
  FLIP_SAFE_GAP,
  NEAR_GAP,
  gapTransition,
  initialTransition,
  listVariants,
} from './motion'
import type { SelectContentProps } from './types'

/**
 * 选项面板：绝对定位在触发器上方或下方，用 height 弹簧做展开 / 收起。
 *
 * ## 为何关闭后仍挂载 children
 * 打开只动画面板高度，不卸载 `SelectItem`。否则 `unregister` 会清掉 label，
 * 触发器上的 `SelectValue` 会在关闭瞬间掉回占位符。
 *
 * ## 翻转
 * 打开时量一次视口：下方放不下（高度 + 16px 安全距）且上方更宽裕 → `placement: 'top'`。
 *
 * ## 近侧 / 远侧
 * 朝向触发器的一侧叫近侧：打开时缝隙从 0→8。远侧 margin 为 0。
 * 两侧 margin 每次都写全，避免 `placement` 翻转后留下旧边距。
 * 圆角只走 className（默认 `rounded-xl`），不写 inline `border-radius`。
 *
 * ## 减少动态效果
 * 只做透明度和高度的短过渡，不做缝隙弹簧。
 */
export function SelectContent({ className, children }: SelectContentProps) {
  const ctx = useSelectContext('SelectContent')
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const open = ctx.open
  const { setPlacement } = ctx

  useLayoutEffect(() => {
    const node = innerRef.current
    if (!node) return

    const measure = () => {
      setHeight(node.offsetHeight)
      setVisibleCount(node.querySelectorAll('li:not([hidden])').length)
    }
    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(node)
    return () => observer.disconnect()
  }, [ctx.query, children])

  useLayoutEffect(() => {
    if (!open) return
    const trigger = document.getElementById(ctx.triggerId)
    const node = innerRef.current
    if (!trigger || !node) return

    const rect = trigger.getBoundingClientRect()
    const h = node.offsetHeight
    const below = window.innerHeight - rect.bottom
    const above = rect.top
    setPlacement?.(below < h + FLIP_SAFE_GAP && above > below ? 'top' : 'bottom')
  }, [open, ctx.triggerId, setPlacement])

  const isTop = ctx.placement === 'top'
  const nearGap = open ? NEAR_GAP : 0
  const gapT = gapTransition(open)

  const animate = ctx.reduce
    ? { opacity: open ? 1 : 0, height: open ? height : 0 }
    : {
        opacity: open ? 1 : 0,
        height: open ? height : 0,
        marginTop: isTop ? 0 : nearGap,
        marginBottom: isTop ? nearGap : 0,
      }

  const transition = ctx.reduce
    ? { duration: 0.12 }
    : {
        opacity: open ? { duration: 0.18 } : { duration: 0.16, delay: 0.12 },
        height: open
          ? { type: 'spring', duration: 0.42, bounce: 0.14 }
          : { duration: 0.26, ease: EASE_OUT, delay: 0.14 },
        marginTop: isTop ? initialTransition : gapT,
        marginBottom: isTop ? gapT : initialTransition,
      }

  return (
    <motion.div
      id={ctx.listId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      aria-hidden={!open}
      aria-multiselectable={ctx.multiple || undefined}
      inert={!open}
      data-open={open}
      data-placement={ctx.placement}
      initial={false}
      animate={animate}
      transition={transition}
      style={{
        transformOrigin: isTop ? 'bottom' : 'top',
        overflow: 'hidden',
        pointerEvents: open ? 'auto' : 'none',
      }}
      className={cn(
        'absolute left-0 right-0 z-20 rounded-lg border border-border bg-background shadow-lg',
        isTop ? 'bottom-full' : 'top-full',
        className,
      )}
    >
      <motion.div
        ref={innerRef}
        variants={ctx.reduce ? undefined : listVariants}
        initial={false}
        animate={open ? 'show' : 'hidden'}
        className="max-h-60 overflow-y-auto p-1"
      >
        {children}
        {ctx.searchable && ctx.query.trim() !== '' && visibleCount === 0 && (
          <p
            data-slot="select-empty"
            className="px-2.5 py-2 text-center text-sm text-muted-foreground"
          >
            无匹配项
          </p>
        )}
      </motion.div>
    </motion.div>
  )
}
