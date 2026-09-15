'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { OverlayProvider } from 'overlay-kit'

import { Spinner } from '@components/ui/Spinner'

import { openModal, openModalAsync } from '@components/overlay/modal'
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  type ModalSize,
} from '@components/ui/Modal'

function ApiCard({
  api,
  note,
  children,
}: {
  api: string
  note: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-[240px] flex-col gap-2 rounded-lg border border-accent/20 bg-background/50 p-3 text-left">
      <code className="text-xs font-medium text-accent">{api}</code>
      <p className="text-xs text-foreground/70 text-pretty">{note}</p>
      {children}
    </div>
  )
}

function Status({ children }: { children: ReactNode }) {
  return <p className="mt-1 font-mono text-[11px] text-foreground/60">{children}</p>
}

const triggerBtn =
  'rounded-md border border-accent px-3 py-1.5 text-sm text-accent hover:bg-accent/10'
const outlineBtn = 'btn btn-outline'

export function TriggerDemo() {
  return (
    <ApiCard
      api="ModalTrigger"
      note="声明式。Trigger 写在 Modal 里，由 Dialog / Drawer 自己管开关。"
    >
      <Modal size="md">
        <ModalTrigger asChild>
          <button className={triggerBtn} type="button">
            打开弹窗
          </button>
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>组件标题</ModalTitle>
            <ModalDescription>平板和桌面居中，手机从底部滑出。</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p>≤640px 为 Drawer，更宽为 Dialog。</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <button type="button" className={outlineBtn}>
                关闭
              </button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ApiCard>
  )
}

export function ControlledDemo() {
  const [open, setOpen] = useState(false)

  return (
    <ApiCard api="open / onOpenChange" note="受控。外部按钮打开，不使用 ModalTrigger。">
      <button className={triggerBtn} type="button" onClick={() => setOpen(true)}>
        打开弹窗
      </button>
      <Status>open = {String(open)}</Status>
      <Modal size="md" open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>受控弹窗</ModalTitle>
            <ModalDescription>open 由父级持有。</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p>关闭走 onOpenChange(false)。</p>
          </ModalBody>
          <ModalFooter>
            <ModalClose asChild>
              <button type="button" className={outlineBtn}>
                取消
              </button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ApiCard>
  )
}

export function SizeDemo() {
  const [size, setSize] = useState<ModalSize>('md')
  const [open, setOpen] = useState(false)

  return (
    <ApiCard api="size" note="sm / md / lg 只作用于居中 Dialog。手机抽屉忽略 size。">
      <div className="flex flex-wrap gap-1">
        {(['sm', 'md', 'lg'] as const).map((next) => (
          <button
            key={next}
            type="button"
            className={triggerBtn}
            onClick={() => {
              setSize(next)
              setOpen(true)
            }}
          >
            {next}
          </button>
        ))}
      </div>
      <Status>size = {size}</Status>
      <Modal size={size} open={open} onOpenChange={setOpen}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>size={size}</ModalTitle>
            <ModalDescription>桌面比平板更宽一档。</ModalDescription>
          </ModalHeader>
          <ModalFooter>
            <ModalClose asChild>
              <button type="button" className={outlineBtn}>
                关闭
              </button>
            </ModalClose>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ApiCard>
  )
}

