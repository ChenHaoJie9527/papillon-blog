import type { HTMLAttributes, ReactNode } from 'react'

/**
 * 下拉面板相对触发器的摆放方向。
 *
 * - `bottom`：面板从触发器下方展开（默认）。
 * - `top`：视口下方空间不足、上方更宽裕时，由 `SelectContent` 翻转到触发器上方。
 *
 * 放置方向会同时影响：
 * 1. 面板的绝对定位锚点（`top-full` / `bottom-full`）
 * 2. 缝隙（margin）打开的一侧
 * 3. `data-placement`，供 className 按方向覆盖圆角等样式
 */
export type Placement = 'bottom' | 'top'

/**
 * Select 内部共享状态。
 *
 * 子组件不直接持有选中值 / 开关，全部通过该上下文协作：
 * - `SelectTrigger` 负责开关；圆角由 className 控制
 * - `SelectValue` 根据 `labelFor` 显示当前项文案
 * - `SelectItem` 注册文案、提交选中值
 * - `SelectContent` 测量高度、决定翻转方向
 */
export interface SelectContextValue {
  /** 当前选中值；未选中时为 `undefined`。 */
  value?: string
  /** 面板是否展开。 */
  open: boolean
  /** 更新展开状态。受控模式下只通知外部，不写内部 state。 */
  setOpen: (open: boolean) => void
  /** 选中一项：更新值并关闭面板。 */
  select: (value: string) => void
  /**
   * 选项挂载时把自己的 `value → label` 登记进 Map。
   * 面板关闭后选项仍保持挂载，登记不会丢失，触发器才不会回落到占位符。
   */
  register: (value: string, label: string) => void
  /** 选项卸载时从 Map 中移除对应条目。 */
  unregister: (value: string) => void
  /** 用选中值查出展示文案。值为空时返回 `undefined`。 */
  labelFor: (value?: string) => string | undefined
  /**
   * 是否遵循系统「减少动态效果」。
   * 为 `true` 时各子组件将过渡时长压到 0 或极短淡入淡出。
   */
  reduce: boolean
  /** 触发器 DOM id，用于 `aria-labelledby` / `aria-controls` 配对。 */
  triggerId: string
  /** 列表 DOM id，触发器用 `aria-controls` 指向它。 */
  listId: string
  /** 根级禁用：触发器不可点，选项仍可渲染。 */
  disabled: boolean
  /** 当前面板放置方向。 */
  placement: Placement
  /** 由 `SelectContent` 在打开时根据视口剩余空间写入。 */
  setPlacement?: (placement: Placement) => void
}

/**
 * 根组件属性。
 *
 * 值与打开状态各自支持受控 / 非受控：
 * - 传入 `value` → 选中值受控
 * - 传入 `open` → 面板开关受控
 *
 * 多个 Select 纵向堆叠时，面板是绝对定位的，同时打开会互相遮挡。
 * 这时应由父级持有 `open`，保证同一时刻只有一个面板展开。
 */
export interface SelectProps extends HTMLAttributes<HTMLDivElement> {
  /** 受控选中值。 */
  value?: string
  /** 非受控初始选中值。 */
  defaultValue?: string
  /** 选中值变化时回调。受控与非受控都会触发。 */
  onValueChange?: (value: string) => void
  /**
   * 受控的面板打开状态。
   * 堆叠布局可由父级持有该状态，避免两个绝对定位面板互相覆盖。
   */
  open?: boolean
  /** 非受控的初始打开状态。默认 `false`。 */
  defaultOpen?: boolean
  /**
   * 面板打开或关闭时触发。
   * 堆叠选择器需要据此决定哪个邻居要画在上面。
   */
  onOpenChange?: (open: boolean) => void
  /** 禁用整个选择器。 */
  disabled?: boolean
  className?: string
  children: ReactNode
}

export interface SelectTriggerProps {
  className?: string
  children: ReactNode
}

export interface SelectValueProps {
  /** 尚未选中时显示的占位文案。缺省为 `"Select"`。 */
  placeholder?: string
  className?: string
}

export interface SelectContentProps {
  className?: string
  children: ReactNode
}

export interface SelectItemProps {
  /** 选项的机器可读值，选中后写入上下文。 */
  value: string
  /** 禁用该项：不可点击，仍会注册 label。 */
  disabled?: boolean
  className?: string
  /**
   * 展示内容。若为纯字符串，会同时作为触发器上的 label；
   * 否则退回使用 `value` 作为 label。
   */
  children: ReactNode
}
