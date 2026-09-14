/**
 * 复合 Select：根组件持有状态，子组件通过上下文协作。
 *
 * 组合顺序通常为：
 * `Select` → `SelectTrigger`（内嵌 `SelectValue`）+ `SelectContent`（内嵌若干 `SelectItem`）。
 *
 * 从本目录导入即可，不必深入各个文件：
 * `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@components/ui/Select'`
 */

export { Select } from './Select'
export { SelectTrigger } from './SelectTrigger'
export { SelectValue } from './SelectValue'
export { SelectContent } from './SelectContent'
export { SelectItem } from './SelectItem'
export { SelectTag } from './SelectTag'

export type {
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
} from './types'
export type { SelectFilterFn } from './utils'
