export interface ApiProp {
  name: string
  type: string
  defaultValue: string
  description: string
}

export interface ApiSection {
  component: string
  description: string
  props: ApiProp[]
}

export const selectApi: ApiSection[] = [
  {
    component: 'Select',
    description: '根组件。持有选中值、面板开关、选项标签表和放置方向。',
    props: [
      {
        name: 'value',
        type: 'string',
        defaultValue: '—',
        description: '受控选中值。传入后由外部决定当前项，内部不再写入。',
      },
      {
        name: 'defaultValue',
        type: 'string',
        defaultValue: '—',
        description: '非受控初始选中值。仅在未传 value 时生效。',
      },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        defaultValue: '—',
        description: '选中项变化时回调。受控与非受控都会触发。',
      },
      {
        name: 'open',
        type: 'boolean',
        defaultValue: '—',
        description: '受控的面板打开状态。堆叠多个 Select 时由父级持有，避免面板互相遮挡。',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        defaultValue: 'false',
        description: '非受控的初始打开状态。仅在未传 open 时生效。',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        defaultValue: '—',
        description: '面板打开或关闭时回调。受控与非受控都会触发。',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用整个选择器。触发器不可点，选项仍会渲染并登记 label。',
      },
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '根节点 class。根节点是 relative 定位容器。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '必填',
        description: '通常为 SelectTrigger 与 SelectContent。',
      },
    ],
  },
  {
    component: 'SelectTrigger',
    description: '打开 / 关闭面板的按钮。圆角动画跟随面板放置方向。',
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '触发器按钮 class。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '必填',
        description: '通常放 SelectValue，右侧会自动渲染 Chevron。',
      },
    ],
  },
  {
    component: 'SelectValue',
    description: '触发器内的当前值。文案来自 SelectItem 登记的 label。',
    props: [
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: '"Select"',
        description: '尚未选中（或对应项尚未登记）时显示的占位文案。',
      },
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '展示文案的 span class。有值用前景色，占位符用 muted。',
      },
    ],
  },
  {
    component: 'SelectContent',
    description: '选项面板。关闭后仍挂载 children，避免触发器掉回占位符；视口不够时翻到上方。',
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '面板容器 class。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '必填',
        description: '若干 SelectItem。不要在关闭时条件卸载，否则 label 会丢失。',
      },
    ],
  },
  {
    component: 'SelectItem',
    description: '列表中的一项。挂载时把 value → label 登记到根组件。',
    props: [
      {
        name: 'value',
        type: 'string',
        defaultValue: '必填',
        description: '机器可读值。选中后写入上下文，并作为非字符串 children 时的回退文案。',
      },
      {
        name: 'disabled',
        type: 'boolean',
        defaultValue: 'false',
        description: '禁用该项：不可点击，仍会登记 label。',
      },
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '选项按钮 class。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '必填',
        description: '列表中的展示内容。纯字符串会同时作为触发器 label；否则触发器显示 value。',
      },
    ],
  },
]
