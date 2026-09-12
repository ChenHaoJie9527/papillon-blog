import { createContext, useContext } from 'react'
import type { SelectContextValue } from './types'

/**
 * Select 复合组件的内部上下文。
 * 不对外导出 Provider；只由根 `Select` 写入，子组件通过 `useSelectContext` 读取。
 */
export const SelectContext = createContext<SelectContextValue | null>(null)

/**
 * 读取 Select 上下文。
 *
 * @param component 调用方组件名，用于拼进错误信息，方便定位「在根组件外使用了子组件」。
 * @throws 未包裹在 `<Select>` 内时抛错。
 */
export function useSelectContext(component: string): SelectContextValue {
  const context = useContext(SelectContext)
  if (!context) {
    throw new Error(`${component} 必须放在 <Select> 内部使用`)
  }
  return context
}
