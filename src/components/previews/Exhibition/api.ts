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

export const modalApi: ApiSection[] = [
  {
    component: 'Modal',
    description: '根组件。≤640px 用 Drawer，否则用居中 Dialog。不依赖 overlay-kit。',
    props: [
      {
        name: 'open',
        type: 'boolean',
        defaultValue: '—',
        description: '受控开关。命令式路径由适配器传入 overlay 的 isOpen。',
      },
      {
        name: 'defaultOpen',
        type: 'boolean',
        defaultValue: '—',
        description: '非受控初始打开状态。仅在未传 open 时生效。',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        defaultValue: '—',
        description: '打开或关闭时回调。点遮罩 / Esc / ModalClose 都会走到这里。',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '只作用于 Dialog。平板与桌面宽度不同；手机抽屉忽略。',
      },
      {
        name: 'onExit',
        type: '() => void',
        defaultValue: '—',
        description:
          '关闭动画结束（或 400ms 兜底）后调用。命令式适配器用来 unmount overlay。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '必填',
        description: '通常为 ModalTrigger（可选）与 ModalContent。',
      },
    ],
  },
  {
    component: 'ModalTrigger / ModalClose',
    description: '打开与关闭。asChild 时把行为合并到子按钮上。',
    props: [
      {
        name: 'asChild',
        type: 'boolean',
        defaultValue: 'false',
        description: '为 true 时不渲染自己的 button，把 props 交给 children。',
      },
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '触发器 / 关闭控件的 class。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '—',
        description: '按钮文案或 asChild 时的实际控件。',
      },
    ],
  },
  {
    component: 'ModalContent',
    description: '面板。Dialog 上应用 size；抽屉为全宽 + max-h-[80vh]。',
    props: [
      {
        name: 'showCloseButton',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Dialog 右上角关闭按钮。Drawer 无此按钮。',
      },
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '面板容器 class。可覆盖默认 max-h 与 size 宽度。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '—',
        description: '通常为 Header、Body、Footer。',
      },
    ],
  },
  {
    component: 'ModalHeader / Title / Description / Body / Footer',
    description: '复合布局。Body 滚动，Header 与 Footer 钉住。',
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: '—',
        description: '各段容器 class。',
      },
      {
        name: 'children',
        type: 'ReactNode',
        defaultValue: '—',
        description: '该段内容。',
      },
    ],
  },
  {
    component: 'openModal / openModalAsync',
    description:
      'overlay-kit 适配器。从 @components/overlay/modal 导入，不要从 ui/Modal 导入。应用根需 OverlayProvider。',
    props: [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        defaultValue: "'md'",
        description: '传给内部 Modal，规则相同。',
      },
      {
        name: 'children',
        type: '({ close }) => ReactNode',
        defaultValue: '必填',
        description:
          '面板内容。openModal 的 close() 无返回值；openModalAsync 的 close(value) 决定 Promise。弹层内发起的请求应在卸载时 abort。',
      },
    ],
  },
]
