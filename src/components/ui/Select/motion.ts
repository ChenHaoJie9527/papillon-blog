import type { Transition, Variants } from 'motion/react'

/** 瞬时过渡：翻转放置方向时，远侧属性不应跟着动，用 duration: 0 锁死当前值。 */
export const initialTransition: Transition = {
  duration: 0,
}

/**
 * 触发器右侧 Chevron 的旋转弹簧。
 * 与面板展开编排同步，观感接近 bouncy-accordion：略带回弹，但时长控制在 0.4s。
 */
export const chevronTransition: Transition = {
  type: 'spring',
  duration: 0.4,
  bounce: 0.3,
}

/**
 * 选项列表的编排变体。
 * `staggerChildren` 让每一项依次入场；`delayChildren` 等面板高度弹簧先走一小段再开始。
 */
export const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.05 } },
}

/**
 * 单个选项的入场：轻微上移 + 透明度 + 模糊。
 * 关闭时回到 hidden；面板本身用 height 裁切，所以项即使仍挂载也看不见。
 */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: -6, filter: 'blur(3px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

/**
 * 多选 Tag 入场 / 退场。
 * scale 用短弹簧，opacity 用时长，避免透明度被弹簧顶过 1。
 * layout 只负责已有 Tag 给新项让位时的位移。
 */
export const tagTransition: Transition = {
  scale: { type: 'spring', duration: 0.32, bounce: 0.22 },
  opacity: { duration: 0.16 },
  layout: { type: 'spring', duration: 0.28, bounce: 0.12 },
}

/** 面板打开后，近侧（朝向触发器）拉开的缝隙（px）。 */
export const NEAR_GAP = 8

/** 判断翻转时，下方至少要多留出的安全边距（px）。 */
export const FLIP_SAFE_GAP = 16

/** 面板近侧缝隙弹簧：打开带回弹，关闭更快、几乎不弹。 */
export function gapTransition(open: boolean): Transition {
  return open
    ? { type: 'spring', duration: 0.6, bounce: 0.5, delay: 0.12 }
    : { type: 'spring', duration: 0.3, bounce: 0.1 }
}
