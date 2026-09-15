import { useState } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from '@components/ui/Modal'

function mockMatchMedia(isMobile: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: isMobile && query.includes('max-width: 640px'),
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

function renderOpenModal(
  extra?: { size?: 'sm' | 'md' | 'lg'; onOpenChange?: (open: boolean) => void; onExit?: () => void },
) {
  return render(
    <Modal open onOpenChange={extra?.onOpenChange} size={extra?.size} onExit={extra?.onExit}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>标题</ModalTitle>
          <ModalDescription>描述</ModalDescription>
        </ModalHeader>
        <ModalBody>内容</ModalBody>
        <ModalFooter>
          <ModalClose>关闭</ModalClose>
        </ModalFooter>
      </ModalContent>
    </Modal>,
  )
}

describe('Modal', () => {
  afterEach(() => {
    mockMatchMedia(false)
    vi.useRealTimers()
  })

  it('非手机时使用 Dialog', () => {
    mockMatchMedia(false)
    renderOpenModal()

    expect(document.querySelector('[data-slot="dialog-content"]')).toBeTruthy()
    expect(document.querySelector('[data-slot="drawer-content"]')).toBeNull()
    expect(screen.getByRole('dialog', { name: '标题' })).toBeTruthy()
  })

  it('手机时使用 Drawer', async () => {
    mockMatchMedia(true)
    renderOpenModal()

    await waitFor(() => {
      expect(document.querySelector('[data-slot="drawer-content"]')).toBeTruthy()
    })
    expect(document.querySelector('[data-slot="dialog-content"]')).toBeNull()
  })

  it('size=md 只作用在 Dialog 上并覆盖默认 sm:max-w-lg', () => {
    mockMatchMedia(false)
    renderOpenModal({ size: 'md' })

    const content = document.querySelector('[data-slot="dialog-content"]')
    expect(content?.className).toContain('max-w-md')
    expect(content?.className).toContain('sm:max-w-md')
    expect(content?.className).toContain('min-[1025px]:max-w-lg')
    expect(content?.className).not.toContain('sm:max-w-lg')
  })

  it('点 Close 时 onOpenChange(false)', () => {
    mockMatchMedia(false)
    const onOpenChange = vi.fn()
    renderOpenModal({ onOpenChange })

    fireEvent.click(screen.getByRole('button', { name: '关闭' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('关闭后在退出等待结束时调用 onExit', () => {
    mockMatchMedia(false)
    vi.useFakeTimers()
    const onExit = vi.fn()

    function Harness() {
      const [open, setOpen] = useState(true)
      return (
        <Modal open={open} onOpenChange={setOpen} onExit={onExit}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>标题</ModalTitle>
              <ModalDescription>描述</ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <ModalClose>关闭</ModalClose>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )
    }

    render(<Harness />)
    fireEvent.click(screen.getByRole('button', { name: '关闭' }))
    expect(onExit).not.toHaveBeenCalled()

    vi.advanceTimersByTime(400)
    expect(onExit).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
