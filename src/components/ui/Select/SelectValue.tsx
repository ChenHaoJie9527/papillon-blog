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
export function SelectValue(props: SelectValueProps) {
  const ctx = useSelectContext('SelectValue')

  return ctx.searchable ? (
    <SelectValueSearchable {...props} />
  ) : (
    <SelectValueStatic {...props} />
  )
}

function SelectValueStatic({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext('SelectValue')
  const values = ctx.values ?? []
  if (!values || values.length === 0) {
    return (
      <span
        className={cn('min-w-0 truncate text-muted-foreground opacity-45', className)}
      >
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

function SelectValueSearchable({ placeholder, className }: SelectValueProps) {
  const ctx = useSelectContext('SelectValue')
  const values = ctx.values ?? []
  const placeholderText =
    values.length === 0 && ctx.query === '' ? placeholder || 'Select' : undefined
  // 单选模式下的值展示
  const showSingleLabel =
    !ctx.multiple && values.length > 0 && !ctx.open && ctx.query === ''

  // 多选模式下的值展示
  if (ctx.multiple) {
    const tags = values.map((v) => <SelectTag key={v}>{ctx.labelFor(v) ?? v}</SelectTag>)
    return (
      <span
        className={cn(
          'relative flex min-w-0 flex-1 flex-wrap items-center gap-1',
          className,
        )}
      >
        {ctx.reduce ? (
          tags
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {tags}
          </AnimatePresence>
        )}
        <SelectSearchInput placeholder={placeholderText} />
      </span>
    )
  }

  return (
    <span className={cn('relative flex min-w-0 flex-1 items-center', className)}>
      {showSingleLabel && (
        <span className="pointer-events-none absolute inset-0 truncate text-foreground">
          {ctx.labelFor(values[0]) ?? values[0]}
        </span>
      )}
      <SelectSearchInput placeholder={placeholderText} transparent={showSingleLabel} />
    </span>
  )
}

/**
 * 搜索模式下的输入框
 * @param placeholder 输入框的 placeholder
 * @param transparent 输入框是否透明
 * @returns
 */
function SelectSearchInput({
  placeholder,
  transparent = false,
}: {
  placeholder?: string
  transparent?: boolean
}) {
  const ctx = useSelectContext('SelectSearchInput')
  const values = ctx.values ?? []

  return (
    <input
      ref={ctx.searchInputRef}
      role="combobox"
      aria-expanded={ctx.open}
      aria-controls={ctx.listId}
      aria-autocomplete="list"
      aria-haspopup="listbox"
      disabled={ctx.disabled}
      autoComplete="off"
      value={ctx.query}
      placeholder={placeholder}
      onChange={(e) => {
        ctx.setQuery(e.target.value)
        if (!ctx.open) ctx.setOpen(true)
      }}
      onFocus={() => {
        if (!ctx.open) ctx.setOpen(true)
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Backspace') return
        if (!ctx.multiple || ctx.query !== '') return
        const last = values.at(-1)
        if (last) ctx.select(last)
      }}
      className={cn(
        'min-w-8 flex-1 appearance-none border-0 bg-transparent p-0 text-sm shadow-none',
        'outline-none  focus:!outline-none focus-visible:!outline-none focus-visible:!outline-offset-0',
        transparent && 'text-transparent caret-foreground',
      )}
    />
  )
}
