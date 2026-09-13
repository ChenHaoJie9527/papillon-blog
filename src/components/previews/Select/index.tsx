import { useState, type ReactNode } from 'react'
import type { SelectProps } from '@components/ui/Select'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@components/ui/Select'
import { Apple, Wheat } from 'lucide-react'

const fruits = [
  { value: 'apple', label: '苹果' },
  { value: 'pear', label: '梨' },
  { value: 'banana', label: '香蕉' },
  { value: 'mango', label: '芒果' },
] as const

function FruitOptions({ disableValue }: { disableValue?: string }) {
  return (
    <>
      {fruits.map((fruit) => (
        <SelectItem
          key={fruit.value}
          value={fruit.value}
          disabled={fruit.value === disableValue}
        >
          {fruit.label}
        </SelectItem>
      ))}
    </>
  )
}

type FruitSelectProps = Omit<Extract<SelectProps, { multiple?: false }>, 'children'> & {
  disableValue?: string
}

function FruitSelect({ disableValue, ...props }: FruitSelectProps) {
  return (
    <Select className="w-full" {...props}>
      <SelectTrigger>
        <SelectValue placeholder="选择水果" />
      </SelectTrigger>
      <SelectContent>
        <FruitOptions disableValue={disableValue} />
      </SelectContent>
    </Select>
  )
}

function ApiCard({
  api,
  note,
  children,
  className = '',
}: {
  api: string
  note: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`flex min-w-[240px] flex-col gap-2 rounded-lg border border-accent/20 bg-background/50 p-3 text-left ${className}`}
    >
      <code className="text-xs font-medium text-accent">{api}</code>
      <p className="text-xs text-foreground/70 text-pretty">{note}</p>
      {children}
    </div>
  )
}

function Status({ children }: { children: ReactNode }) {
  return <p className="mt-1 font-mono text-[11px] text-foreground/60">{children}</p>
}

/** 非受控：defaultValue */
export function DefaultValueDemo() {
  const [last, setLast] = useState('apple')
  return (
    <ApiCard api="defaultValue / onValueChange" note="内部自己管选中值；变化时仍会回调。">
      <FruitSelect defaultValue="apple" onValueChange={setLast} />
      <Status>onValueChange → {last}</Status>
    </ApiCard>
  )
}

/** 占位符 */
export function PlaceholderDemo() {
  return (
    <ApiCard
      api="SelectValue placeholder"
      note="未选中时显示占位文案，选中后换成选项 label。"
    >
      <FruitSelect />
    </ApiCard>
  )
}

/** 受控值 */
export function ControlledValueDemo() {
  const [value, setValue] = useState('apple')
  return (
    <ApiCard
      api="value / onValueChange"
      note="传入 value 即为受控。外部按钮也能改选中项。"
    >
      <FruitSelect value={value} onValueChange={setValue} />
      <div className="mt-1 flex flex-wrap gap-1">
        <button
          type="button"
          className="rounded-md border border-accent/40 px-2 py-0.5 text-[11px] text-accent hover:bg-accent/10"
          onClick={() => setValue('banana')}
        >
          设为香蕉
        </button>
        <button
          type="button"
          className="rounded-md border border-accent/40 px-2 py-0.5 text-[11px] text-accent hover:bg-accent/10"
          onClick={() => setValue('mango')}
        >
          设为芒果
        </button>
      </div>
      <Status>value = {value}</Status>
    </ApiCard>
  )
}

/** 受控开关 */
export function ControlledOpenDemo() {
  const [open, setOpen] = useState(false)
  return (
    <ApiCard api="open / onOpenChange" note="面板开关受控。可用外部按钮强制打开或关闭。">
      <FruitSelect defaultValue="pear" open={open} onOpenChange={setOpen} />
      <button
        type="button"
        className="mt-1 w-fit rounded-md border border-accent/40 px-2 py-0.5 text-[11px] text-accent hover:bg-accent/10"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '关闭面板' : '打开面板'}
      </button>
      <Status>open = {String(open)}</Status>
    </ApiCard>
  )
}

