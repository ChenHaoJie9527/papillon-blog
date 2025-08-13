---
title: 'useMediaQuery: 构建响应式 React 应用的强大 Hook'
published: 2025-08-13
draft: false
description: '深入探讨 useMediaQuery 自定义 Hook 的实现原理、SSR 兼容性处理、TypeScript 类型安全和实际应用场景，实现响应式布局'
tags: ['react', 'typescript', 'hooks']
---

在现代 Web 开发中，响应式设计已经成为标配。无论是适配不同屏幕尺寸、检测用户偏好设置，还是根据设备特性调整交互方式，媒体查询都扮演着关键角色。今天，我们将深入探讨一个功能强大的自定义 Hook —— `useMediaQuery`，它不仅能优雅地处理媒体查询，还完美支持 SSR 和 TypeScript。

## 为什么需要 useMediaQuery？

在 React 应用中，我们经常需要根据设备特性或用户偏好来调整界面和功能：

1. **响应式布局**：根据屏幕尺寸调整组件布局
2. **主题切换**：检测用户的深色/浅色模式偏好
3. **交互优化**：针对触摸设备和鼠标设备提供不同的交互方式
4. **性能优化**：根据设备能力调整功能复杂度

虽然我们可以直接使用 `window.matchMedia` API，但 `useMediaQuery` 提供了更优雅的解决方案。

## useMediaQuery 的核心特性

### 1. SSR 兼容性

```typescript
// 使用同构布局效果避免服务器端渲染（SSR）问题
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// 服务器端检测
const IS_SERVER = typeof window === 'undefined'
```

这个 Hook 完美解决了 SSR 环境下的水合问题，避免了服务器端和客户端状态不一致的情况。

### 2. TypeScript 类型安全

```typescript
// 函数重载 - 为预设提供精确的类型提示
export function useMediaQuery(
  query: MediaQueryPreset,
  options?: UseMediaQueryOptions,
): boolean

// 函数重载 - 为自定义查询提供类型检查
export function useMediaQuery(
  query: MediaQueryString,
  options?: UseMediaQueryOptions,
): boolean
```

通过函数重载和严格的类型定义，提供了完整的 TypeScript 支持。

### 3. 预设查询支持

```typescript
export const MediaQueryPresets = {
  mobile: '(max-width: 640px)',
  tablet: '(min-width: 641px) and (max-width: 1024px)',
  desktop: '(min-width: 1025px)',
  largeDesktop: '(min-width: 1440px)',

  // 用户偏好
  darkMode: '(prefers-color-scheme: dark)',
  lightMode: '(prefers-color-scheme: light)',
  reducedMotion: '(prefers-reduced-motion: reduce)',

  // 交互方式
  touchDevice: '(pointer: coarse)',
  mouseDevice: '(pointer: fine)',
  hoverCapable: '(hover: hover)',
} as const
```

提供了常用的媒体查询预设，让使用更加便捷。

## 实现原理深度解析

### 1. 同构布局效果

```typescript
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
```

这个技巧确保了在服务器端使用 `useEffect`，在客户端使用 `useLayoutEffect`，避免了 SSR 水合问题。

### 2. 状态初始化策略

```typescript
const [matches, setMatches] = useState<boolean>(() => {
  if (initializeWithValue) {
    return getMatches(actualQuery)
  }
  return defaultValue
})
```

通过 `initializeWithValue` 选项，我们可以控制是否在初始化时读取媒体查询状态，这对于 SSR 场景特别重要。

### 3. 事件监听优化

```typescript
// 使用addListener和removeListener支持Safari < 14
if (matchMedia.addListener) {
  matchMedia.addListener(handleChange)
} else {
  matchMedia.addEventListener('change', handleChange)
}
```

兼容了旧版 Safari 的 API，确保在所有浏览器中都能正常工作。

## 使用场景详解

### 1. 响应式组件渲染

```tsx
import { useMediaQuery } from '@hooks/useMediaQuery'

function ResponsiveLayout() {
  const isMobile = useMediaQuery('mobile')
  const isTablet = useMediaQuery('tablet')
  const isDesktop = useMediaQuery('desktop')

  if (isMobile) {
    return <MobileLayout />
  }

  if (isTablet) {
    return <TabletLayout />
  }

  return <DesktopLayout />
}
```

### 2. 主题切换

```tsx
function ThemeProvider({ children }) {
  const isDarkMode = useMediaQuery('darkMode', {
    defaultValue: false,
    initializeWithValue: false,
  })

  return <ThemeContext.Provider value={{ isDarkMode }}>{children}</ThemeContext.Provider>
}
```

### 3. 交互优化

```tsx
function InteractiveComponent() {
  const isTouchDevice = useMediaQuery('touchDevice')
  const isHoverCapable = useMediaQuery('hoverCapable')

  return (
    <div
      className={isTouchDevice ? 'touch-friendly' : 'mouse-friendly'}
      onMouseEnter={isHoverCapable ? handleHover : undefined}
    >
      {isTouchDevice ? '触摸友好界面' : '鼠标友好界面'}
    </div>
  )
}
```

