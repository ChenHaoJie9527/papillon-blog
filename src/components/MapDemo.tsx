'use client'

import { useId, useState, type FormEvent } from 'react'
import { useMap } from '../hooks/useMap'
import { DemoContainer } from './ui/DemoContainer'

const fruits: [string, string][] = [
  ['apple', '苹果'],
  ['pear', '梨'],
  ['orange', '橙子'],
]

const animals: [string, string][] = [
  ['cat', '猫'],
  ['dog', '狗'],
  ['bird', '鸟'],
]

function MapEntries<K, V>({
  map,
  onRemove,
}: {
  map: Omit<Map<K, V>, 'set' | 'clear' | 'delete'>
  onRemove?: (key: K) => void
}) {
  const entries = [...map.entries()]

  if (entries.length === 0) {
    return <p className="text-sm text-foreground/50">当前 Map 为空</p>
  }

  return (
    <ul className="space-y-2">
      {entries.map(([key, value]) => (
        <li
          key={String(key)}
          className="flex items-center justify-between gap-3 rounded-lg border border-foreground/10 px-3 py-2 text-sm"
        >
          <div className="min-w-0">
            <p className="font-mono text-accent truncate">{String(key)}</p>
            <p className="text-foreground/80 truncate">{String(value)}</p>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(key)}
              className="shrink-0 px-2 py-1 text-sm border border-foreground/20 rounded-lg hover:bg-foreground/10 transition-colors"
            >
              删除
            </button>
          )}
        </li>
      ))}
    </ul>
  )
}

/**
 * 基础增删改演示
 */
export function BasicMapDemo() {
  const keyId = useId()
  const valueId = useId()
  const [map, { set, remove, reset }] = useMap<string, string>()
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextKey = key.trim()
    if (!nextKey) return
    set(nextKey, value.trim())
    setKey('')
    setValue('')
  }

  return (
    <DemoContainer>
      <div className="space-y-4">
        <form className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
          <div>
            <label htmlFor={keyId} className="block text-sm font-medium mb-2">
              Key
            </label>
            <input
              id={keyId}
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="例如 userId"
              className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background/50"
            />
          </div>
          <div>
            <label htmlFor={valueId} className="block text-sm font-medium mb-2">
              Value
            </label>
            <input
              id={valueId}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="例如 Bob"
              className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background/50"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!key.trim()}
              className="w-full sm:w-auto px-4 py-2 border border-accent rounded-lg transition-colors hover:bg-accent/10 disabled:opacity-50 disabled:pointer-events-none"
            >
              添加 / 更新
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between text-sm text-foreground/70">
          <p>
            size: <span className="text-accent font-mono">{map.size}</span>
          </p>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 border border-foreground/20 rounded-lg hover:bg-foreground/10 transition-colors"
          >
            重置
          </button>
        </div>

        <MapEntries map={map} onRemove={remove} />
      </div>
    </DemoContainer>
  )
}

/**
 * 初始化与批量替换演示
 */
export function SetAllMapDemo() {
  const [map, { setAll, reset }] = useMap<string, string>(fruits)

  return (
    <DemoContainer>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setAll(fruits)}
            className="px-3 py-1.5 text-sm border border-accent rounded-lg hover:bg-accent/10 transition-colors"
          >
            换成水果
          </button>
          <button
            type="button"
            onClick={() => setAll(animals)}
            className="px-3 py-1.5 text-sm border border-accent rounded-lg hover:bg-accent/10 transition-colors"
          >
            换成动物
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-3 py-1.5 text-sm border border-foreground/20 rounded-lg hover:bg-foreground/10 transition-colors"
          >
            清空
          </button>
        </div>
        <p className="text-sm text-foreground/70">
          size: <span className="text-accent font-mono">{map.size}</span>
          <span className="mx-2">·</span>
          <code>setAll</code> 会用新条目整体替换，而不是合并。
        </p>
        <MapEntries map={map} />
      </div>
    </DemoContainer>
  )
}

/**
 * 用 Map 做查找表演示
 */
export function LookupMapDemo() {
  const queryId = useId()
  const [map] = useMap<string, string>(fruits)
  const [query, setQuery] = useState('apple')
  const label = map.get(query)

  return (
    <DemoContainer>
      <div className="space-y-4">
        <div>
          <label htmlFor={queryId} className="block text-sm font-medium mb-2">
            用 value 查 label
          </label>
          <input
            id={queryId}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="输入 apple / pear / orange"
            className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background/50"
          />
        </div>
        <p className="text-sm text-foreground/70">
          <code>{`map.get(${JSON.stringify(query)})`}</code> ={' '}
          <span className="text-accent font-mono">{label ?? 'undefined'}</span>
        </p>
        <MapEntries map={map} />
      </div>
    </DemoContainer>
  )
}
