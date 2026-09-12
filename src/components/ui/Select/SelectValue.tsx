import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import type { SelectValueProps } from './types'

/**
 * 触发器内的当前值展示。
 *
 * 文案来源：`SelectItem` 挂载时通过 `register` 写入的 label Map。
 * 尚未选中（或对应项尚未注册）时显示 `placeholder`，再缺省则 `"Select"`。
 *
 * 有值用前景色，占位符用 muted，避免「看起来像已选中」。
 */
export function SelectValue({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext('SelectValue')
  const label = ctx.labelFor(ctx.value)

  return (
    <span className={cn(label ? 'text-foreground' : 'text-muted-foreground', className)}>
      {label ?? placeholder ?? 'Select'}
    </span>
  )
}
