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
        type: 'string | string[]',
        defaultValue: '—',
        description: '受控选中值。multiple 时为 string[]，传入 [] 表示受控且未选。',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        defaultValue: '—',
        description: '非受控初始值。multiple 时为 string[]。',
      },
      {
        name: 'onValueChange',
        type: '(value: string | string[]) => void',
        defaultValue: '—',
        description: '选中变化回调。单选为 string，multiple 时为 string[]。',
      },

      {
        name: 'open',
        type: 'boolean',
        defaultValue: '—',
        description:
          '受控的面板打开状态。堆叠多个 Select 时由父级持有，避免面板互相遮挡。',
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
      {
        name: 'multiple',
        type: 'boolean',
        defaultValue: 'false',
        description:
          '为 true 时多选。value / defaultValue / onValueChange 变为 string[]；点选项切换且不关面板。',
      },
    ],
  },
  {
    component: 'SelectTrigger',
    description: '打开 / 关闭面板的按钮。圆角用 className 覆盖，例如 rounded-lg。',
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '触发器按钮 class。可覆盖默认 rounded-xl；开合不会写 inline 圆角。',
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
    description:
      '触发器内的当前值。单选为纯文本；多选时每个 label 包一层 SelectTag，追加时播放入场。',
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
        description: '容器 class。未选中时是占位文案；单选是纯文本，多选是 Tag 列表。',
      },
    ],
  },
  {
    component: 'SelectContent',
    description:
      '选项面板。关闭后仍挂载 children，避免触发器掉回占位符；视口不够时翻到上方。',
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description:
          '面板容器 class。可覆盖默认 rounded-xl；高度与缝隙仍由 Motion 驱动。',
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
        description:
          '机器可读值。选中后写入上下文，并作为非字符串 children 时的回退文案。',
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
        description:
          '列表中的展示内容。纯字符串会同时作为触发器 label；否则触发器显示 value。',
      },
    ],
  },
]
