import { fireEvent, render, screen } from '@testing-library/react'
import { OverlayProvider } from 'overlay-kit'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { openModalAsync } from '@components/overlay/modal'
import {
  ModalBody,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@components/ui/Modal'

function mockDesktop() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  })
}

describe('openModalAsync', () => {
  afterEach(() => {
    mockDesktop()
    vi.useRealTimers()
  })

  it('点确认时 resolve true', async () => {
    mockDesktop()
    const resultPromise = Promise.withResolvers<boolean | undefined>()

    render(
      <OverlayProvider>
        <button
          type="button"
          onClick={() => {
            void openModalAsync<boolean>({
              size: 'sm',
              children: ({ close }) => (
                <>
                  <ModalHeader>
                    <ModalTitle>确认删除？</ModalTitle>
                    <ModalDescription>此操作不可撤销</ModalDescription>
                  </ModalHeader>
                  <ModalBody>此操作不可撤销</ModalBody>
                  <ModalFooter>
                    <button type="button" onClick={() => close(true)}>
                      删除
                    </button>
                  </ModalFooter>
                </>
              ),
            }).then((value) => resultPromise.resolve(value))
          }}
        >
          打开
        </button>
      </OverlayProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: '打开' }))
    await screen.findByRole('dialog', { name: '确认删除？' })
    fireEvent.click(screen.getByRole('button', { name: '删除' }))

    await expect(resultPromise.promise).resolves.toBe(true)
  })

  it('Esc 关闭时 resolve undefined', async () => {
    mockDesktop()
    const resultPromise = Promise.withResolvers<boolean | undefined>()

    render(
      <OverlayProvider>
        <button
          type="button"
          onClick={() => {
            void openModalAsync<boolean>({
              children: ({ close }) => (
                <>
                  <ModalHeader>
                    <ModalTitle>确认？</ModalTitle>
                    <ModalDescription>点遮罩关闭</ModalDescription>
                  </ModalHeader>
                  <ModalFooter>
                    <button type="button" onClick={() => close(false)}>
                      取消
                    </button>
                  </ModalFooter>
                </>
              ),
            }).then((value) => resultPromise.resolve(value))
          }}
        >
          打开
        </button>
      </OverlayProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: '打开' }))
    await screen.findByRole('dialog', { name: '确认？' })
    fireEvent.keyDown(document, { key: 'Escape' })

    await expect(resultPromise.promise).resolves.toBeUndefined()
  })
})