/** 初始展开 */
export function DefaultOpenDemo() {
  return (
    <ApiCard
      api="defaultOpen"
      note="非受控的初始打开状态。刷新后默认展开。"
      className="min-h-[240px]"
    >
      <FruitSelect defaultValue="apple" defaultOpen />
    </ApiCard>
  )
}

/** 整组禁用 */
export function DisabledSelectDemo() {
  return (
    <ApiCard api="disabled" note="根组件禁用：触发器不可点。">
      <FruitSelect defaultValue="pear" disabled />
    </ApiCard>
  )
}

/** 单项禁用 */
export function DisabledItemDemo() {
  return (
    <ApiCard
      api="SelectItem disabled"
      note="芒果不可选，其它项正常。禁用项仍会登记 label。"
    >
      <FruitSelect defaultValue="apple" disableValue="mango" />
    </ApiCard>
  )
}

/** 非字符串 children 时用 value 当触发器文案 */
export function CustomItemDemo() {
  return (
    <ApiCard
      api="SelectItem children"
      note="children 不是纯字符串时，触发器回退显示 value。"
    >
      <Select defaultValue="pear" className="w-full">
        <SelectTrigger>
          <SelectValue placeholder="选择" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">
            <span className="flex items-center gap-2">
              <Apple className="size-4" />
              <span>苹果</span>
            </span>
          </SelectItem>
          <SelectItem value="pear">
            <span className="flex items-center gap-2">
              <Wheat className="size-4" />
              <span>梨</span>
            </span>
          </SelectItem>
        </SelectContent>
      </Select>
    </ApiCard>
  )
}

/** 堆叠时互斥打开 */
export function ExclusiveOpenDemo() {
  const [opened, setOpened] = useState<'city' | 'fruit' | null>(null)

  return (
    <ApiCard
      api="open + onOpenChange（堆叠）"
      note="面板绝对定位会互相挡住。父级记下当前打开的那一个。"
      className="sm:col-span-2"
    >
      <div className="flex flex-col gap-3">
        <Select
          defaultValue="sh"
          className="w-full"
          open={opened === 'city'}
          onOpenChange={(next) => setOpened(next ? 'city' : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="城市" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sh">上海</SelectItem>
            <SelectItem value="bj">北京</SelectItem>
            <SelectItem value="gz">广州</SelectItem>
          </SelectContent>
        </Select>
        <Select
          defaultValue="apple"
          className="w-full"
          open={opened === 'fruit'}
          onOpenChange={(next) => setOpened(next ? 'fruit' : null)}
        >
          <SelectTrigger>
            <SelectValue placeholder="水果" />
          </SelectTrigger>
          <SelectContent>
            <FruitOptions />
          </SelectContent>
        </Select>
      </div>
      <Status>opened = {opened ?? 'null'}</Status>
    </ApiCard>
  )
}

export function MultipleDemo() {
  const [values, setValues] = useState<string[]>(['apple'])
  return (
    <ApiCard
      api="multiple"
      note="点选项切换，面板保持打开。新选中的 Tag 会弹出，已有 Tag 让位。"
    >
      <Select className="w-full" multiple value={values} onValueChange={setValues}>
        <SelectTrigger>
          <SelectValue placeholder="选择水果" />
        </SelectTrigger>
        <SelectContent>
          <FruitOptions />
        </SelectContent>
      </Select>
      <Status>onValueChange → {values.join(', ') || '(空)'}</Status>
    </ApiCard>
  )
}

/** 展柜入口：把 API 示例铺开，而不只是几个裸控件 */
export function SelectApiPreview() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
      <DefaultValueDemo />
      <PlaceholderDemo />
      <ControlledValueDemo />
      <ControlledOpenDemo />
      <DisabledSelectDemo />
      <DisabledItemDemo />
      <CustomItemDemo />
      <MultipleDemo />

      <DefaultOpenDemo />
      <ExclusiveOpenDemo />
    </div>
  )
}
