/**
 * 可与 matchMedia API 一起使用的有效 CSS 媒体查询类型
 * 基于 MDN Web Docs: https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries
 */

// 显示大小和视口查询
export type ViewportQueries =
  | `(width${string})`
  | `(min-width${string})`
  | `(max-width${string})`
  | `(height${string})`
  | `(min-height${string})`
  | `(max-height${string})`
  | `(aspect-ratio${string})`
  | `(min-aspect-ratio${string})`
  | `(max-aspect-ratio${string})`
  | `(orientation: landscape)`
  | `(orientation: portrait)`

// 显示质量查询
export type DisplayQueries =
  | `(resolution${string})`
  | `(min-resolution${string})`
  | `(max-resolution${string})`
  | `(device-pixel-ratio${string})`
  | `(min-device-pixel-ratio${string})`
  | `(max-device-pixel-ratio${string})`
  | `(color${string})`
  | `(min-color${string})`
  | `(max-color${string})`
  | `(color-gamut${string})`
  | `(color-index${string})`
  | `(min-color-index${string})`
  | `(max-color-index${string})`
  | `(monochrome${string})`
  | `(min-monochrome${string})`
  | `(max-monochrome${string})`
  | `(scan: progressive)`
  | `(scan: interlace)`
  | `(grid: 0)`
  | `(grid: 1)`
  | `(update: fast)`
  | `(update: slow)`
  | `(update: none)`
  | `(overflow-block: none)`
  | `(overflow-block: scroll)`
  | `(overflow-block: paged)`
  | `(overflow-inline: none)`
  | `(overflow-inline: scroll)`
  | `(display-mode: fullscreen)`
  | `(display-mode: standalone)`
  | `(display-mode: minimal-ui)`
  | `(display-mode: browser)`

// 常见断点查询（预定义方便使用）
export type BreakpointQueries =
  | `(max-width: ${number}px)`
  | `(min-width: ${number}px)`
  | `(max-height: ${number}px)`
  | `(min-height: ${number}px)`

// 所有有效媒体查询的组合类型
export type ValidMediaQuery =
  | ViewportQueries
  | DisplayQueries
  | BreakpointQueries
  | `(${string})` // Allow any valid CSS media query string

// 复杂媒体查询类型，包含逻辑运算符
export type ComplexMediaQuery =
  | ValidMediaQuery
  | `${ValidMediaQuery} and ${ValidMediaQuery}`
  | `${ValidMediaQuery} or ${ValidMediaQuery}`
  | `not ${ValidMediaQuery}`

// 最终类型，包含所有可能的媒体查询组合
export type MediaQueryString = ComplexMediaQuery

// 常见媒体查询预设（方便使用）
export const MediaQueryPresets = {
  mobile: '(max-width: 640px)', // 移动端：≤ 640px (sm)
  tablet: '(min-width: 641px) and (max-width: 1024px)', // 平板：641px - 1024px
  desktop: '(min-width: 1025px)', // 桌面端：≥ 1025px (lg+)
  largeDesktop: '(min-width: 1440px)', // 大桌面：≥ 1440px (2xl)

  // Orientation
  landscape: '(orientation: landscape)',
  portrait: '(orientation: portrait)',

  // User preferences
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)',
  reducedData: '(prefers-reduced-data: reduce)',

  // Interaction
  touchDevice: '(pointer: coarse)',
  mouseDevice: '(pointer: fine)',
  hoverCapable: '(hover: hover)',

  // Display
  highDPI: '(min-resolution: 2dppx)',
  retina: '(min-device-pixel-ratio: 2)',
} as const

export type MediaQueryPreset = keyof typeof MediaQueryPresets
