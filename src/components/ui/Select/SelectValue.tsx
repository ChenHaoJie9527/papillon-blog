import { AnimatePresence } from 'motion/react'
import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import type { SelectValueProps } from './types'
import { SelectTag } from './SelectTag'

/**
 * 触发器内的当前值展示。
 *
 * 文案来源：`SelectItem` 挂载时通过 `register` 写入的 label Map。
 * 尚未选中（或对应项尚未注册）时显示 `placeholder`，再缺省则 `"Select"`。
 *
 * 单选：纯文本。多选：每个 label 包一层 SelectTag；
 * 追加时做入场，已有 Tag 用 layout 让位。首屏已有的 Tag 不播动画。
 */
export function SelectValue({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext('SelectValue')
  const values = ctx.values ?? []

  if (values.length === 0) {
    return (
      <span className={cn('min-w-0 truncate text-muted-foreground', className)}>
        {placeholder || 'Select'}
      </span>
    )
  }

  if (!ctx.multiple) {
    const value = values[0]
    return (
      <span className={cn('min-w-0 truncate text-foreground', className)}>
        {ctx.labelFor(value) ?? value}
      </span>
    )
  }

  const tags = values.map((v) => <SelectTag key={v}>{ctx.labelFor(v) ?? v}</SelectTag>)

  return (
    <span className={cn('relative flex min-w-0 flex-1 flex-wrap gap-1', className)}>
      {ctx.reduce ? (
        tags
      ) : (
        <AnimatePresence initial={false} mode="popLayout">
          {tags}
        </AnimatePresence>
      )}
    </span>
  )
}
