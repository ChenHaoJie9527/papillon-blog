import { ExpressiveCodeTheme, loadShikiTheme } from 'astro-expressive-code'
import type { ColorStyles } from '@types'

export const CYBERPUNK_GOLD_ID = 'cyberpunk-gold' as const

/** Night City: warm black + gold, cyan as the cyber secondary. */
export const cyberpunkGoldColors: Pick<
  ColorStyles,
  | 'background'
  | 'foreground'
  | 'accent'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'a'
  | 'blue'
  | 'green'
  | 'red'
  | 'yellow'
  | 'magenta'
  | 'cyan'
  | 'comment'
  | 'keyword'
  | 'string'
  | 'variable'
> = {
  background: '#100e0a',
  foreground: '#efe6c8',
  accent: '#f5c518',
  h1: '#f5c518',
  h2: '#ffcc33',
  h3: '#ffb347',
  a: '#00e5ff',
  blue: '#00e5ff',
  green: '#3dff9a',
  red: '#ff3355',
  yellow: '#ffcc33',
  magenta: '#ff2a6d',
  cyan: '#5ce1ff',
  comment: '#8a7a58',
  keyword: '#ffcc33',
  string: '#f0d080',
  variable: '#efe6c8',
}

const HOUSTON_TO_GOLD: [string, string][] = [
  ['4bf3c8', 'f5c518'],
  ['31c19c', 'c9a227'],
  ['54b9ff', '00e5ff'],
  ['00daef', '5ce1ff'],
  ['24c0cf', '2bb8c9'],
  ['2b7eca', '1a8aa8'],
  ['5495d7', '1aa8c4'],
  ['75beff', '66eeff'],
  ['3794ff', '33d6ff'],
  ['ffd493', 'ffcc33'],
  ['ffc368', 'f0b429'],
  ['fbc23b', 'f5c518'],
  ['cc75f4', 'ff2a6d'],
  ['ad5dca', 'd41d6d'],
  ['acafff', 'ffb347'],
  ['f4587e', 'ff3355'],
  ['f06788', 'ff4d6d'],
  ['dc3657', 'e11d48'],
  ['17191e', '100e0a'],
  ['23262d', '1a160f'],
  ['343841', '2a2418'],
  ['2a2d34', '221c14'],
  ['eef0f9', 'efe6c8'],
  ['545864', '5c4e32'],
  ['858b98', '8a7a58'],
  ['bfc1c9', 'c4b896'],
  ['cccccc', 'd9d0b8'],
  ['17548b', '3d2e08'],
  ['6c3c7d', '5c1a38'],
  ['001f33', '0a1e22'],
  ['062f4a', '0b2a2e'],
  ['2d4860', '3d3518'],
]

function remapColor(value: string): string {
  let next = value
  for (const [from, to] of HOUSTON_TO_GOLD) {
    next = next.replace(new RegExp(from, 'gi'), to)
  }
  return next
}

export async function loadCyberpunkGoldTheme(): Promise<ExpressiveCodeTheme> {
  const base = await loadShikiTheme('houston')
  const theme = new ExpressiveCodeTheme(base)
  theme.name = CYBERPUNK_GOLD_ID
  theme.bg = cyberpunkGoldColors.background
  theme.fg = cyberpunkGoldColors.foreground

  const colors = theme.colors as Record<string, string>
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string') {
      colors[key] = remapColor(value)
    }
  }
  colors['editor.background'] = cyberpunkGoldColors.background
  colors['editor.foreground'] = cyberpunkGoldColors.foreground

  for (const setting of theme.settings) {
    if (setting.settings.foreground) {
      setting.settings.foreground = remapColor(setting.settings.foreground)
    }
  }

  theme.ensureMinSyntaxHighlightingColorContrast(5.5, cyberpunkGoldColors.background)
  return theme
}