### 4. 无障碍支持

```tsx
function AnimationComponent() {
  const prefersReducedMotion = useMediaQuery('reducedMotion')

  return (
    <div className={prefersReducedMotion ? 'no-animation' : 'with-animation'}>
      {prefersReducedMotion ? '静态内容' : '动画内容'}
    </div>
  )
}
```

### 5. 性能优化

```tsx
function HeavyComponent() {
  const isHighDPI = useMediaQuery('highDPI')
  const isLargeScreen = useMediaQuery('largeDesktop')

  // 只在大屏幕和高分辨率设备上加载高质量资源
  const shouldLoadHighQuality = isHighDPI && isLargeScreen

  return <div>{shouldLoadHighQuality ? <HighQualityContent /> : <StandardContent />}</div>
}
```

## 高级用法

### 1. 组合查询

```tsx
function ComplexResponsiveComponent() {
  const isMobile = useMediaQuery('mobile')
  const isDarkMode = useMediaQuery('darkMode')
  const isTouchDevice = useMediaQuery('touchDevice')

  // 组合多个条件
  const shouldShowMobileDarkUI = isMobile && isDarkMode && isTouchDevice

  return (
    <div className={shouldShowMobileDarkUI ? 'mobile-dark-touch' : 'default'}>内容</div>
  )
}
```

### 2. 自定义查询

```tsx
function CustomBreakpointComponent() {
  const isCustomBreakpoint = useMediaQuery('(min-width: 1200px) and (max-width: 1400px)')
  const isLandscape = useMediaQuery('(orientation: landscape)')

  return <div>{isCustomBreakpoint && isLandscape && <SpecialLayout />}</div>
}
```

### 3. SSR 优化配置

```tsx
function SSRCompatibleComponent() {
  // 在 SSR 时默认为桌面端，避免水合不匹配
  const isDesktop = useMediaQuery('desktop', {
    defaultValue: true,
    initializeWithValue: false,
  })

  return <div>{isDesktop ? <DesktopContent /> : <MobileContent />}</div>
}
```

## 性能优化建议

### 1. 避免过度使用

```tsx
// ❌ 不推荐：每个组件都使用多个媒体查询
function BadExample() {
  const isMobile = useMediaQuery('mobile')
  const isTablet = useMediaQuery('tablet')
  const isDesktop = useMediaQuery('desktop')
  const isLargeDesktop = useMediaQuery('largeDesktop')
  // ... 更多查询
}

// ✅ 推荐：使用组合逻辑
function GoodExample() {
  const isMobile = useMediaQuery('mobile')
  const isTablet = useMediaQuery('tablet')

  const deviceType = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
}
```

### 2. 合理使用预设

```tsx
// ✅ 推荐：使用预设查询
const isMobile = useMediaQuery('mobile')

// ❌ 不推荐：重复定义相同的查询
const isMobile = useMediaQuery('(max-width: 640px)')
```

### 3. 缓存查询结果

```tsx
function OptimizedComponent() {
  const isDesktop = useMediaQuery('desktop')

  // 使用 useMemo 缓存基于媒体查询的计算结果
  const layoutConfig = useMemo(() => {
    return isDesktop ? desktopConfig : mobileConfig
  }, [isDesktop])

  return <Layout config={layoutConfig} />
}
```

## 常见问题与解决方案

### 1. SSR 水合不匹配

```tsx
// 问题：服务器端和客户端渲染结果不一致
const isMobile = useMediaQuery('mobile') // 可能导致水合错误

// 解决方案：使用适当的默认值
const isMobile = useMediaQuery('mobile', {
  defaultValue: false,
  initializeWithValue: false,
})
```

### 2. 性能问题

```tsx
// 问题：频繁的媒体查询变化导致性能问题
const isMobile = useMediaQuery('mobile')
const isTablet = useMediaQuery('tablet')
const isDesktop = useMediaQuery('desktop')

// 解决方案：使用防抖或节流
const debouncedIsMobile = useDebounce(isMobile, 100)
```

### 3. 类型安全问题

```tsx
// 问题：自定义查询可能没有类型检查
const query = '(invalid-query)' // 没有类型检查

// 解决方案：使用类型安全的查询
const query: MediaQueryString = '(min-width: 768px)' // 有类型检查
```

## 总结

`useMediaQuery` Hook 为 React 应用提供了强大而灵活的媒体查询能力。它的主要优势包括：

1. **SSR 兼容性**：完美支持服务器端渲染
2. **TypeScript 支持**：完整的类型安全和智能提示
3. **预设查询**：提供常用的媒体查询预设
4. **性能优化**：避免不必要的重渲染
5. **浏览器兼容性**：支持旧版浏览器

记住，好的响应式设计不仅仅是适配不同屏幕尺寸，更重要的是根据设备特性和用户偏好提供最佳的用户体验。`useMediaQuery` 正是实现这一目标的有力工具。