export function OpenModalDemo() {
  return (
    <ApiCard api="openModal" note="命令式。不必持有 open；根上要有 OverlayProvider。">
      <button
        className={triggerBtn}
        type="button"
        onClick={() => {
          openModal({
            size: 'sm',
            children: ({ close }) => (
              <>
                <ModalHeader>
                  <ModalTitle>命令式弹窗</ModalTitle>
                  <ModalDescription>openModal，无需本地 open 状态。</ModalDescription>
                </ModalHeader>
                <ModalBody>
                  <p>由 overlay-kit 在 Provider 内挂载。</p>
                </ModalBody>
                <ModalFooter>
                  <button type="button" className={outlineBtn} onClick={close}>
                    知道了
                  </button>
                </ModalFooter>
              </>
            ),
          })
        }}
      >
        打开弹窗
      </button>
    </ApiCard>
  )
}

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      window.clearTimeout(id)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const id = window.setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    if (signal.aborted) {
      onAbort()
      return
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

async function fetchDraft(id: string, signal: AbortSignal) {
  await wait(700, signal)
  return { id, title: '未完成的分层设计笔记' }
}

async function deleteDraft(_id: string, signal: AbortSignal) {
  await wait(500, signal)
}

type DeleteDraftResult = { deleted: true; title: string } | false

function DeleteDraftDialog({
  draftId,
  close,
}: {
  draftId: string
  close: (value?: DeleteDraftResult) => void
}) {
  const [title, setTitle] = useState<string | null>(null)
  const [phase, setPhase] = useState<'loading' | 'ready' | 'deleting' | 'error'>(
    'loading',
  )
  const loadAcRef = useRef<AbortController | null>(null)
  const deleteAcRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    loadAcRef.current = ac
    setPhase('loading')
    setTitle(null)

    fetchDraft(draftId, ac.signal)
      .then((draft) => {
        if (ac.signal.aborted) return
        setTitle(draft.title)
        setPhase('ready')
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        setPhase('error')
      })

    return () => {
      ac.abort()
      deleteAcRef.current?.abort()
    }
  }, [draftId])

  function abortPending() {
    loadAcRef.current?.abort()
    deleteAcRef.current?.abort()
  }

  async function onConfirm() {
    if (!title) return
    const ac = new AbortController()
    deleteAcRef.current = ac
    setPhase('deleting')
    try {
      await deleteDraft(draftId, ac.signal)
      if (ac.signal.aborted) return
      close({ deleted: true, title })
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      setPhase('error')
    }
  }

  return (
    <>
      <ModalHeader>
        <ModalTitle>删除草稿？</ModalTitle>
        <ModalDescription>
          打开时拉取标题；关掉会 abort 请求。确认后再发删除。
        </ModalDescription>
      </ModalHeader>
      <ModalBody>
        {phase === 'loading' && (
          <p className="flex items-center gap-2">
            <Spinner size="sm" />
            正在加载草稿…
          </p>
        )}
        {phase === 'error' && <p>请求失败，请关闭后重试。</p>}
        {(phase === 'ready' || phase === 'deleting') && title && (
          <p>将永久删除「{title}」。此操作不能撤销。</p>
        )}
      </ModalBody>
      <ModalFooter>
        <button
          type="button"
          className={outlineBtn}
          disabled={phase === 'deleting'}
          onClick={() => {
            abortPending()
            close(false)
          }}
        >
          取消
        </button>
        <button
          type="button"
          className={outlineBtn}
          disabled={phase !== 'ready'}
          onClick={() => void onConfirm()}
        >
          {phase === 'deleting' ? '删除中…' : '确认删除'}
        </button>
      </ModalFooter>
    </>
  )
}

export function OpenModalAsyncDemo() {
  const [log, setLog] = useState('—')

  return (
    <ApiCard
      api="openModalAsync"
      note="打开后请求草稿；Esc / 取消 abort 并结束 Promise。确认后先删除再 close 结果。"
    >
      <button
        className={triggerBtn}
        type="button"
        onClick={async () => {
          setLog('等待确认…')
          const result = await openModalAsync<DeleteDraftResult>({
            size: 'sm',
            children: ({ close }) => (
              <DeleteDraftDialog draftId="draft-1" close={close} />
            ),
          })

          if (result) {
            setLog(`已删除「${result.title}」`)
            return
          }
          if (result === false) {
            setLog('已取消，未发删除请求')
            return
          }
          setLog('已关闭（Esc），请求已 abort')
        }}
      >
        删除草稿
      </button>
      <Status>{log}</Status>
    </ApiCard>
  )
}

/** 与 SelectApiPreview 相同：按 API 拆成卡片，而不是一排裸按钮。 */
export function ModalApiPreview() {
  return (
    <OverlayProvider>
      <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
        <TriggerDemo />
        <ControlledDemo />
        <SizeDemo />
        <OpenModalDemo />
        <OpenModalAsyncDemo />
      </div>
    </OverlayProvider>
  )
}
