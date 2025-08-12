import { useEffect, useLayoutEffect, useState } from 'react'
import type { MediaQueryString, MediaQueryPreset } from './mediaQueryTypes'
import { MediaQueryPresets } from './mediaQueryTypes'

// 使用同构布局效果避免服务器端渲染（SSR）问题
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// 服务器端检测
const IS_SERVER = typeof window === 'undefined'

// 钩子选项类型
type UseMediaQueryOptions = {
  /**
   * 服务器端渲染时的默认值
   * @default false
   */
  defaultValue?: boolean
  /**
   * 是否在初始化时读取媒体查询状态
   * 在SSR时应该设置为false，返回options.defaultValue或false
   * @default true
   */
  initializeWithValue?: boolean
}

/**
 * 自定义钩子，封装matchMedia API以监听媒体查询变化
 *
 * @example
 * ```tsx
 * // 使用预设（带有类型提示）
 * const isMobile = useMediaQuery('mobile');
 * const isDarkMode = useMediaQuery('darkMode');
 *
 * // 使用自定义查询
 * const isLargeScreen = useMediaQuery('(min-width: 1440px)');
 * const isTouchDevice = useMediaQuery('(pointer: coarse)');
 *
 * // 使用选项
 * const isMobile = useMediaQuery('mobile', {
 *   defaultValue: true,
 *   initializeWithValue: false
 * });
 * ```
 */

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
// 实现签名
export function useMediaQuery(
  query: MediaQueryString | MediaQueryPreset,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
): boolean {
  // 解析预设为实际查询字符串
  const actualQuery = MediaQueryPresets[query as MediaQueryPreset] || query

  // 获取匹配状态函数
  const getMatches = (_query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(_query).matches
  }

  // 初始化状态
  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(actualQuery)
    }
    return defaultValue
  })

  // 处理媒体查询变化
  const handleChange = () => {
    setMatches(getMatches(actualQuery))
  }

  // 使用同构布局效果避免服务器端渲染（SSR）问题
  useIsomorphicLayoutEffect(() => {
    if (IS_SERVER) {
      return
    }

    const matchMedia = window.matchMedia(actualQuery)

    // 在初始客户端加载和查询变化时触发
    handleChange()

    // 使用addListener和removeListener支持Safari < 14
    if (matchMedia.addListener) {
      matchMedia.addListener(handleChange)
    } else {
      matchMedia.addEventListener('change', handleChange)
    }

    // 清理函数
    return () => {
      if (matchMedia.removeListener) {
        matchMedia.removeListener(handleChange)
      } else {
        matchMedia.removeEventListener('change', handleChange)
      }
    }
  }, [actualQuery])

  return matches
}
