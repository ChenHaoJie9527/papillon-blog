import type { ModalSize } from './types'

/**
 * Dialog 专用宽度。必须带上对应的 `sm:max-w-*`，才能盖掉 DialogContent 默认的 `sm:max-w-lg`。
 * 抽屉忽略这些 class。
 */
export const modalSizeClass: Record<ModalSize, string> = {
  sm: 'w-[calc(100%-2rem)] max-w-sm sm:max-w-sm',
  md: 'w-[calc(100%-2rem)] max-w-md sm:max-w-md min-[1025px]:max-w-lg',
  lg: 'w-[calc(100%-2rem)] max-w-xl sm:max-w-xl min-[1025px]:max-w-2xl',
}
