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
      {
        name: 'searchable',
        type: 'boolean',
        defaultValue: 'false',
        description:
          '为 true 时 Trigger 变成 combobox：点输入框打开面板并过滤选项。关面板或（多选）选中后清空搜索词。',
      },
      {
        name: 'searchValue',
        type: 'string',
        defaultValue: '—',
        description: '受控搜索词。传入后内部不再自己更新 query。',
      },
      {
        name: 'defaultSearchValue',
        type: 'string',
        defaultValue: '""',
        description: '非受控的初始搜索词。仅在未传 searchValue 时生效。',
      },
      {
        name: 'onSearch',
        type: '(query: string) => void',
        defaultValue: '—',
        description: '搜索词变化时回调。远程搜索可在这里拉数，并设 filter={false}。',
      },
      {
        name: 'filter',
        type: 'boolean | ((query: string, item: { value: string; label: string }) => boolean)',
        defaultValue: 'true',
        description:
          '本地过滤。false 时不隐藏选项（留给远程）；传入函数则替换默认的 label/value includes。',
      },
    ],
  },
  {
    component: 'SelectTrigger',
    description:
      '打开 / 关闭面板。默认为 button；searchable 时改为容器，combobox 角色在输入框上。圆角用 className 覆盖。',
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
      '触发器内的当前值。单选为纯文本；多选时每个 label 包一层 SelectTag。searchable 时在同一处渲染输入框，placeholder 成为 input 的占位。',
    props: [
      {
        name: 'placeholder',
        type: 'string',
        defaultValue: '"Select"',
        description:
          '尚未选中（或对应项尚未登记）时显示的占位文案。searchable 时写在输入框上；已有选中值时不显示。',
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
      '选项面板。关闭后仍挂载 children，避免触发器掉回占位符；视口不够时翻到上方。可搜索时列表限高滚动，无匹配时显示空态。',
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
          '列表中的展示内容。纯字符串会同时作为触发器 label 与搜索文本；否则触发器显示 value，可用 label / textValue 覆盖。',
      },
      {
        name: 'label',
        type: 'string',
        defaultValue: '—',
        description: '触发器文案。不传则用字符串 children，再否则 value。',
      },
      {
        name: 'textValue',
        type: 'string',
        defaultValue: '—',
        description: '仅用于本地搜索，不改触发器展示。适合 children 是图标或自定义节点的项。',
      },
    ],
  },
]
