type PlanStatus = 'reserved' | 'todo'

interface PlanItem {
  title: string
  note: string
}

interface PlanGroup {
  id: string
  title: string
  status: PlanStatus
  order: string
  summary: string
  items: PlanItem[]
}

const statusLabel: Record<PlanStatus, string> = {
  reserved: '已预留 API',
  todo: '未开始',
}

const groups: PlanGroup[] = [
  {
    id: 'remote',
    title: '远程搜索',
    status: 'reserved',
    order: '01',
    summary: 'onSearch + filter={false} 已可把列表交给外部。组件内仍不发请求。',
    items: [
      { title: '防抖', note: '避免每个按键都打接口；可做 searchDebounce，或由调用方在 onSearch 里做。' },
      { title: 'Loading', note: '请求中展示加载态，与「无匹配」区分。' },
      { title: '请求竞态', note: '只采用最后一次 query 的结果，过期响应丢弃或 abort。' },
      { title: '失败态', note: '网络错误时的文案，避免被空列表误当成没有数据。' },
    ],
  },
  {
    id: 'keyboard',
    title: '键盘浏览',
    status: 'todo',
    order: '02',
    summary: '现有 Select 也没有方向键选中。搜索 Combobox 同样还没补。',
    items: [
      { title: '方向键高亮', note: '上下移动当前项，面板滚动跟随。' },
      { title: 'Enter 选中', note: '选中高亮项；单选关面板，多选保持打开。' },
      { title: 'aria-activedescendant', note: '把当前高亮项同步给辅助技术。' },
    ],
  },
  {
    id: 'tag',
    title: '多选 Tag 关闭',
    status: 'todo',
    order: '03',
    summary: '现在只能 Backspace 删最后一个，或再打开列表点掉。',
    items: [
      { title: 'Tag 上的 ×', note: '删除后焦点回到搜索框，避免光标丢失。' },
    ],
  },
  {
    id: 'slots',
    title: '空态 / 加载插槽',
    status: 'todo',
    order: '04',
    summary: '无匹配目前写在 Content 内部，远程 loading 还没有对应节点。',
    items: [
      { title: 'SelectEmpty', note: '可组合的空态，替换写死的「无匹配项」。' },
      { title: 'SelectLoading', note: '远程搜索转圈或骨架。' },
    ],
  },
  {
    id: 'extra',
    title: '其它',
    status: 'todo',
    order: '05',
    summary: '不影响本地搜索主路径，有需要再做。',
    items: [
      { title: '虚拟列表', note: '选项极多时只渲染可视区域。' },
      { title: '源码快照', note: 'custom-components.json 里的查看源码仍可能是旧实现。' },
    ],
  },
]

/**
 * Select 展柜上的后续计划表。本地 Combobox 已完成，这里列出还没做的能力。
 */
export function SelectPlan() {
  return (
    <section
      className="flex min-w-0 flex-col gap-3 rounded-lg border border-accent/20 bg-background/50 p-3 text-left sm:col-span-2"
      aria-labelledby="select-plan-heading"
    >
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="select-plan-heading" className="text-xs font-medium text-accent">
            <code>roadmap</code>
          </h2>
          <p className="font-mono text-[11px] text-foreground/50">5 groups · local search done</p>
        </div>
        <p className="text-xs text-foreground/70 text-pretty">
          本地搜索已落地。下面按建议实现顺序排列，不改变现有 searchable API。
        </p>
      </header>

      <ol className="flex flex-col gap-2">
        {groups.map((group) => (
          <li
            key={group.id}
            className="rounded-md border border-accent/15 bg-accent/5 px-2.5 py-2"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] text-accent/70">{group.order}</span>
              <h3 className="text-sm text-foreground">{group.title}</h3>
              <span
                className={
                  group.status === 'reserved'
                    ? 'rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] text-accent'
                    : 'rounded-full border border-foreground/20 px-1.5 py-0.5 text-[10px] text-foreground/60'
                }
              >
                {statusLabel[group.status]}
              </span>
            </div>
            <p className="mt-1 text-xs text-foreground/65 text-pretty">{group.summary}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {group.items.map((item) => (
                <li key={item.title} className="flex gap-2 text-xs">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground/35"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="text-foreground/90">{item.title}</span>
                    <span className="text-foreground/50"> — {item.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
