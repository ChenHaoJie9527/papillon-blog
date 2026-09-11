import {
  loadShikiTheme,
  type BundledShikiTheme,
  type ExpressiveCodeTheme,
} from 'astro-expressive-code'
import type { ThemeId } from '@types'
import { CYBERPUNK_GOLD_ID, loadCyberpunkGoldTheme } from './cyberpunk-gold'

export { CYBERPUNK_GOLD_ID, loadCyberpunkGoldTheme }

export function isCustomThemeId(themeId: string): themeId is typeof CYBERPUNK_GOLD_ID {
  return themeId === CYBERPUNK_GOLD_ID
}

export async function loadAnyTheme(themeId: ThemeId): Promise<ExpressiveCodeTheme> {
  if (isCustomThemeId(themeId)) {
    return loadCyberpunkGoldTheme()
  }
  return loadShikiTheme(themeId as BundledShikiTheme)
}

export async function resolveExpressiveCodeThemes(
  themeIds: ThemeId[],
): Promise<(BundledShikiTheme | ExpressiveCodeTheme)[]> {
  return Promise.all(
    themeIds.map((themeId) =>
      isCustomThemeId(themeId) ? loadCyberpunkGoldTheme() : (themeId as BundledShikiTheme),
    ),
  )
}
