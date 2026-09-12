// 共享的运动令牌。缓动曲线与全局 CSS 自定义属性相对应
// globals.css; 弹簧是组件之间使用的标准物理学。
// 强自定义变体 — 默认的 `ease-in`/`ease-out` 感觉很弱。

export const EASE_OUT = [0.16, 1, 0.3, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const

/** CSS 字符串形式为 EASE_OUT 用于内联样式过渡。 */
export const EASE_OUT_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)'

/** 按钮和其他可点击表面的按压反馈。 */
export const SPRING_PRESS = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const

/** 内容交换 — 标签/图标插槽在控件内部交换位置。 */
export const SPRING_SWAP = {
  type: 'spring',
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const

/** 覆盖面板入口 — 指针召唤的模态和表单。 */
export const SPRING_PANEL = {
  type: 'spring',
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const

/** 共享布局滑行 — 胶囊、指示器和面板在位置之间变形。 */
export const SPRING_LAYOUT = {
  type: 'spring',
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const

/** 光标跟随物理学用于装饰性鼠标跟踪（磁性、倾斜、停靠）。 */
export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const

/** 拖动的句柄和填充（滑块） — 临界阻尼 `useSpring` 配置，
 * 所以值跟随指针平滑且永远不会反弹到终点。
 * @see {@link https://motion.dev/docs/react-use-spring}
 */
export const SPRING_GLIDE = {
  stiffness: 700,
  damping: 50,
  mass: 0.5,
} as const
